import { useState } from 'react'

import { Group, TextInput, Textarea, Stack, Button } from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'

const DashboardCreateTaskModal: React.FC = () => {
    const [loading, setLoading] = useState(false)

    const form = useForm({
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

    const handleCreateTask = (vals: any) => {
        setLoading(true)
        console.log(vals)
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
