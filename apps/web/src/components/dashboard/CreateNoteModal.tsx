import { useState } from 'react'

import { Button, Group, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'

import { errorHandler, trpc } from '../../utils'

interface FormVals {
    title: string
}

const DashboardCreateNoteModal: React.FC = () => {
    const trpcUtils = trpc.useContext()
    const createNoteMutation = trpc.notes.create.useMutation()

    const [loading, setLoading] = useState(false)

    const form = useForm<FormVals>({
        initialValues: {
            title: ''
        }
    })

    const handleClose = () => {
        closeAllModals()
    }

    const handleCreateNote = (vals: FormVals) => {
        setLoading(true)

        createNoteMutation.mutate(
            {
                title: vals.title
            },
            {
                onError: (err) => {
                    errorHandler(err.message)
                    setLoading(false)
                },
                onSuccess: (data) => {
                    setLoading(false)
                    closeAllModals()
                    trpcUtils.notes.all.invalidate()
                }
            }
        )
    }

    return (
        <form onSubmit={form.onSubmit((values) => handleCreateNote(values))}>
            <Stack>
                <TextInput
                    label="Title"
                    placeholder="My note"
                    required
                    {...form.getInputProps('title')}
                />
            </Stack>

            <Group position="right" mt="md">
                <Button variant="outline" color="red" onClick={handleClose}>
                    Cancel
                </Button>
                <Button type="submit" loading={loading}>
                    Create
                </Button>
            </Group>
        </form>
    )
}

export default DashboardCreateNoteModal
