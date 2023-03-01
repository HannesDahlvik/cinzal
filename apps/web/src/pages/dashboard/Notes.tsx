import { Note } from '../../config/types'

import { useNavigate } from 'react-router-dom'

import { Box, Text, createStyles, useMantineTheme } from '@mantine/core'
import { openModal } from '@mantine/modals'
import { Plus } from 'phosphor-react'

import DashboardCreateNoteModal from '../../components/dashboard/modals/CreateNote'
import LoadingPage from '../Loading'

import { trpc } from '../../utils'

const DashboardNotesPage: React.FC = () => {
    const theme = useMantineTheme()
    const { classes } = useStyles()

    const { data: notes } = trpc.notes.all.useQuery()

    const navigate = useNavigate()

    const handleCreateNote = () => {
        openModal({
            title: 'New note',
            children: <DashboardCreateNoteModal />
        })
    }

    const handleOpenNote = (note: Note) => {
        navigate(note.id)
    }

    if (!notes) return <LoadingPage />

    return (
        <div className={classes.wrapper}>
            <Box
                className={classes.box}
                sx={{ border: '2px solid', borderColor: theme.colors.dark[4] }}
                onClick={handleCreateNote}
            >
                <Plus size={32} />
            </Box>

            {notes
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                .map((note) => (
                    <div className={classes.box} onClick={() => handleOpenNote(note)} key={note.id}>
                        <Text>{note.title}</Text>
                    </div>
                ))}
        </div>
    )
}

export default DashboardNotesPage

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors
    const spacing = theme.spacing

    return {
        wrapper: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing.md,
            padding: spacing.xl,

            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                gridTemplateColumns: '1fr 2fr'
            },

            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                gridTemplateColumns: '1fr'
            }
        },
        box: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '200px',
            height: '200px',
            cursor: 'pointer',
            padding: theme.spacing.md,
            borderRadius: theme.radius.md,
            backgroundColor: isDark ? colors.dark[6] : colors.gray[4],
            transition: '.2s',
            marginBottom: theme.spacing.xs,

            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                width: '100%',
                height: '150px'
            }
        }
    }
})
