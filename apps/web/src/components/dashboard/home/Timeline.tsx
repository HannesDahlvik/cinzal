import { useEffect, useRef, useState } from 'react'
import { DasboardTimelineCheckEvents, IEvent, Task } from '../../../config/types'

import { useHookstate } from '@hookstate/core'
import state from '../../../state'

import { Affix, Box, Button, createStyles, Stack, Text, useMantineTheme } from '@mantine/core'
import { useElementSize, useMediaQuery } from '@mantine/hooks'
import { openModal } from '@mantine/modals'
import { Clock, List } from 'phosphor-react'

import dayjs from 'dayjs'
import DashboardEditTaskModal from '../modals/EditTask'
import DashboardEventInfoModal from '../modals/EventInfo'
import { timelineGetAttributes, timelineGetCollisions } from '../../../utils'

interface IParsedEvent {
    event: IEvent
    width: number
    height: number
    top: number
    left: number
}

interface Props {
    hours: number[]
    tasks: Task[]
    needlePos: number
    events: IEvent[]
}

const DashboardHomeTimeline: React.FC<Props> = ({ events, hours, needlePos, tasks }) => {
    const { classes } = useStyles()
    const theme = useMantineTheme()

    const { value: globalDate } = useHookstate(state.date)
    const { value: rightDrawer, set: setRightDrawer } = useHookstate(state.drawers.homeRightDrawer)
    const { value: leftDrawer, set: setLeftDrawer } = useHookstate(state.drawers.homeLeftDrawer)

    const [parsedEvents, setParsedEvents] = useState<IParsedEvent[]>([])

    const wrapperEl = useRef<HTMLDivElement>(null)
    const { ref: tasksWrapperRef, width: containerWidth } = useElementSize()

    const showRightDrawer = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`)
    const showLeftDrawer = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`)

    useEffect(() => {
        if (wrapperEl.current)
            wrapperEl.current.scrollTo({
                top: needlePos - 200,
                behavior: 'smooth'
            })
    }, [])

    useEffect(() => {
        const dayEvents = events.filter((event) => checkRenderBox(dayjs(event.start)))
        const parsedEvents: IParsedEvent[] = []

        if (dayEvents.length !== 0) {
            const eventsToCheckCollisions: DasboardTimelineCheckEvents[] = dayEvents.map(
                (event) => {
                    const startDate = dayjs(event.start)
                    const endDate = dayjs(event.end)
                    const start = startDate.hour() * 60 + 60 / (60 / startDate.minute())
                    let minute = endDate.diff(startDate, 'minute')
                    const end = start + minute

                    return {
                        start: Math.floor(start),
                        end: Math.floor(end)
                    }
                }
            )

            const collisions = timelineGetCollisions(eventsToCheckCollisions)
            const { leftOffSet, width } = timelineGetAttributes(eventsToCheckCollisions, collisions)

            dayEvents.map((event, i) => {
                const eventHeight = calcEventBoxHeight(event)
                let eventLeft = (containerWidth / width[i]) * (leftOffSet[i] - 1)
                if (!eventLeft || eventLeft < 0) eventLeft = 0
                let units = width[i]
                if (!units) units = 1
                const eventTop = calcBoxTopPos(dayjs(event.start))
                const eventWidth = containerWidth / units
                parsedEvents.push({
                    event,
                    width: eventWidth,
                    height: eventHeight,
                    top: eventTop,
                    left: eventLeft
                })
            })
            setParsedEvents(parsedEvents)
            return
        }
        setParsedEvents([])
    }, [events, globalDate, containerWidth])

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
    const calcBoxTopPos = (boxDate: dayjs.Dayjs): number => {
        const hourPos = boxDate.hour() * 100
        const minutePos = 100 / (60 / boxDate.minute())
        const topPos = hourPos + minutePos
        return topPos
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

    return (
        <div className={classes.wrapper} ref={wrapperEl}>
            {showLeftDrawer && (
                <Box sx={{ position: 'fixed', bottom: 100, left: 20, zIndex: 99 }}>
                    <Button size="sm" p="8px" onClick={() => setLeftDrawer(!leftDrawer)}>
                        <List size={22} />
                    </Button>
                </Box>
            )}

            {showRightDrawer && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: showLeftDrawer ? 100 : 20,
                        right: 20,
                        zIndex: 99
                    }}
                >
                    <Button size="sm" p="8px" onClick={() => setRightDrawer(!rightDrawer)}>
                        <Clock size={22} />
                    </Button>
                </Box>
            )}

            <div className={classes.timeWrapper}>
                {hours.map((_, hour) => (
                    <Text className={classes.timeBox} key={hour}>
                        {hour}:00
                    </Text>
                ))}
            </div>

            <div className={classes.innerWrapper}>
                <div className={classes.tasksWrapper} ref={tasksWrapperRef}>
                    {parsedEvents.map((row, i) => (
                        <Box
                            className={classes.box}
                            sx={{
                                top: row.top,
                                height: row.height,
                                minHeight: '60px',
                                width: row.width,
                                left: row.left
                            }}
                            key={i}
                        >
                            <Box
                                className={classes.innerBox}
                                sx={{ backgroundColor: theme.colors.blue[7] }}
                                onClick={() => handleOpenEventInfo(row.event)}
                            >
                                <Stack spacing={2}>
                                    <Text lineClamp={1} weight="bold">
                                        {row.event.summary || row.event.title}
                                    </Text>
                                    <Text lineClamp={1}>{row.event.location}</Text>
                                </Stack>
                            </Box>
                        </Box>
                    ))}

                    {tasks.map((task) => {
                        const render = checkRenderBox(dayjs(task.deadline))
                        if (render) {
                            const topPos = calcBoxTopPos(dayjs(task.deadline))

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

                {checkRenderBox(dayjs()) && (
                    <Box className={classes.needle} sx={{ top: needlePos }} />
                )}
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
            position: 'relative',

            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                gridTemplateColumns: '75px 1fr'
            }
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
