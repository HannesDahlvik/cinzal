import { useState } from 'react'

import { Button, Group, Stack, Text, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { DatePicker, TimeRangeInput } from '@mantine/dates'
import { closeAllModals } from '@mantine/modals'

import { errorHandler, trpc } from '../../../utils'
import dayjs from 'dayjs'

interface FormVals {
    title: string
    description: string
    location: string
    date: Date
    time: [Date, Date]
}

const DashboardCreateEventModal: React.FC = () => {
    const tu = trpc.useContext()
    const createEventMutation = trpc.events.create.useMutation()

    const [loading, setLoading] = useState(false)

    const form = useForm<FormVals>({
        initialValues: {
            title: '',
            description: '',
            location: '',
            date: new Date(),
            time: [new Date(), dayjs(new Date()).add(1, 'hour').toDate()]
        }
    })

    const handleClose = () => {
        closeAllModals()
        setLoading(false)
    }

    const handleCreateEvent = (vals: FormVals) => {
        setLoading(true)

        const startTime = dayjs(vals.time[0])
        const endTime = dayjs(vals.time[1])
        const start = dayjs(vals.date)
            .set('hour', startTime.hour())
            .set('minute', startTime.minute())
            .set('second', 0)
            .toDate()
        const end = dayjs(vals.date)
            .set('hour', endTime.hour())
            .set('minute', endTime.minute())
            .set('second', 0)
            .toDate()

        createEventMutation.mutate(
            {
                title: vals.title,
                description: vals.description,
                location: vals.location,
                start,
                end
            },
            {
                onError: (err) => {
                    errorHandler(err.message)
                    handleClose()
                },
                onSuccess: () => {
                    handleClose()
                    tu.events.all.invalidate()
                }
            }
        )
    }

    return (
        <>
            <form onSubmit={form.onSubmit((values) => handleCreateEvent(values))}>
                <Stack>
                    <TextInput
                        label="Title"
                        placeholder="Title"
                        required
                        {...form.getInputProps('title')}
                    />

                    <Stack spacing="xs">
                        <Text component="label" size="sm">
                            Date
                        </Text>
                        <Group grow>
                            <DatePicker required {...form.getInputProps('date')} />
                            <TimeRangeInput required {...form.getInputProps('time')} />
                        </Group>
                    </Stack>

                    <TextInput
                        label="Location"
                        placeholder="Add location"
                        {...form.getInputProps('location')}
                    />

                    <Textarea
                        label="Description"
                        placeholder="Add description"
                        {...form.getInputProps('description')}
                    />
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
        </>
    )
}

export default DashboardCreateEventModal
