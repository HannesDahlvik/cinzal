import { hookstate } from '@hookstate/core'

import { UserData } from '../config/types'

const auth = {
    token: hookstate<null | string>(null),
    user: hookstate<null | UserData>(null)
}

export default auth
