import config from '../config'

import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { TRPCError } from '@trpc/server'

const genJwtToken = (user: User) => {
    const payload = {
        user: {
            id: user.id,
            uuid: user.uuid,
            username: user.username,
            email: user.email,
            redirectDashboard: user.redirectDashboard,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' })
    if (!token)
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'There was an error with auth' })

    return {
        token,
        ...payload
    }
}

export default genJwtToken
