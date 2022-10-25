import { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { Box, Button, Group, TextInput } from '@mantine/core'
import RichTextEditor from '@mantine/rte'

import { errorHandler, trpc } from '../../utils'
import LoadingPage from '../Loading'
import { openConfirmModal } from '@mantine/modals'

const DashboardNotesEditPage: React.FC = () => {
    const tu = trpc.useContext()
    const notesSaveMutation = trpc.notes.save.useMutation()
    const notesDeleteMutation = trpc.notes.delete.useMutation()

    const navigate = useNavigate()
    const params = useParams()

    const [noteID, setNoteID] = useState(0)
    const [title, setTitle] = useState('')
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (params.note_id) {
            setNoteID(parseInt(params.note_id))
        }
    }, [params.note_id])

    const { isLoading } = trpc.notes.get.useQuery(
        { noteID: noteID },
        {
            enabled: !!noteID,
            onSuccess: (note) => {
                if (note) {
                    setTitle(note.title)
                    setValue(note.data)
                }
            }
        }
    )

    const handleSave = () => {
        setLoading(true)

        notesSaveMutation.mutate(
            {
                noteID: noteID,
                data: value,
                title
            },
            {
                onError: (err) => {
                    errorHandler(err.message)
                    setLoading(false)
                },
                onSuccess: (data) => {
                    setLoading(false)
                }
            }
        )
    }

    const handleDelete = () => {
        openConfirmModal({
            title: `Delete "${title}"`,
            labels: { cancel: 'Cancel', confirm: 'Delete' },
            onConfirm: () => {
                notesDeleteMutation.mutate(
                    {
                        noteID: noteID
                    },
                    {
                        onError: (err) => {
                            errorHandler(err.message)
                        },
                        onSuccess: (data) => {
                            tu.notes.all.invalidate()
                            navigate('/dashboard/notes')
                        }
                    }
                )
            }
        })
    }

    if (isLoading) return <LoadingPage />

    return (
        <Box p="xl">
            <Group mb="lg">
                <Button loading={loading} onClick={handleSave}>
                    Save
                </Button>
                <Button variant="outline" color="red" onClick={handleDelete}>
                    Delete
                </Button>
            </Group>

            <TextInput
                label="Title"
                placeholder="My note"
                mb="lg"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
            />

            <RichTextEditor value={value} onChange={setValue} />
        </Box>
    )
}

export default DashboardNotesEditPage
