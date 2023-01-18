import { UserData } from '../config/types'
import state from '../state'
import * as SecureStore from 'expo-secure-store'

export const setAuth = (token: string | null, user: UserData | null) => {
    state.auth.token.set(token)
    state.auth.user.set(user)
    if (token === null) SecureStore.deleteItemAsync('token')
    else SecureStore.setItemAsync('token', token)
}
