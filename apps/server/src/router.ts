import { initTRPC } from '@trpc/server'

export const t = initTRPC.create()

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
