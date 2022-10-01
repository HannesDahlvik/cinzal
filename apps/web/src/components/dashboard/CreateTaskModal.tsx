import { useState } from 'react'

import state from '../../state'
import { useHookstate } from '@hookstate/core'

import { Group, TextInput, Textarea, Stack, Button } from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'

import { errorHandler, trpc } from '../../utils'

interface FormVals {
    title: string
    description: string
    deadlineDate: Date
    deadlineTime: Date
}

const DashboardCreateTaskModal: React.FC = () => {
    const { mutate: createTaskMutation } = trpc.tasks.create.useMutation()

    const { value: user } = useHookstate(state.auth.user)

    const [loading, setLoading] = useState(false)

    const form = useForm<FormVals>({
        initialValues: {
            title: '',
            description: '',
            deadlineDate: new Date(),
            deadlineTime: new Date()
        }
    })

    const handleClose = () => {
        closeAllModals()
    }

    const handleCreateTask = (vals: FormVals) => {
        setLoading(true)

        createTaskMutation(
            {
                title: vals.title,
                description: vals.description,
                deadline: new Date(),
                uuid: user?.uuid as string
            },
            {
                onError: (err) => {
                    const error = JSON.parse(err.message)
                    errorHandler(error[1].message)
                    setLoading(false)
                    closeAllModals()
                },
                onSuccess: (data) => {
                    console.log(data)
                    closeAllModals()
                }
            }
        )
    }

    return (
        <form onSubmit={form.onSubmit((values) => handleCreateTask(values))}>
            <Stack>
                <TextInput
                    label="Title"
                    placeholder="Title"
                    required
                    {...form.getInputProps('title')}
                />

                <Textarea
                    label="Description"
                    placeholder="Write something short you need to remember"
                    minRows={4}
                    {...form.getInputProps('description')}
                />

                <Group grow>
                    <DatePicker
                        label="Deadline date"
                        required
                        {...form.getInputProps('deadlineDate')}
                    />

                    <TimeInput
                        label="Deadline time"
                        required
                        clearable
                        {...form.getInputProps('deadlineTime')}
                    />
                </Group>
            </Stack>

            <Group position="right" mt="md">
                <Button color="red" onClick={handleClose}>
                    Cancel
                </Button>
                <Button type="submit" loading={loading}>
                    Save
                </Button>
            </Group>
        </form>
    )
}

export default DashboardCreateTaskModal
