import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import * as SecureStore from 'expo-secure-store'

import config from './config'
import theme from './config/theme'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { trpc } from './utils/trpc'
import { httpBatchLink } from '@trpc/client'

import { NativeBaseProvider } from 'native-base'
import { IconContext } from 'phosphor-react-native'

import SuperJSON from 'superjson'

interface Props {
    children: React.ReactNode
}

const Providers: React.FC<Props> = ({ children }) => {
    const [queryClient, setQueryClient] = useState<any>()
    const [trpcClient, setTrpcClient] = useState<any>()

    useEffect(() => {
        const getToken = async () => {
            const token = await SecureStore.getItemAsync('token')

            setQueryClient(() => new QueryClient())
            setTrpcClient(() =>
                trpc.createClient({
                    transformer: SuperJSON,
                    links: [
                        httpBatchLink({
                            url: config.serverURL,
                            headers() {
                                if (token)
                                    return {
                                        Authorization: token
                                    }
                                else return {}
                            }
                        })
                    ]
                })
            )
        }
        getToken()
    }, [])

    if (trpcClient && queryClient)
        return (
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    <NativeBaseProvider theme={theme}>
                        <IconContext.Provider value={{ weight: 'fill', color: '#fff' }}>
                            <StatusBar style="light" />
                            {children}
                        </IconContext.Provider>
                    </NativeBaseProvider>
                </QueryClientProvider>
            </trpc.Provider>
        )
    else return null
}

export default Providers
