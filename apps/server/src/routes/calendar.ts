import { t } from '../router'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

import ical from 'node-ical'

import isAuthed from '../middleware/isAuthed'
import { CalendarResponse } from '../config/types'
import { prisma } from '../server'

const cp = t.procedure.use(isAuthed)

const calendarRouter = t.router({
    getICalLinks: cp.query(async ({ ctx }) => {
        try {
            const links = await prisma.calendar
                .findMany({ where: { uuid: ctx.user?.uuid } })
                .catch(() => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Database error'
                    })
                })
            const arr: string[] = []
            links.map((val) => arr.push(val.link))

            return arr
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
                links: z.string().array()
            })
        )
        .query(async ({ input }) => {
            try {
                const arr = await Promise.all(
                    input.links.map(async (row) => {
                        const data = await ical.async.fromURL(row)
                        return data
                    })
                )

                const data: CalendarResponse[] = []
                arr.map((obj) => {
                    Object.entries(obj).map((row) => {
                        data.push(row[1] as CalendarResponse)
                    })
                })

                return data
            } catch (err) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'iCal error'
                })
            }
        })
})

export default calendarRouter
