import { NativeBaseProvider } from 'native-base'
import { IconContext } from 'phosphor-react-native'
import theme from './config/theme'

interface Props {
    children: React.ReactNode
}

const Providers: React.FC<Props> = ({ children }) => {
    return (
        <NativeBaseProvider theme={theme}>
            <IconContext.Provider value={{ weight: 'fill', color: '#fff' }}>
                {children}
            </IconContext.Provider>
        </NativeBaseProvider>
    )
}

export default Providers
