import state from '../../../state'
import { useHookstate } from '@hookstate/core'

import { Box, Button, Center, createStyles, Divider, useMantineTheme } from '@mantine/core'
import { Month } from '@mantine/dates'
import { openModal } from '@mantine/modals'

import DashboardCreateTaskModal from '../modals/CreateTask'
import DashboardDateChanger from '../DateChanger'
import HomeLeftSidebarCalendars from './LeftSidebarCalendars'

import dayjs from 'dayjs'

const DashboardHomeLeftSidebar: React.FC = () => {
    const { classes } = useStyles()
    const theme = useMantineTheme()

    const { value: globalDate, set: setGlobalDate } = useHookstate(state.date)

    const handleCreateTask = () => {
        openModal({
            title: 'Create task',
            children: <DashboardCreateTaskModal />
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
                            date.getMonth() === globalDate.month() &&
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

            <Center className={classes.create} p="xl">
                <Button fullWidth onClick={handleCreateTask}>
                    Create task
                </Button>
            </Center>

            <Divider sx={{ width: '100%' }} />

            <HomeLeftSidebarCalendars />
        </div>
    )
}

export default DashboardHomeLeftSidebar

const useStyles = createStyles(() => {
    return {
        sidebar: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
        },
        create: {
            width: '100%'
        }
    }
})
