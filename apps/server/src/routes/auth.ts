import config from '../config'
import { VerifyDecoded } from '../config/types'

import { t } from '../router'
import { z } from 'zod'
import { prisma } from '../server'
import { TRPCError } from '@trpc/server'

import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import jwt from 'jsonwebtoken'
import genJwtToken from '../utils/genJwtToken'
import { ap } from '../middleware/isAuthed'

const authRouter = t.router({
    verify: ap.input(z.null()).mutation(async ({ ctx }) => {
        const token = ctx.token

        if (!token) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not logged in' })

        const decoded = jwt.verify(token, config.jwtSecret)
        if (!decoded)
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Unauthorized invalid token'
            })

        return decoded as VerifyDecoded
    }),
    login: t.procedure
        .input(
            z.object({
                email: z.string(),
                password: z.string()
            })
        )
        .mutation(async ({ input }) => {
            const user = await prisma.user
                .findFirst({ where: { email: input.email } })
                .catch((err) => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: err.message
                    })
                })
            if (!user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User does not exist' })

            const isMatch = await bcrypt.compare(input.password, user.password)
            if (!isMatch)
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Incorrect password' })

            const token = genJwtToken(user)
            return token
        }),
    signup: t.procedure
        .input(
            z.object({
                username: z.string(),
                email: z.string(),
                password: z.string()
            })
        )
        .mutation(async ({ input }) => {
            const user = await prisma.user
                .findFirst({ where: { email: input.email } })
                .catch((err) => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: err.message
                    })
                })
            if (user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User already exists' })

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(input.password, salt)
            const userID = uuid()

            const newUser = await prisma.user
                .create({
                    data: {
                        uuid: userID,
                        username: input.username,
                        email: input.email,
                        password: hashedPassword
                    }
                })
                .catch((err) => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: err.message
                    })
                })

            if (!newUser)
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'There was an error with creating new user'
                })

            const token = genJwtToken(newUser)
            return token
        }),
    update: ap
        .input(
            z.object({
                username: z.string().optional(),
                redirectDashboard: z.boolean().optional()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updatedUser = await prisma.user
                .update({
                    where: {
                        uuid: ctx.user.uuid
                    },
                    data: {
                        username: input.username ? input.username : ctx.user.username,
                        redirectDashboard: input.redirectDashboard
                            ? input.redirectDashboard
                            : ctx.user.redirectDashboard
                    }
                })
                .catch((err) => {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: err.message
                    })
                })

            const newUser = genJwtToken(updatedUser)

            return {
                token: newUser.token,
                user: newUser.user
            }
        })
})

export default authRouter
