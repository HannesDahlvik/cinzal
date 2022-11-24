import { useEffect, useRef, useState } from 'react'
import { IEvent, Task } from '../../../config/types'

import { useHookstate } from '@hookstate/core'
import state from '../../../state'

import { Box, createStyles, Stack, Text, useMantineTheme } from '@mantine/core'
import { openModal } from '@mantine/modals'

import dayjs from 'dayjs'
import DashboardEditTaskModal from '../modals/EditTask'
import DashboardEventInfoModal from '../modals/EventInfo'

interface IParsedEvent {
    event: IEvent
    width: number
    height: number
    left: number
}

interface Props {
    hours: number[]
    needlePos: number
    tasks: Task[]
    events: IEvent[]
}

const DashboardHomeTimeline: React.FC<Props> = ({ events, hours, needlePos, tasks }) => {
    const { classes } = useStyles()
    const theme = useMantineTheme()

    const { value: globalDate } = useHookstate(state.date)

    const [parsedEvents, setParsedEvents] = useState<IParsedEvent[] | null>(null)

    const wrapperEl = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (wrapperEl.current) {
            wrapperEl.current.scrollTo({
                top: needlePos - 200,
                behavior: 'smooth'
            })
        }
    }, [])

    useEffect(() => {
        /**
         * All these calculations only work for two events that
         * are beside each other, but it's good progress.
         */
        const dayEvents = events.filter((event) => checkRenderBox(dayjs(event.start)))
        const parsedDayEvents: IParsedEvent[] = []
        /**
         * Check if events are happening during the same time and
         * change width on them
         */
        dayEvents.map((event) => {
            const eventStart = dayjs(event.start)
            dayEvents.map((row) => {
                if (row !== event) {
                    const rowStart = dayjs(row.start)
                    const rowEnd = dayjs(row.end)

                    if (eventStart.isBetween(rowStart, rowEnd)) {
                        parsedDayEvents.push(
                            {
                                event: row,
                                height: calcEventBoxHeight(row),
                                width: 50,
                                left: 0
                            },
                            {
                                event,
                                height: calcEventBoxHeight(event),
                                width: 50,
                                left: 50
                            }
                        )
                    }
                }
            })
        })

        /**
         * Add all other events that dont need another width
         */
        dayEvents.map((event) => {
            const eventHeight = calcEventBoxHeight(event)
            const index = parsedDayEvents.findIndex((obj) => obj.event === event)
            if (index === -1) {
                parsedDayEvents.push({
                    event,
                    height: eventHeight,
                    left: 0,
                    width: 100
                })
            }
        })

        setParsedEvents(parsedDayEvents)
    }, [events, globalDate])

    /**
     * Checks if element should be rendered based on global date
     */
    const checkRenderBox = (boxDate: dayjs.Dayjs) => {
        if (
            boxDate.date() === globalDate.date() &&
            boxDate.month() === globalDate.month() &&
            boxDate.year() === globalDate.year()
        )
            return true
        else return false
    }

    /**
     * Calculates box top position
     */
    const calcBoxPos = (boxDate: dayjs.Dayjs): number => {
        const hourPos = boxDate.hour() * 100
        const minutePos = 100 / (60 / boxDate.minute())
        const finalPos = hourPos + minutePos
        return finalPos
    }

    /**
     * Calculates event height based on start and end date
     */
    const calcEventBoxHeight = (event: IEvent) => {
        const start = dayjs(new Date(event.start))
        const end = dayjs(new Date(event.end))
        const minute = end.diff(start, 'minute')
        return (minute / 60) * 100
    }

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

    if (!parsedEvents) return null

    return (
        <div className={classes.wrapper} ref={wrapperEl}>
            <div className={classes.timeWrapper}>
                {hours.map((_, hour) => (
                    <Text className={classes.timeBox} key={hour}>
                        {hour}:00
                    </Text>
                ))}
            </div>

            <div className={classes.innerWrapper}>
                <div className={classes.tasksWrapper}>
                    {parsedEvents.map((row, i) => {
                        const topPos = calcBoxPos(dayjs(row.event.start))

                        return (
                            <Box
                                className={classes.box}
                                sx={{
                                    top: topPos,
                                    height: `${row.height}px`,
                                    minHeight: '60px',
                                    width: `${row.width}%`,
                                    left: `${row.left}%`
                                }}
                                key={i}
                            >
                                <Box
                                    className={classes.innerBox}
                                    sx={{ backgroundColor: theme.colors.blue[7] }}
                                    onClick={() => handleOpenEventInfo(row.event)}
                                >
                                    <Stack spacing={2}>
                                        <Text lineClamp={1}>
                                            {row.event.summary || row.event.title}
                                        </Text>
                                        <Text lineClamp={1}>{row.event.location}</Text>
                                    </Stack>
                                </Box>
                            </Box>
                        )
                    })}

                    {tasks.map((task) => {
                        const render = checkRenderBox(dayjs(task.deadline))
                        if (render) {
                            const topPos = calcBoxPos(dayjs(task.deadline))

                            return (
                                <Box
                                    className={classes.box}
                                    sx={{ top: topPos, height: '30px' }}
                                    key={task.id}
                                >
                                    <Box
                                        className={classes.innerBox}
                                        sx={{ backgroundColor: theme.colors[task.color][7] }}
                                        onClick={() => handleEditTask(task)}
                                    >
                                        <Text mr="sm">
                                            {dayjs(new Date(task.deadline)).format('HH:mm')}
                                        </Text>
                                        <Text>{task.title}</Text>
                                    </Box>
                                </Box>
                            )
                        } else return null
                    })}
                </div>

                {hours.map((_, hour) => (
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
            position: 'absolute',
            display: 'flex',
            width: '100%',
            height: '100%'
        },
        box: {
            position: 'absolute',
            padding: '0 3px'
        },
        innerBox: {
            display: 'flex',
            height: '100%',
            borderRadius: theme.radius.sm,
            border: '1px solid',
            borderColor: colors.dark[7],
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
            backgroundColor: colors.red[6]
        }
    }
})
