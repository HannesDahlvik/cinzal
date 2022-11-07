import React from 'react'

import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import RootNavigator from './navigation/Root'

import { useTheme } from 'native-base'

const App: React.FC = () => {
    const { colors } = useTheme()

    return (
        <NavigationContainer
            theme={{
                ...DefaultTheme,
                colors: { ...DefaultTheme.colors, background: colors.dark[900] }
            }}
        >
            <RootNavigator />
        </NavigationContainer>
    )
}

export default App
