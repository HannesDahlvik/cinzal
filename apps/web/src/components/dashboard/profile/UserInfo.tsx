import { useHookstate } from '@hookstate/core'
import state from '../../../state'

import { Button, Group, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'

import { errorHandler, setAuth, trpc } from '../../../utils'

interface FormVals {
    username: string
    email: string
}

const DashboardProfileUserInfo: React.FC = () => {
    const updateUserMutation = trpc.auth.update.useMutation()

    const { value: user } = useHookstate(state.auth.user)

    const form = useForm({
        initialValues: {
            username: user?.username as string,
            email: user?.email as string
        }
    })

    const handleUpdateUser = (vals: FormVals) => {
        updateUserMutation.mutate(
            {
                username: vals.username
            },
            {
                onError: (err) => {
                    errorHandler(err.message)
                },
                onSuccess: (data) => {
                    setAuth(data.token, data.user)
                    form.resetDirty()
                }
            }
        )
    }

    return (
        <form onSubmit={form.onSubmit((values) => handleUpdateUser(values))}>
            <Stack>
                <TextInput
                    label="Username"
                    placeholder="Jon Doe"
                    required
                    {...form.getInputProps('username')}
                />

                <TextInput
                    label="Email"
                    placeholder="jon.doe@example.com"
                    readOnly
                    {...form.getInputProps('email')}
                />
            </Stack>

            <Group position="right" mt="md">
                <Button type="submit" disabled={!form.isDirty()}>
                    Save
                </Button>
            </Group>
        </form>
    )
}

export default DashboardProfileUserInfo
