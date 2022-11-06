import React from 'react'
import { StatusBar } from 'expo-status-bar'

import HomeScreen from './screens/Home'

const App: React.FC = () => {
    return (
        <>
            <StatusBar style="light" />

            <HomeScreen />
        </>
    )
}

export default App
