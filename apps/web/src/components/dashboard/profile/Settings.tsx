import { CalendarViews } from '../../../config/types'

import { useHookstate } from '@hookstate/core'
import state from '../../../state'

import { Button, Group, Select, Stack, Switch, Text } from '@mantine/core'
import { useForm } from '@mantine/form'

import { errorHandler, setAuth, trpc } from '../../../utils'

interface FormVals {
    redirect: boolean
    view: CalendarViews
}

const DashboardProfileSettings = () => {
    const updateUserMutation = trpc.auth.update.useMutation()

    const { value: user, set: setUser } = useHookstate(state.auth.user)

    const form = useForm<FormVals>({
        initialValues: {
            redirect: user?.redirectDashboard as boolean,
            view: user?.calendarView as CalendarViews
        }
    })

    const handleUpdateUser = (vals: FormVals) => {
        updateUserMutation.mutate(
            {
                username: user?.username as string,
                redirectDashboard: vals.redirect,
                calendarView: vals.view
            },
            {
                onError: (err) => {
                    errorHandler(err.message)
                },
                onSuccess: (data) => {
                    setAuth(data.token, data.user)
                    setUser(data.user)
                    form.resetDirty()
                }
            }
        )
    }

    return (
        <form onSubmit={form.onSubmit((values) => handleUpdateUser(values))}>
            <Stack>
                <Group grow>
                    <Text>Redirect to dashboard</Text>
                    <Switch
                        checked={form.values.redirect}
                        onChange={(ev) => form.setFieldValue('redirect', ev.target.checked)}
                    />
                </Group>

                <Group grow>
                    <Text>Default calendar view</Text>
                    <Select
                        data={[
                            { value: 'month', label: 'Month' },
                            { value: 'week', label: 'Week' }
                        ]}
                        {...form.getInputProps('view')}
                    />
                </Group>

                <Group position="right">
                    <Button type="submit" disabled={!form.isDirty()}>
                        Save
                    </Button>
                </Group>
            </Stack>
        </form>
    )
}

export default DashboardProfileSettings
