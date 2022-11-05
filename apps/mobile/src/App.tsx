import React from 'react'

import { StyleSheet } from 'react-native'
import { Box, Heading } from 'native-base'

const App: React.FC = () => {
    return (
        <Box style={styles.container} bg="dark.900">
            <Heading>Cinzal Mobile App</Heading>
        </Box>
    )
}

export default App

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
