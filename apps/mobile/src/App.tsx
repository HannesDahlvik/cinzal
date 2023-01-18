import React, { useEffect, useState } from 'react'

import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import RootNavigator from './navigation/Root'
import LoadingScreen from './screens/Loading'

import { useTheme } from 'native-base'

import { setAuth, storage, trpc, useErrorHandler } from './utils'

const App: React.FC = () => {
    const errorHandler = useErrorHandler()

    const { colors } = useTheme()

    const { mutate: authVerifyMutation } = trpc.auth.verify.useMutation()

    const [render, setRender] = useState(false)

    useEffect(() => {
        const checkUser = async () => {
            const token = await storage.get('token')

            if (token) {
                authVerifyMutation(null, {
                    onError: (err) => {
                        if (err.message.includes('jwt expired')) errorHandler('Auth expired')
                        else errorHandler(err.message)
                        setAuth(null, null)
                        setRender(true)
                    },
                    onSuccess: (data) => {
                        const currentTime = Date.now() / 1000
                        if (data.exp < currentTime) {
                            setAuth(null, null)
                            setRender(true)
                            return
                        }
                        setAuth(token, data.user)
                        setRender(true)
                    }
                })
            } else setRender(true)
        }
        checkUser()
    }, [])

    if (render)
        return (
            <NavigationContainer
                theme={{
                    ...DefaultTheme,
                    colors: { ...DefaultTheme.colors, background: colors.dark[700] }
                }}
            >
                <RootNavigator />
            </NavigationContainer>
        )
    else return <LoadingScreen />
}

export default App
