import { useEffect, useState } from 'react'

import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { Box, Button, Group, TextInput } from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'
import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import { ArrowLeft } from 'phosphor-react'

import { errorHandler, trpc } from '../../utils'

const DashboardNotesEditPage: React.FC = () => {
    const tu = trpc.useContext()
    const notesSaveMutation = trpc.notes.save.useMutation()
    const notesDeleteMutation = trpc.notes.delete.useMutation()

    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()

    const [noteID, setNoteID] = useState('')
    const [title, setTitle] = useState('')
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (params.note_id) setNoteID(params.note_id)
    }, [params.note_id])

    useEffect(() => {
        if (location.state.note) {
            setTitle(location.state.note.title)
            setValue(location.state.note.data)
        }
    }, [location])

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] })
        ],
        content: location.state.note.data
    })

    const handleSave = () => {
        setLoading(true)

        notesSaveMutation.mutate(
            {
                noteID,
                data: value,
                title
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

            <TextInput
                label="Title"
                placeholder="My note"
                mb="lg"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
            />

            <RichTextEditor
                editor={editor}
                onInput={(ev: any) => setValue(ev.target.innerHTML)}
                onPaste={(ev: any) => setValue(ev.target.parentElement.innerHTML)}
            >
                <RichTextEditor.Toolbar sticky>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                        <RichTextEditor.Highlight />
                        <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
                        <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Blockquote />
                        <RichTextEditor.Hr />
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                        <RichTextEditor.Subscript />
                        <RichTextEditor.Superscript />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.AlignLeft />
                        <RichTextEditor.AlignCenter />
                        <RichTextEditor.AlignJustify />
                        <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content />
            </RichTextEditor>
        </Box>
    )
}

export default DashboardNotesEditPage
