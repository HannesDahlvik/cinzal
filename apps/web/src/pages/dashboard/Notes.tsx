import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Box, Button, createStyles, Text } from '@mantine/core'
import { openModal } from '@mantine/modals'
import { Plus } from 'phosphor-react'

import LoadingPage from '../Loading'
import DashboardCreateNoteModal from '../../components/dashboard/CreateNoteModal'

import { trpc } from '../../utils'
import dayjs from 'dayjs'

const DashboardNotesPage: React.FC = () => {
    const { classes } = useStyles()

    const { data: notes } = trpc.notes.all.useQuery()

    const navigate = useNavigate()
    const location = useLocation()

    const handleCreateNote = () => {
        openModal({
            title: 'New note',
            children: <DashboardCreateNoteModal />
        })
    }

    const handleOpenNote = (note: any) => {
        navigate(`${note.id}`)
    }

    if (!notes) return <LoadingPage />

    return (
        <div className={classes.wrapper}>
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

            <Outlet />
        </div>
    )
}

export default DashboardNotesPage

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors

    return {
        wrapper: {
            display: 'grid',
            gridTemplateColumns: '1fr 4fr',
            gap: theme.spacing.xs,
            height: '100%'
        },
        notesWrapper: {
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            left: 0,
            height: '100vh',
            borderRight: '1px solid',
            borderRightColor: isDark ? colors.dark[5] : colors.gray[4]
        },
        box: {
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            padding: theme.spacing.md,
            borderRadius: theme.radius.md,
            backgroundColor: isDark ? colors.dark[8] : colors.gray[4],
            transition: '.2s',
            marginBottom: theme.spacing.xs
        },
        boxSlected: {
            backgroundColor: isDark ? colors.dark[6] : theme.white
        }
    }
})
