import express from 'express'
import 'dotenv/config'

import appRouter from './router'
import * as trpcExpress from '@trpc/server/adapters/express'

import { PrismaClient } from '@prisma/client'

import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'

export const prisma = new PrismaClient()
const app = express()
const PORT = 8080 || process.env.SERVER_PORT

/**
 * SERVER MIDDLEWARE
 */
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors())

app.use(helmet())

app.use(compression())

app.use(morgan('tiny'))

/**
 * ROUTES
 */
app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter
    })
)

/**
 * START SERVER
 */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
