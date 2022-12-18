import { Note } from '../../config/types'

import { useHookstate } from '@hookstate/core'
import state from '../../state'

import { Outlet, useLocation } from 'react-router-dom'

import { Box, Button, Center, Drawer, Title, createStyles, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { List } from 'phosphor-react'

import DashboardNotesSidebar from '../../components/dashboard/notes/NotesSidebar'
import LoadingPage from '../Loading'

import { trpc } from '../../utils'

const DashboardNotesPage: React.FC = () => {
    const { classes } = useStyles()
    const theme = useMantineTheme()

    const { data: notes } = trpc.notes.all.useQuery()

    const { value: notesDrawer, set: setNotesDrawer } = useHookstate(state.drawers.notesDrawer)

    const location = useLocation()

    const smBreakpoint = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)

    if (!notes) return <LoadingPage />

    return (
        <div className={classes.wrapper}>
            {!smBreakpoint && <DashboardNotesSidebar notes={notes as Note[]} />}

            {location.pathname === '/dashboard/notes' && (
                <Center>
                    <Title align="center">
                        {notes?.length === 0 ? 'Create a note' : 'Select a note'}
                    </Title>
                </Center>
            )}

            <Outlet />

            {smBreakpoint && (
                <>
                    <Box sx={{ position: 'fixed', bottom: 100, right: 20, zIndex: 99 }}>
                        <Button size="sm" p="8px" onClick={() => setNotesDrawer(!notesDrawer)}>
                            <List size={22} />
                        </Button>
                    </Box>

                    <Drawer
                        position="right"
                        size={smBreakpoint ? '75%' : 'md'}
                        withCloseButton={false}
                        opened={notesDrawer}
                        onClose={() => setNotesDrawer(!notesDrawer)}
                    >
                        <DashboardNotesSidebar notes={notes as Note[]} />
                    </Drawer>
                </>
            )}
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
            height: '100%',

            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                gridTemplateColumns: '1fr 2fr'
            },

            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                gridTemplateColumns: '1fr'
            }
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
