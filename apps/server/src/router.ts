import { initTRPC } from '@trpc/server'
import { Context } from './context'

export const t = initTRPC.context<Context>().create()

import { authRouter, calendarRouter, tasksRouter } from './routes'

/**
 * TRPC ROUTER
 */
const appRouter = t.router({
    auth: authRouter,
    calendar: calendarRouter,
    tasks: tasksRouter
})

export type AppRouter = typeof appRouter

export default appRouter
