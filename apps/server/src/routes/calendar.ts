import { t } from '../router'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

import { ap } from '../middleware/isAuthed'
import { prisma } from '../server'

const calendarRouter = t.router({
    links: ap.query(async ({ ctx }) => {
        const calendars = await prisma.calendar
            .findMany({ where: { uuid: ctx.user?.uuid } })
            .catch(() => {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Database error'
                })
            })

        return calendars
    }),
    add: ap
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
    edit: ap
        .input(
            z.object({
                id: z.number(),
                name: z.string(),
                url: z.string(),
                show: z.boolean()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const editedCalendar = await prisma.calendar
                .update({
                    data: {
                        url: input.url,
                        name: input.name,
                        show: input.show,
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
    delete: ap
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
