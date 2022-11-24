import { useHookstate } from '@hookstate/core'
import state from '../../../state'

import { Group, Stack, Switch, Text } from '@mantine/core'

import { errorHandler, setAuth, trpc } from '../../../utils'

const DashboardProfileSettings = () => {
    const updateUserMutation = trpc.auth.update.useMutation()

    const { value: user, set: setUser } = useHookstate(state.auth.user)

    const handleUpdateUser = (redirect: boolean) => {
        updateUserMutation.mutate(
            {
                redirectDashboard: redirect
            },
            {
                onError: (err) => {
                    errorHandler(err.message)
                },
                onSuccess: (data) => {
                    setAuth(data.token, data.user)
                    setUser(data.user)
                }
            }
        )
    }

    console.log(user)

    if (user)
        return (
            <Stack>
                <Group grow>
                    <Text>Redirect to dashboard</Text>
                    <Switch
                        checked={user.redirectDashboard}
                        onChange={(ev) => handleUpdateUser(ev.target.checked)}
                    />
                </Group>
            </Stack>
        )
}

export default DashboardProfileSettings
