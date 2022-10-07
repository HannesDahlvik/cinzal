import * as trpc from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'

import verifyJwtToken from './utils/verifyJwtToken'

export const createContext = async ({ req }: trpcExpress.CreateExpressContextOptions) => {
    const token = req.headers.authorization

    const user = verifyJwtToken(token)

    return {
        token,
        user: user?.user
    }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
