import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useColorScheme, useLocalStorage } from '@mantine/hooks'
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'

import { IconContext } from 'phosphor-react'

import { errorHandler, setAuth, trpc } from './utils'
import { httpBatchLink } from '@trpc/client'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            onError(err: any) {
                if (err.message.includes('jwt malformed')) {
                    setAuth(null, null)
                    errorHandler('Invalid token')
                }
            }
        },
        mutations: {
            onError(err: any) {
                if (err.message.includes('jwt malformed')) {
                    setAuth(null, null)
                    errorHandler('Invalid token')
                }
            }
        }
    }
})

const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: 'http://localhost:8080/trpc',
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
    const preferredTheme = useColorScheme()
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: 'color-scheme',
        defaultValue: preferredTheme
    })
    const toggleTheme = (value?: ColorScheme) => {
        setColorScheme(value ? value : colorScheme === 'dark' ? 'light' : 'dark')
    }

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleTheme}>
                    <MantineProvider
                        withNormalizeCSS
                        withGlobalStyles
                        theme={{ colorScheme: colorScheme }}
                    >
                        <ModalsProvider>
                            <NotificationsProvider position="top-center">
                                <IconContext.Provider value={{ weight: 'fill', size: 16 }}>
                                    {children}
                                </IconContext.Provider>
                            </NotificationsProvider>
                        </ModalsProvider>
                    </MantineProvider>
                </ColorSchemeProvider>
            </QueryClientProvider>
        </trpc.Provider>
    )
}

export default Providers
