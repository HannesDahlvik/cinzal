import { VerifyDecoded } from './config/types'
import { User } from '@prisma/client'

import * as trpc from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws'

import jwt from 'jsonwebtoken'
import { ee } from './utils'

export const createContext = async ({
    req
}: CreateExpressContextOptions | CreateWSSContextFnOptions) => {
    const token = req.headers.authorization

    const getUser = (): null | User => {
        if (token) {
            const { user } = jwt.decode(token) as VerifyDecoded
            return user
        }
        return null
    }

    return {
        ee,
        token,
        user: getUser()
    }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
