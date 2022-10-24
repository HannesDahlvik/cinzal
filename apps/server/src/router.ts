import { initTRPC } from '@trpc/server'
import { Context } from './context'

export const t = initTRPC.context<Context>().create()

import { authRouter, calendarRouter, eventsRouter, notesRouter, tasksRouter } from './routes'

/**
 * TRPC ROUTER
 */
const appRouter = t.router({
    auth: authRouter,
    calendar: calendarRouter,
    events: eventsRouter,
    notes: notesRouter,
    tasks: tasksRouter
})

export type AppRouter = typeof appRouter

export default appRouter
