import { Calendar } from '../../../config/types'

import state from '../../../state'
import { useHookstate } from '@hookstate/core'

import { Box, Button, createStyles, Divider, Stack, useMantineTheme } from '@mantine/core'
import { Month } from '@mantine/dates'
import { openModal } from '@mantine/modals'

import DashboardCreateTaskModal from '../modals/CreateTask'
import DashboardCreateEventModal from '../modals/CreateEvent'
import DashboardDateChanger from '../DateChanger'
import HomeLeftSidebarCalendars from './LeftSidebarCalendars'

import dayjs from 'dayjs'

interface Props {
    calendars: Calendar[]
}

const DashboardHomeLeftSidebar: React.FC<Props> = ({ calendars }) => {
    const { classes } = useStyles()
    const theme = useMantineTheme()

    const { value: globalDate, set: setGlobalDate } = useHookstate(state.date)

    const handleCreateTask = () => {
        openModal({
            title: 'Create task',
            children: <DashboardCreateTaskModal />
        })
    }

    const handleCreateEvent = () => {
        openModal({
            title: 'Create event',
            children: <DashboardCreateEventModal />
        })
    }

    return (
        <div className={classes.sidebar}>
            <Box sx={{ padding: '24px' }}>
                <DashboardDateChanger />

                <Month
                    month={globalDate.toDate()}
                    value={globalDate.toDate()}
                    fullWidth
                    my="xl"
                    dayStyle={(date) => {
                        if (
                            date.getMonth() === dayjs().month() &&
                            date.getDate() === new Date().getDate()
                        )
                            return {
                                backgroundColor: theme.colors.blue[6],
                                color: '#fff'
                            }
                        else if (
                            date.getMonth() === globalDate.month() &&
                            date.getDate() === globalDate.date()
                        )
                            return {
                                backgroundColor: theme.colors.indigo[6],
                                color: '#fff'
                            }
                        else return {}
                    }}
                    onChange={(value) => setGlobalDate(dayjs(value))}
                />
            </Box>

            <Divider sx={{ width: '100%' }} />

            <Stack className={classes.create} p="xl">
                <Button fullWidth onClick={handleCreateTask}>
                    Create task
                </Button>

                <Button fullWidth onClick={handleCreateEvent}>
                    Create event
                </Button>
            </Stack>

            <Divider sx={{ width: '100%' }} />

            <HomeLeftSidebarCalendars calendars={calendars} />
        </div>
    )
}

export default DashboardHomeLeftSidebar

const useStyles = createStyles((theme) => {
    return {
        sidebar: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            borderRight: '1px solid',
            borderRightColor: theme.colors.dark[5]
        },
        create: {
            width: '100%'
        }
    }
})
