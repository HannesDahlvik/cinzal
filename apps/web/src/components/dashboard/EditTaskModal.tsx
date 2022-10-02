import { useState } from 'react'

import { Task } from '../../config/types'

import state from '../../state'
import { useHookstate } from '@hookstate/core'

import { Group, TextInput, Textarea, Stack, Button } from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'

import { useQueryClient } from '@tanstack/react-query'
import { errorHandler, trpc } from '../../utils'

interface Props {
    task: Task
}

interface FormVals {
    title: string
    description: string
    deadlineDate: Date
    deadlineTime: Date
}

const DashboardEditTaskModal: React.FC<Props> = ({ task }) => {
    const qc = useQueryClient()
    const { mutate: editTaskMutation } = trpc.tasks.edit.useMutation()

    const { value: user } = useHookstate(state.auth.user)

    const [loading, setLoading] = useState(false)

    const form = useForm<FormVals>({
        initialValues: {
            title: task.title,
            description: task.description,
            deadlineDate: new Date(task.deadline),
            deadlineTime: new Date(task.deadline)
        }
    })

    const handleClose = () => {
        closeAllModals()
    }

    const handleEditTask = (vals: FormVals) => {
        setLoading(true)

        const deadlineDate = vals.deadlineDate
        const deadlineTime = vals.deadlineTime
        const deadline = deadlineDate
        deadline.setHours(deadlineTime.getHours())
        deadline.setMinutes(deadlineTime.getMinutes())
        deadline.setSeconds(0)
        if (user)
            editTaskMutation(
                {
                    id: task.id,
                    uuid: user.uuid,
                    title: vals.title,
                    description: vals.description,
                    deadline: deadline.toString()
                },
                {
                    onError: (err) => {
                        const error = JSON.parse(err.message)
                        errorHandler(error[1].message)
                        setLoading(false)
                        handleClose()
                    },
                    onSuccess: (data) => {
                        handleClose()
                        qc.invalidateQueries(['tasks.get'])
                    }
                }
            )
    }

    return (
        <form onSubmit={form.onSubmit((values) => handleEditTask(values))}>
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

export default DashboardEditTaskModal
