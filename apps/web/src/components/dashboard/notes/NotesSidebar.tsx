import { Note } from '../../../config/types'

import { useLocation, useNavigate } from 'react-router-dom'

import { useHookstate } from '@hookstate/core'
import state from '../../../state'

import { Box, Button, Text, createStyles } from '@mantine/core'
import { openModal } from '@mantine/modals'
import { Plus } from 'phosphor-react'

import DashboardCreateNoteModal from '../modals/CreateNote'

import dayjs from 'dayjs'

interface Props {
    notes: Note[]
}

const DashboardNotesSidebar: React.FC<Props> = ({ notes }) => {
    const { classes } = useStyles()

    const { set: setNotesDrawer } = useHookstate(state.drawers.notesDrawer)

    const navigate = useNavigate()
    const location = useLocation()

    const handleCreateNote = () => {
        openModal({
            title: 'New note',
            children: <DashboardCreateNoteModal />
        })
    }

    const handleOpenNote = (note: Note) => {
        setNotesDrawer(false)
        navigate(`${note.id}`)
    }

    return (
        <Box className={classes.notesWrapper} p="md">
            <Button fullWidth onClick={handleCreateNote}>
                <Plus size={18} />
                New note
            </Button>

            <Box mt="md">
                {notes.map((row) => (
                    <Box
                        className={`${classes.box} ${
                            location.pathname.includes(String(row.id)) ? classes.boxSlected : ''
                        }`}
                        onClick={() => handleOpenNote(row)}
                        key={row.id}
                    >
                        <Text size="sm" color="dimmed">
                            {dayjs(row.createdAt).format('DD MMM')}
                        </Text>
                        <Text size="lg" lineClamp={1} sx={{ fontWeight: 'bold' }}>
                            {row.title}
                        </Text>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default DashboardNotesSidebar

const useStyles = createStyles((theme) => {
    const colors = theme.colors

    return {
        notesWrapper: {
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            left: 0,
            height: '100vh',
            borderRight: '1px solid',
            borderRightColor: colors.dark[5]
        },
        box: {
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            padding: theme.spacing.md,
            borderRadius: theme.radius.md,
            backgroundColor: colors.dark[8],
            transition: '.2s',
            marginBottom: theme.spacing.xs
        },
        boxSlected: {
            backgroundColor: colors.dark[6]
        }
    }
})
