import express from 'express'
import https from 'node:https'
import fs from 'node:fs'
import 'dotenv/config'

import appRouter from './router'
import { createContext } from './context'
import * as trpcExpress from '@trpc/server/adapters/express'

import { PrismaClient } from '@prisma/client'

import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'

export const prisma = new PrismaClient()
const app = express()
const PORT = process.env.SERVER_PORT
const isProd = process.env.NODE_ENV === 'prod'

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
        router: appRouter,
        createContext
    })
)

/**
 * START SERVER
 */
if (isProd)
    https
        .createServer(
            {
                key: fs.readFileSync('key.pem'),
                cert: fs.readFileSync('cert.pem')
            },
            app
        )
        .listen(PORT, () => console.log(`Server running on port ${PORT} - PROD`))
else app.listen(PORT, () => console.log(`Server running on port ${PORT} - DEV`))
