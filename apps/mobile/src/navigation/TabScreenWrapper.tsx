import { StatusBar } from 'react-native'
import { View } from 'native-base'

interface Props {
    children: React.ReactNode
}

const TabScreenWrapper: React.FC<Props> = ({ children }) => {
    return (
        <View pt={StatusBar.currentHeight}>
            {children}
        </View>
    )
}

export default TabScreenWrapper
