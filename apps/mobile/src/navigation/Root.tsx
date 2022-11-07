import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'

import WelcomeScreen from '../screens/Welcome'

import AuthLoginScreen from '../screens/auth/Login'
import AuthSignupScreen from '../screens/auth/Signup'

const Stack = createStackNavigator<RootStackParamList>()

const RootNavigator: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={AuthLoginScreen} />
            <Stack.Screen name="Signup" component={AuthSignupScreen} />
        </Stack.Navigator>
    )
}

export default RootNavigator

type RootStackParamList = {
    Welcome: undefined
    Login: undefined
    Signup: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = StackScreenProps<
    RootStackParamList,
    Screen
>

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}
