import { UserData } from '../config/types'
import state from '../state'

const setAuth = (token: string | null, user: UserData | null) => {
    state.auth.token.set(token)
    state.auth.user.set(user)
    if (token === null) localStorage.removeItem('token')
    else localStorage.setItem('token', token as string)
}

export default setAuth
