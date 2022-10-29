import { useState } from 'react'

import {
    Group,
    TextInput,
    Textarea,
    Stack,
    Button,
    useMantineTheme,
    ColorSwatch,
    Text
} from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { Check } from 'phosphor-react'

import { errorHandler, trpc } from '../../../utils'
import dayjs from 'dayjs'

interface FormVals {
    title: string
    description: string
    deadlineDate: Date
    deadlineTime: Date
    color: string
}

const DashboardCreateTaskModal: React.FC = () => {
    const theme = useMantineTheme()

    const tu = trpc.useContext()
    const { mutate: createTaskMutation } = trpc.tasks.create.useMutation()

    const [loading, setLoading] = useState(false)
    const [selectedColor, setSelectedColor] = useState<string>('blue')

    const form = useForm<FormVals>({
        initialValues: {
            title: '',
            description: '',
            deadlineDate: new Date(),
            deadlineTime: new Date(),
            color: 'blue'
        }
    })

    const handleClose = () => {
        closeAllModals()
    }

    const handleCreateTask = (vals: FormVals) => {
        setLoading(true)

        const deadlineDate = dayjs(vals.deadlineDate)
        const deadlineTime = dayjs(vals.deadlineTime)
        const deadline = deadlineDate
            .set('hour', deadlineTime.hour())
            .set('minute', deadlineTime.minute())
            .set('second', 0)
            .toDate()

        createTaskMutation(
            {
                title: vals.title,
                description: vals.description,
                color: selectedColor,
                deadline
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
                    tu.tasks.get.invalidate()
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
                                    {selectedColor === color && <Check />}
                                </ColorSwatch>
                            )
                        )}
                    </Group>
                </Stack>
            </Stack>

            <Group position="right" mt="md">
                <Button variant="outline" color="red" onClick={handleClose}>
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
