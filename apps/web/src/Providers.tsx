import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useColorScheme, useLocalStorage } from '@mantine/hooks'
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'

import { IconContext } from 'phosphor-react'

const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } }
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
        <QueryClientProvider client={queryClient}>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleTheme}>
                <MantineProvider
                    withNormalizeCSS
                    withGlobalStyles
                    theme={{ colorScheme: colorScheme }}
                >
                    <ModalsProvider>
                        <NotificationsProvider>
                            <IconContext.Provider value={{ weight: 'fill' }}>
                                {children}
                            </IconContext.Provider>
                        </NotificationsProvider>
                    </ModalsProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </QueryClientProvider>
    )
}

export default Providers
