import { t } from '../router'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { prisma } from '../server'
import { ap } from '../middleware/isAuthed'

import ical from 'node-ical'

const eventsRouter = t.router({
    all: ap
        .input(
            z.object({
                calendarUrls: z
                    .object({
                        id: z.number(),
                        url: z.string(),
                        uuid: z.string()
                    })
                    .array()
                    .optional()
            })
        )
        .query(async ({ ctx, input }) => {
            if (input.calendarUrls) {
                const arr = await Promise.all(
                    input.calendarUrls.map(async (row) => {
                        return await ical.async.fromURL(row.url)
                    })
                )

                const data: ical.VEvent[] = []
                arr.map((obj) => {
                    Object.entries(obj).map((row) => {
                        if (row[1].type === 'VEVENT') data.push(row[1])
                    })
                })

                const events = await prisma.event
                    .findMany({ where: { uuid: ctx.user.uuid } })
                    .catch((err) => {
                        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message })
                    })

                return [...events, ...data]
            }

            const events = await prisma.event
                .findMany({ where: { uuid: ctx.user.uuid } })
                .catch((err) => {
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: err.message })
                })
            return events
        }),
    create: ap
        .input(
            z.object({
                title: z.string(),
                description: z.string(),
                location: z.string(),
                start: z.date(),
                end: z.date()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const newEvent = await prisma.event
                .create({
                    data: {
                        ...input,
                        uuid: ctx.user.uuid
                    }
                })
                .catch((err) => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: err.message
                    })
                })

            return newEvent
        }),
    delete: ap
        .input(
            z.object({
                id: z.number()
            })
        )
        .mutation(async ({ input }) => {
            const deletedEvent = await prisma.event
                .delete({
                    where: {
                        id: input.id
                    }
                })
                .catch((err) => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: err.message
                    })
                })

            return deletedEvent
        })
})

export default eventsRouter
