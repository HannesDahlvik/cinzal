import { useState } from 'react'

import { Button, TextInput, Stack, Group } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'

import { z } from 'zod'
import { errorHandler, trpc } from '../../../utils'

const schema = z.object({
    name: z.string(),
    url: z.string().url()
})
type FormValues = z.infer<typeof schema>

const DashboardAddCalendarModal: React.FC = () => {
    const trpcUtils = trpc.useContext()
    const addCalendarMutation = trpc.calendar.addCalendar.useMutation()

    const [loading, setLoading] = useState(false)

    const form = useForm<FormValues>({
        validate: zodResolver(schema),
        initialValues: {
            name: '',
            url: ''
        }
    })

    const handleClose = () => {
        closeAllModals()
        setLoading(false)
    }

    const handleSubmit = (vals: FormValues) => {
        setLoading(true)

        addCalendarMutation.mutate(
            {
                name: vals.name,
                url: vals.url
            },
            {
                onError: (err) => {
                    handleClose()
                    errorHandler(err.message)
                },
                onSuccess: () => {
                    handleClose()
                    trpcUtils.calendar.getICalLinks.invalidate()
                }
            }
        )
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack mb="md">
                <TextInput
                    label="Name"
                    placeholder="Name"
                    required
                    {...form.getInputProps('name')}
                />

                <TextInput
                    label="URL"
                    placeholder="https://"
                    required
                    {...form.getInputProps('url')}
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
    )
}

export default DashboardAddCalendarModal
