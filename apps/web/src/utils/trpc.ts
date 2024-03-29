import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@cz/server/src/router'

export const trpc = createTRPCReact<AppRouter>()
