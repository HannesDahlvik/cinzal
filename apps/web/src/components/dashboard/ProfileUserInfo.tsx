import { useHookstate } from '@hookstate/core'
import state from '../../state'

import { Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'

const DashboardProfileUserInfo: React.FC = () => {
    const { value: user } = useHookstate(state.auth.user)

    const form = useForm({
        initialValues: {
            username: user?.username,
            email: user?.email
        }
    })

    if (user)
        return (
            <form>
                <Stack>
                    <TextInput
                        label="Username"
                        placeholder="Jon Doe"
                        readOnly
                        {...form.getInputProps('username')}
                    />

                    <TextInput
                        label="Email"
                        placeholder="jon.doe@example.com"
                        readOnly
                        {...form.getInputProps('email')}
                    />
                </Stack>
            </form>
        )
    else return null
}

export default DashboardProfileUserInfo
