import express from 'express'
import http from 'node:http'
import { Server } from 'ws'
import 'dotenv/config'

import { config } from './config'

import appRouter, { AppRouter } from './router'
import { createContext } from './context'
import * as trpcExpress from '@trpc/server/adapters/express'
import { applyWSSHandler } from '@trpc/server/adapters/ws'

import { PrismaClient } from '@prisma/client'

import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'

export const prisma = new PrismaClient()
const app = express()
const server = http.createServer(app)
const PORT = config.port
const WS_PORT = config.wsPort

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
 * WEBSOCKET SETUP
 */
const wss = new Server({ port: WS_PORT })
const wsHandle = applyWSSHandler<AppRouter>({
    wss,
    router: appRouter,
    createContext
})

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
server.listen(PORT, () =>
    console.log(`Server running on port ${PORT} \nWebSocket server running on port ${WS_PORT}`)
)
server.on('error', console.error)

process.on('SIGTERM', () => {
    wsHandle.broadcastReconnectNotification()
    wss.close()
    server.close()
})
