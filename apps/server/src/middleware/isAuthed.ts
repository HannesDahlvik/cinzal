import { t } from '../router'
import { TRPCError } from '@trpc/server'

import verifyJwtToken from '../utils/verifyJwtToken'

const isAuthed = t.middleware(async ({ ctx, next }) => {
    const verifed = verifyJwtToken(ctx.token)
    if (!verifed) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not authorized' })

    return next()
})

export default isAuthed
