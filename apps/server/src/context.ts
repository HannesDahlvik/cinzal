import * as trpc from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'

export const createContext = async ({ req }: trpcExpress.CreateExpressContextOptions) => {
    const token = req.headers.authorization

    return {
        token
    }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
