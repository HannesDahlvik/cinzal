import { Heading, View } from 'native-base'
import { StyleSheet } from 'react-native'

const HomeScreen: React.FC = () => {
    return (
        <View style={styles.wrapper} bg="dark.900">
            <Heading>Cinzal Mobile App</Heading>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
