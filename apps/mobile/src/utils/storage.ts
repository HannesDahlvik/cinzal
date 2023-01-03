import * as SecureStore from 'expo-secure-store'

export const storage = {
    get: async (key: string) => {
        const result = await SecureStore.getItemAsync(key)
        return result
    },
    set: async (key: string, value: string) => {
        await SecureStore.setItemAsync(key, value)
        return
    }
}
