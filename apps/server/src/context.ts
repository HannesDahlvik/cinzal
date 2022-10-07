import { VerifyDecoded } from './config/types'
import { User } from '@prisma/client'
import * as trpc from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'

import jwt from 'jsonwebtoken'

export const createContext = async ({ req }: trpcExpress.CreateExpressContextOptions) => {
    const token = req.headers.authorization

    const getUser = (): null | User => {
        if (token) {
            const { user } = jwt.decode(token) as VerifyDecoded
            return user
        }
        return null
    }

    return {
        token,
        user: getUser()
    }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
