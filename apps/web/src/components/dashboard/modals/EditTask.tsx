import { useState } from 'react'
import { Task } from '../../../config/types'

import {
    Group,
    TextInput,
    Textarea,
    Stack,
    Button,
    Text,
    ColorSwatch,
    useMantineTheme
} from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { closeAllModals, openConfirmModal } from '@mantine/modals'
import { Check } from 'phosphor-react'

import { errorHandler, parseTrpcError, trpc } from '../../../utils'
import dayjs from 'dayjs'

interface Props {
    task: Task
}

interface FormVals {
    title: string
    description: string
    deadlineDate: Date
    deadlineTime: Date
    color: string
}

const DashboardEditTaskModal: React.FC<Props> = ({ task }) => {
    const theme = useMantineTheme()

    const tu = trpc.useContext()
    const { mutate: editTaskMutation } = trpc.tasks.edit.useMutation()
    const { mutate: deleteTaskMutation } = trpc.tasks.delete.useMutation()

    const [loading, setLoading] = useState(false)
    const [selectedColor, setSelectedColor] = useState<string>(task.color)

    const form = useForm<FormVals>({
        initialValues: {
            title: task.title,
            description: task.description,
            deadlineDate: new Date(task.deadline),
            deadlineTime: new Date(task.deadline),
            color: task.color
        }
    })

    const handleClose = () => {
        closeAllModals()
    }

    const handleEditTask = (vals: FormVals) => {
        setLoading(true)

        const deadlineDate = dayjs(vals.deadlineDate)
        const deadlineTime = dayjs(vals.deadlineTime)
        const deadline = deadlineDate
            .set('hour', deadlineTime.hour())
            .set('minute', deadlineTime.minute())
            .set('second', 0)
            .toDate()

        editTaskMutation(
            {
                id: task.id,
                title: vals.title,
                description: vals.description,
                color: selectedColor,
                deadline
            },
            {
                onError: (err) => {
                    const error = parseTrpcError(err)
                    errorHandler(error)
                    setLoading(false)
                    handleClose()
                },
                onSuccess: () => {
                    handleClose()
                    tu.tasks.get.invalidate()
                }
            }
        )
    }

    const handleDeleteTask = () => {
        openConfirmModal({
            title: `Are you sure you want to delete "${task.title}"`,
            labels: { cancel: 'No', confirm: 'Yes' },
            cancelProps: { variant: 'outline' },
            onCancel: () => handleClose(),
            onConfirm: () => {
                deleteTaskMutation(
                    {
                        taskId: task.id
                    },
                    {
                        onError: (err) => {
                            const error = parseTrpcError(err)
                            errorHandler(error)
                            handleClose()
                        },
                        onSuccess: (data) => {
                            handleClose()
                            tu.tasks.get.invalidate()
                        }
                    }
                )
            }
        })
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

                <Stack>
                    <Text>Color</Text>
                    <Group position="left">
                        {['red', 'pink', 'violet', 'blue', 'teal', 'green', 'yellow', 'orange'].map(
                            (color) => (
                                <ColorSwatch
                                    key={color}
                                    sx={{ cursor: 'pointer' }}
                                    color={theme.colors[color][5]}
                                    onClick={() => setSelectedColor(color)}
                                >
                                    {selectedColor === color && (
                                        <Check weight="bold" color="#000" />
                                    )}
                                </ColorSwatch>
                            )
                        )}
                    </Group>
                </Stack>
            </Stack>

            <Group position="apart" mt="md">
                <Button color="red" onClick={handleDeleteTask}>
                    Delete
                </Button>

                <Group position="right">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                        Save
                    </Button>
                </Group>
            </Group>
        </form>
    )
}

export default DashboardEditTaskModal
