import { t } from '../router'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

import ical from 'node-ical'

import isAuthed from '../middleware/isAuthed'
import { prisma } from '../server'

const cp = t.procedure.use(isAuthed)

const calendarRouter = t.router({
    getICalLinks: cp.query(async ({ ctx }) => {
        try {
            const calendars = await prisma.calendar
                .findMany({ where: { uuid: ctx.user?.uuid } })
                .catch(() => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Database error'
                    })
                })

            return calendars
        } catch (err: any) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: err.message
            })
        }
    }),
    getICalEventsFromUrls: cp
        .input(
            z.object({
                links: z
                    .object({
                        id: z.number(),
                        url: z.string(),
                        uuid: z.string()
                    })
                    .array()
            })
        )
        .query(async ({ input }) => {
            try {
                const arr = await Promise.all(
                    input.links.map(async (row) => {
                        const data = await ical.async.fromURL(row.url)
                        return data
                    })
                )

                const data: ical.VEvent[] = []
                arr.map((obj) => {
                    Object.entries(obj).map((row) => {
                        if (row[1].type === 'VEVENT') data.push(row[1])
                    })
                })

                return data
            } catch (err) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'iCal error'
                })
            }
        }),
    addCalendar: cp
        .input(
            z.object({
                name: z.string(),
                url: z.string().url()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const newCalendar = await prisma.calendar
                .create({
                    data: {
                        url: input.url,
                        name: input.name,
                        uuid: ctx.user.uuid
                    }
                })
                .catch(() => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Database error'
                    })
                })

            return newCalendar
        }),
    editCalendar: cp
        .input(
            z.object({
                id: z.number(),
                name: z.string(),
                url: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const editedCalendar = await prisma.calendar
                .update({
                    data: {
                        url: input.url,
                        name: input.name,
                        uuid: ctx.user.uuid
                    },
                    where: { id: input.id }
                })
                .catch(() => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Database error'
                    })
                })

            return editedCalendar
        }),
    deleteCalendar: cp
        .input(
            z.object({
                id: z.number()
            })
        )
        .mutation(async ({ input }) => {
            await prisma.calendar
                .delete({
                    where: { id: input.id }
                })
                .catch(() => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Database error'
                    })
                })

            return
        })
})

export default calendarRouter
