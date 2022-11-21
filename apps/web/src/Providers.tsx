import config from './config'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'

import { IconContext } from 'phosphor-react'

import { trpc } from './utils'
import { httpBatchLink } from '@trpc/client'
import SuperJSON from 'superjson'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
})

const trpcClient = trpc.createClient({
    transformer: SuperJSON,
    links: [
        httpBatchLink({
            url: config.serverURL,
            headers() {
                if (localStorage.token)
                    return {
                        Authorization: localStorage.token
                    }
                else return {}
            }
        })
    ]
})

interface Props {
    children: React.ReactNode
}

const Providers: React.FC<Props> = ({ children }) => {
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <MantineProvider withNormalizeCSS withGlobalStyles theme={{ colorScheme: 'dark' }}>
                    <ModalsProvider>
                        <NotificationsProvider position="top-center">
                            <IconContext.Provider value={{ weight: 'fill', size: 16 }}>
                                {children}
                            </IconContext.Provider>
                        </NotificationsProvider>
                    </ModalsProvider>
                </MantineProvider>
            </QueryClientProvider>
        </trpc.Provider>
    )
}

export default Providers
