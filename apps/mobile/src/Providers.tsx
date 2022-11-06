import { useState } from 'react'

import config from './config'
import theme from './config/theme'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { trpc } from './utils/trpc'
import { httpBatchLink } from '@trpc/client'

import { NativeBaseProvider } from 'native-base'
import { IconContext } from 'phosphor-react-native'

interface Props {
    children: React.ReactNode
}

const Providers: React.FC<Props> = ({ children }) => {
    const [queryClient] = useState(() => new QueryClient())
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: config.serverURL
                })
            ]
        })
    )

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <NativeBaseProvider theme={theme}>
                    <IconContext.Provider value={{ weight: 'fill', color: '#fff' }}>
                        {children}
                    </IconContext.Provider>
                </NativeBaseProvider>
            </QueryClientProvider>
        </trpc.Provider>
    )
}

export default Providers
