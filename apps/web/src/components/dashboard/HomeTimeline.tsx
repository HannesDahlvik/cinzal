import { useEffect, useRef, useState } from 'react'
import { Task } from '../../config/types'

import state from '../../state'
import { useHookstate } from '@hookstate/core'

import { Box, createStyles, Text, useMantineTheme } from '@mantine/core'
import { openModal } from '@mantine/modals'

import dayjs from 'dayjs'
import DashboardEditTaskModal from './EditTaskModal'

const DashboardHomeTimeline: React.FC = () => {
    const { classes } = useStyles()
    const theme = useMantineTheme()

    const { value: tasks } = useHookstate(state.data.tasks)
    const { value: events } = useHookstate(state.data.events)

    const wrapperEl = useRef<HTMLDivElement>(null)

    const [needlePos, setNeedlePos] = useState(0)

    const times = Array.from<number>({ length: 24 }).fill(0)

    useEffect(() => {
        const el = document.querySelector<HTMLDivElement>(`#time-${dayjs().hour()}`)

        if (wrapperEl.current && el) {
            wrapperEl.current.scrollTo({
                top: el.offsetTop - 200,
                behavior: 'smooth'
            })
        }

        calcNeedlePos()
        const interval = setInterval(() => calcNeedlePos(), 1000)

        return () => clearInterval(interval)
    }, [])

    const calcNeedlePos = () => {
        const time = dayjs()
        const hour = time.hour()
        const minute = time.minute()

        const hourPos = hour * 100
        const minutePos = 100 / (60 / minute)
        const finalPos = hourPos + minutePos

        setNeedlePos(finalPos)
    }

    const calcBoxFinalPos = (boxDate: dayjs.Dayjs) => {
        const date = dayjs()
        if (
            boxDate.date() === date.date() &&
            boxDate.month() === date.month() &&
            boxDate.year() === date.year()
        ) {
            const hourPos = boxDate.hour() * 100
            const minutePos = 100 / (60 / boxDate.minute())
            const finalPos = hourPos + minutePos
            return finalPos
        } else return null
    }

    const handleEditTask = (task: Task) => {
        openModal({
            title: `Edit ${task.title}`,
            children: <DashboardEditTaskModal task={task} />
        })
    }

    return (
        <div className={classes.wrapper} ref={wrapperEl}>
            <div className={classes.timeWrapper}>
                {times.map((row, hour) => (
                    <Text className={classes.timeBox} id={`time-${hour}`} key={hour}>
                        {hour}:00
                    </Text>
                ))}
            </div>

            <div className={classes.innerWrapper}>
                <div className={classes.tasksWrapper}>
                    {events.map((event, i) => {
                        const finalPos = calcBoxFinalPos(dayjs(event.start))

                        if (finalPos) {
                            return (
                                <Box className={classes.taskBox} sx={{ top: finalPos }} key={i}>
                                    <Box className={classes.innerTaskBox}>
                                        <Text lineClamp={1}>{event.summary}</Text>
                                        <Text lineClamp={1}>{event.location}</Text>
                                    </Box>
                                </Box>
                            )
                        } else return null
                    })}

                    {tasks.map((task) => {
                        const finalPos = calcBoxFinalPos(dayjs(task.deadline))
                        if (finalPos)
                            return (
                                <Box
                                    className={classes.taskBox}
                                    sx={{ top: finalPos }}
                                    key={task.id}
                                >
                                    <Box
                                        className={classes.innerTaskBox}
                                        sx={{ backgroundColor: theme.colors[task.color][7] }}
                                        onClick={() => handleEditTask(task)}
                                    >
                                        <Text>{task.title}</Text>
                                    </Box>
                                </Box>
                            )
                        else return null
                    })}
                </div>

                {times.map((row, hour) => (
                    <div className={classes.timeBox} key={hour}></div>
                ))}

                <Box className={classes.needle} sx={{ top: needlePos }} />
            </div>
        </div>
    )
}

export default DashboardHomeTimeline

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors

    return {
        wrapper: {
            display: 'grid',
            gridTemplateColumns: '100px 1fr',
            height: '100%',
            backgroundColor: !isDark ? colors.gray[2] : '',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            position: 'relative'
        },
        timeWrapper: {
            display: 'grid',
            gridTemplateRows: 'repeat(24, 100px)',
            textAlign: 'center'
        },
        innerWrapper: {
            position: 'relative',
            display: 'grid',
            gridTemplateRows: 'repeat(24, 100px)'
        },
        tasksWrapper: {
            position: 'relative',
            display: 'flex',
            width: '100%',
            height: '100%'
        },
        taskBox: {
            position: 'relative',
            width: '100%',
            height: '60px',
            padding: '0 3px'
        },
        innerTaskBox: {
            height: '100%',
            borderRadius: theme.radius.sm,
            backgroundColor: colors.blue[7],
            color: '#fff',
            padding: '2px',
            cursor: 'pointer'
        },
        timeBox: {
            width: '100%',
            height: '100%',
            borderTop: '1px solid',
            borderLeft: '1px solid',
            borderColor: isDark ? colors.dark[5] : colors.gray[4]
        },
        needle: {
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: colors.blue[5]
        }
    }
})
