import { useState } from 'react'

import state from '../../state'
import { useHookstate } from '@hookstate/core'

import { Button, createStyles, useMantineTheme } from '@mantine/core'
import { Calendar } from '@mantine/dates'
import { openModal } from '@mantine/modals'

import DashboardCreateTaskModal from './CreateTaskModal'

const DashboardHomeLeftSidebar: React.FC = () => {
    const { classes } = useStyles()
    const theme = useMantineTheme()

    const { value: globalDate } = useHookstate(state.date)

    const [selectedDate, setSelectedDate] = useState(new Date())

    const handleCreateTask = () => {
        openModal({
            title: 'Create task',
            children: <DashboardCreateTaskModal />
        })
    }

    return (
        <div className={classes.sidebar}>
            <Calendar
                initialMonth={globalDate.toDate()}
                fullWidth
                p="xl"
                dayStyle={(date) => {
                    if (
                        date.getMonth() === selectedDate.getMonth() &&
                        date.getDate() === new Date().getDate()
                    )
                        return {
                            backgroundColor: theme.colors.blue[6]
                        }
                    else if (
                        date.getMonth() === selectedDate.getMonth() &&
                        date.getDate() === selectedDate.getDate()
                    )
                        return {
                            backgroundColor: theme.colors.indigo[6]
                        }
                    else return {}
                }}
                onChange={(value) => setSelectedDate(value as Date)}
            />

            <div className={classes.create}>
                <Button fullWidth onClick={handleCreateTask}>
                    Create task
                </Button>
            </div>
        </div>
    )
}

export default DashboardHomeLeftSidebar

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors

    return {
        sidebar: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
        },
        create: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: theme.spacing.sm,
            width: '100%',
            padding: theme.spacing.xl,
            borderTop: '1px solid',
            borderTopColor: isDark ? colors.dark[6] : colors.gray[4]
        }
    }
})