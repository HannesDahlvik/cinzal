import { Task, IEvent } from '../../../config/types'

import { Box, createStyles, Text, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { openModal } from '@mantine/modals'

import DashboardEventInfoModal from '../modals/EventInfo'
import DashboardEditTaskModal from '../modals/EditTask'

import dayjs from 'dayjs'

interface Props {
    tasks: Task[]
    events: IEvent[]
}

const DashboardCalendarDayRenderer: React.FC<Props> = ({ events, tasks }) => {
    const theme = useMantineTheme()
    const { classes } = useStyles()

    const showBottomBar = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`)

    const handleOpenEventInfo = (event: IEvent) => {
        openModal({
            title: event.summary || event.title,
            size: 'lg',
            styles: {
                title: {
                    fontSize: '1.5em',
                    fontWeight: 'bold'
                }
            },
            children: <DashboardEventInfoModal event={event} />
        })
    }

    const handleEditTask = (task: Task) => {
        openModal({
            title: `Edit ${task.title}`,
            children: <DashboardEditTaskModal task={task} />
        })
    }

    return (
        <div className={classes.wrapper}>
            {events.map((event, i) => (
                <div className={classes.event} key={i} onClick={() => handleOpenEventInfo(event)}>
                    <Text lineClamp={1} color="#fff" size="xs">
                        {!showBottomBar && <b>{dayjs(event.start).format('HH:mm')}</b>}{' '}
                        {event.summary || event.title}
                    </Text>
                </div>
            ))}

            {tasks.map((task, i) => (
                <Box
                    sx={{ backgroundColor: theme.colors[task.color][5] }}
                    className={classes.task}
                    key={i}
                    onClick={() => handleEditTask(task)}
                >
                    <Text lineClamp={1} color="#fff" size="xs">
                        <b>{dayjs(task.deadline).format('HH:mm')}</b> {task.title}
                    </Text>
                </Box>
            ))}
        </div>
    )
}

export default DashboardCalendarDayRenderer

const useStyles = createStyles((theme) => {
    return {
        wrapper: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        },
        event: {
            paddingTop: '4px',
            paddingLeft: '4px',
            marginBottom: '2px',
            height: '20px',
            borderRadius: theme.radius.sm,
            cursor: 'pointer',
            transition: '.3s',

            '&:hover': {
                background: 'rgba(10, 10, 10, 0.5)'
            }
        },
        task: {
            paddingLeft: '4px',
            marginBottom: '2px',
            height: '20px',
            borderRadius: theme.radius.sm,
            cursor: 'pointer'
        }
    }
})
