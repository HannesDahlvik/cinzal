import { useEffect, useState } from 'react'
import { Task } from '../../../config/types'
import { IEvent } from '../../../state'

import { Box, createStyles, Text, useMantineTheme } from '@mantine/core'
import { openModal } from '@mantine/modals'

import DashboardEventInfoModal from '../modals/EventInfo'
import DashboardEditTaskModal from '../modals/EditTask'

import dayjs from 'dayjs'

interface Props {
    tasks: Task[]
    events: IEvent[]
}

const DashboardCalendarDayRenderer: React.FC<Props> = (props) => {
    const theme = useMantineTheme()
    const { classes } = useStyles()

    const [obj, setObj] = useState<Props | null>(null)

    useEffect(() => {
        const obj: Props = {
            events: [],
            tasks: []
        }

        let eventsCounter = 0
        props.events.map((event) => {
            if (eventsCounter === 2) return
            else obj.events.push(event)
            eventsCounter++
        })

        let tasksCounter = 0
        props.tasks.map((task) => {
            if (tasksCounter === 2) return
            else obj.tasks.push(task)
            tasksCounter++
        })

        setObj(obj)
    }, [props])

    const handleOpenEventInfo = (event: IEvent) => {
        openModal({
            title: event.summary,
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

    if (!obj) return null

    return (
        <>
            {obj.events.map((event, i) => (
                <div className={classes.event} key={i} onClick={() => handleOpenEventInfo(event)}>
                    <Text lineClamp={1} color="#fff" size="sm">
                        <b>{dayjs(event.start).format('HH:mm')}</b> {event.summary || event.title}
                    </Text>
                </div>
            ))}

            {obj.tasks.map((task, i) => (
                <Box
                    sx={{
                        backgroundColor: theme.colors[task.color][5]
                    }}
                    className={classes.task}
                    key={i}
                    onClick={() => handleEditTask(task)}
                >
                    <Text lineClamp={1} color="#fff" size="sm">
                        <b>{dayjs(task.deadline).format('HH:mm')}</b> {task.title}
                    </Text>
                </Box>
            ))}
        </>
    )
}

export default DashboardCalendarDayRenderer

const useStyles = createStyles((theme) => {
    return {
        event: {
            padding: '2px',
            paddingLeft: '4px',
            borderRadius: theme.radius.sm,
            cursor: 'pointer',
            marginBottom: '2px',
            backgroundColor: theme.colors.blue[5]
        },
        task: {
            padding: '2px',
            paddingLeft: '4px',
            borderRadius: theme.radius.sm,
            cursor: 'pointer',
            marginBottom: '2px'
        }
    }
})
