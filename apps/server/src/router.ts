import { initTRPC } from '@trpc/server'

export const t = initTRPC.create()

import { tasksRouter } from './routes'

/**
 * TRPC ROUTER
 */
const appRouter = t.router({
    tasks: tasksRouter
})

export type AppRouter = typeof appRouter

export default appRouter
