import { t } from '../router'
import { TRPCError } from '@trpc/server'

import { verifyJwtToken } from '../utils'

const isAuthed = t.middleware(async ({ ctx, next }) => {
    const verifed = verifyJwtToken(ctx.token)
    if (!verifed) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not authorized' })

    return next({
        ctx: {
            user: verifed.user,
            token: ctx.token as string
        }
    })
})

export const ap = t.procedure.use(isAuthed)

export default isAuthed
