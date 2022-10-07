import { t } from '../router'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

import ical from 'node-ical'

import isAuthed from '../middleware/isAuthed'
import { CalendarResponse } from '../config/types'

const cp = t.procedure.use(isAuthed)

const calendarRouter = t.router({
    getEvents: cp
        .input(
            z.object({
                ical: z.string()
            })
        )
        .query(async ({ input }) => {
            try {
                const data = await ical.async.fromURL(input.ical)
                return data as unknown as CalendarResponse[]
            } catch (err) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'iCal error'
                })
            }
        })
})

export default calendarRouter
