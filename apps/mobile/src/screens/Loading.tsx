import { StyleSheet } from 'react-native'
import { Center, Image, Spinner, View } from 'native-base'

const LoadingScreen: React.FC = () => {
    return (
        <View style={styles.wrapper} bg="dark.700">
            <Center mt="2/5">
                <Image
                    source={require('../../assets/icon.png')}
                    alt="Cinzal logo"
                    width={32}
                    height={32}
                    mb="10"
                />
            </Center>

            <Center mt="4/5">
                <Spinner size="lg" />
            </Center>
        </View>
    )
}

export default LoadingScreen

const styles = StyleSheet.create({
    wrapper: {
        height: '100%'
    }
})
