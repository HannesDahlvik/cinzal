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

    const [arr, setArr] = useState<Props | null>(null)

    useEffect(() => {
        const preArr: Props = {
            events: [],
            tasks: []
        }

        props.events.map((event) => preArr.events.push(event))
        props.tasks.map((task) => preArr.tasks.push(task))

        setArr(preArr)
    }, [props])

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

    if (!arr) return null

    return (
        <>
            {arr.events.map((event, i) => (
                <div className={classes.event} key={i} onClick={() => handleOpenEventInfo(event)}>
                    <Text lineClamp={1} color="#fff" size="xs">
                        <b>{dayjs(event.start).format('HH:mm')}</b> {event.summary || event.title}
                    </Text>
                </div>
            ))}

            {arr.tasks.map((task, i) => (
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
        </>
    )
}

export default DashboardCalendarDayRenderer

const useStyles = createStyles((theme) => {
    return {
        event: {
            paddingLeft: '4px',
            marginBottom: '2px',
            borderRadius: theme.radius.sm,
            cursor: 'pointer',
            transition: '.3s',

            '&:hover': {
                background: 'rgba(10, 10, 10, 0.5)'
            }
        },
        task: {
            paddingLeft: '4px',
            borderRadius: theme.radius.sm,
            cursor: 'pointer',
            marginBottom: '2px'
        }
    }
})
