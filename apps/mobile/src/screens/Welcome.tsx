import { StyleSheet } from 'react-native'
import { Button, Center, Heading, Image, Stack, View } from 'native-base'
import { RootStackScreenProps } from '~/navigation/Root'

const WelcomeScreen: React.FC<RootStackScreenProps<'Welcome'>> = ({ navigation }) => {
    return (
        <Stack style={styles.wrapper} space={3}>
            <Center mt="1/4">
                <Image
                    source={require('../../assets/logo.png')}
                    alt="Cinzal logo"
                    width={32}
                    height={32}
                    mb="4"
                />

                <Heading size="3xl">Cinzal</Heading>
            </Center>

            <View style={styles.buttons} mb="1/6">
                <Button mb="3" onPress={() => navigation.navigate('Signup')}>
                    Signup
                </Button>

                <Button variant="outline" onPress={() => navigation.navigate('Login')}>
                    Login
                </Button>
            </View>
        </Stack>
    )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttons: {
        display: 'flex',
        flexDirection: 'column',
        width: '75%'
    }
})
