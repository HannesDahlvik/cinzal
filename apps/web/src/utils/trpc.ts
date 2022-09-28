import { createTRPCReact } from '@trpc/react'
import type { AppRouter } from '@cz/server/src/router'

const trpc = createTRPCReact<AppRouter>()

export default trpc
