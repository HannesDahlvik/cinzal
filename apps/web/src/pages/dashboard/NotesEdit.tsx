import { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { Box, Button, Group } from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'
import { ArrowLeft } from 'phosphor-react'

import DashboardNotesEditor from '../../components/dashboard/notes/Editor'

import { errorHandler, trpc } from '../../utils'
import LoadingPage from '../Loading'

const DashboardNotesEditPage: React.FC = () => {
    const tu = trpc.useContext()
    const notesSaveMutation = trpc.notes.save.useMutation()
    const notesDeleteMutation = trpc.notes.delete.useMutation()

    const navigate = useNavigate()
    const params = useParams()

    const [noteID, setNoteID] = useState('')
    const [title, setTitle] = useState<string | null>(null)
    const [value, setValue] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const noteGetQuery = trpc.notes.get.useQuery(
        { noteID },
        {
            enabled: !!noteID,
            onSuccess: (data) => {
                setValue(data.data)
                setTitle(data.title)
            }
        }
    )

    useEffect(() => {
        if (params.note_id) setNoteID(params.note_id)
    }, [params.note_id])

    const handleSave = () => {
        setLoading(true)

        notesSaveMutation.mutate(
            {
                noteID,
                data: value as string,
                title: title as string
            },
            {
                onError: (err) => {
                    errorHandler(err.message)
                    setLoading(false)
                },
                onSuccess: () => {
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
                        onSuccess: () => {
                            tu.notes.all.invalidate()
                            navigate('/dashboard/notes')
                        }
                    }
                )
            }
        })
    }

    if (noteGetQuery.isLoading) return <LoadingPage />

    return (
        <Box p="xl">
            <Group mb="lg" spacing="xs">
                <Button onClick={() => navigate('/dashboard/notes')}>
                    <ArrowLeft />
                </Button>
                <Button loading={loading} onClick={handleSave}>
                    Save
                </Button>
                <Button variant="outline" color="red" onClick={handleDelete}>
                    Delete
                </Button>
            </Group>

            {(title && value) !== null && (
                <DashboardNotesEditor
                    data={value}
                    title={title}
                    setTitle={(val) => setTitle(val)}
                    setValue={(val) => setValue(val)}
                />
            )}
        </Box>
    )
}

export default DashboardNotesEditPage
