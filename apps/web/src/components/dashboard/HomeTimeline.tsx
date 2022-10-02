import { useEffect, useRef, useState } from 'react'
import { Task } from '../../config/types'

import state from '../../state'
import { useHookstate } from '@hookstate/core'

import { Box, createStyles, Text } from '@mantine/core'
import { openModal } from '@mantine/modals'

import dayjs from 'dayjs'
import DashboardEditTaskModal from './EditTaskModal'

const DashboardHomeTimeline: React.FC = () => {
    const { classes } = useStyles()

    const { value: tasks } = useHookstate(state.data.tasks)

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
                    {tasks.map((task) => {
                        const date = dayjs()
                        const taskDate = dayjs(task.deadline)

                        if (
                            taskDate.date() === date.date() &&
                            taskDate.month() === date.month() &&
                            taskDate.year() === date.year()
                        ) {
                            const hourPos = taskDate.hour() * 100
                            const minutePos = 100 / (60 / taskDate.minute())
                            const finalPos = hourPos + minutePos
                            return (
                                <Box
                                    className={classes.taskBox}
                                    sx={{ top: finalPos }}
                                    key={task.id}
                                >
                                    <div
                                        className={classes.innerTaskBox}
                                        onClick={() => handleEditTask(task)}
                                    >
                                        <Text>{task.title}</Text>
                                    </div>
                                </Box>
                            )
                        } else return null
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
            backgroundColor: isDark ? colors.dark[7] : theme.white,
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
            position: 'absolute',
            display: 'flex',
            width: '100%',
            height: '100%'
        },
        taskBox: {
            position: 'relative',
            width: '100%',
            height: '30px',
            padding: '0 12px',
            flex: '1'
        },
        innerTaskBox: {
            height: '100%',
            backgroundColor: colors.blue[7],
            borderRadius: theme.radius.sm,
            padding: '2px',
            cursor: 'pointer'
        },
        timeBox: {
            width: '100%',
            height: '100%',
            borderTop: '1px solid',
            borderLeft: '1px solid',
            borderColor: isDark ? colors.dark[5] : colors.gray[2]
        },
        needle: {
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: colors.blue[5]
        }
    }
})
