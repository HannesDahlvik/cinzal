import { useHookstate } from '@hookstate/core'
import state from '../../state'

import TabScreenWrapper from '../../navigation/TabScreenWrapper'
import { TabStackScreenProps } from '~/navigation/TabNavigator'

import { Avatar, Button, Center, FormControl, Heading, Input, VStack } from 'native-base'
import { parseUsername, setAuth } from '../../utils'

const DashboardSettingsScreen: React.FC<TabStackScreenProps<'DashboardSettings'>> = () => {
    const { value: user } = useHookstate(state.auth.user)

    const handleLogout = () => {
        setAuth(null, null)
    }

    if (user)
        return (
            <TabScreenWrapper>
                <Center>
                    <Avatar mt="5" bg="dark.500" size="xl">
                        {parseUsername(user?.username as string)}
                    </Avatar>
                    <Heading mt="2">{user?.username}</Heading>
                </Center>

                <VStack space={4} px="6" mt="10">
                    <FormControl>
                        <FormControl.Label>Username</FormControl.Label>
                        <Input value={user?.username} isReadOnly />
                    </FormControl>

                    <FormControl>
                        <FormControl.Label>Email</FormControl.Label>
                        <Input value={user?.email} isReadOnly />
                    </FormControl>

                    <Button onPress={handleLogout}>Logout</Button>
                </VStack>
            </TabScreenWrapper>
        )
    else return null
}

export default DashboardSettingsScreen
