import { useState } from 'react'
import { StatusBar } from 'expo-status-bar'

import config from './config'
import theme from './config/theme'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { storage, trpc } from './utils'
import { httpBatchLink } from '@trpc/client'
import SuperJSON from 'superjson'

import { NativeBaseProvider } from 'native-base'
import { IconContext } from 'phosphor-react-native'

interface Props {
    children: React.ReactNode
}

const Providers: React.FC<Props> = ({ children }) => {
    const [queryClient] = useState(() => new QueryClient())
    const [trpcClient] = useState(() =>
        trpc.createClient({
            transformer: SuperJSON,
            links: [
                httpBatchLink({
                    url: config.serverURL,
                    async headers() {
                        const token = await storage.get('token')
                        if (token)
                            return {
                                Authorization: token ? token : ''
                            }
                        else return {}
                    }
                })
            ]
        })
    )

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
}

export default Providers
