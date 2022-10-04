import { initTRPC } from '@trpc/server'
import { Context } from './context'

export const t = initTRPC.context<Context>().create()

import { authRouter, tasksRouter } from './routes'

/**
 * TRPC ROUTER
 */
const appRouter = t.router({
    auth: authRouter,
    tasks: tasksRouter
})

export type AppRouter = typeof appRouter

export default appRouter
