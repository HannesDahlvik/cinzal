import { useEffect, useState } from 'react'
import { DasboardTimelineCheckEvents, IEvent, Task } from '../../../config/types'

import { useHookstate } from '@hookstate/core'
import state from '../../../state'

import { Box, createStyles, Stack, Text, useMantineTheme } from '@mantine/core'
import { useElementSize, useMediaQuery } from '@mantine/hooks'
import { openModal } from '@mantine/modals'

import DashboardEventInfoModal from '../modals/EventInfo'

import dayjs, { Dayjs } from 'dayjs'
import { timelineGetAttributes, timelineGetCollisions } from '../../../utils'

interface IParsedEvent {
    event: IEvent
    width: number
    height: number
    top: number
    left: number
}

interface Props {
    date: Dayjs
    events: IEvent[]
    tasks: Task[]
    hours: number[]
    col: number
    needlePos: number
}

const DashboardCalendarWeekViewTimeline: React.FC<Props> = ({
    date,
    events,
    tasks,
    hours,
    col,
    needlePos
}) => {
    const { classes } = useStyles()
    const theme = useMantineTheme()

    const { value: globalDate } = useHookstate(state.date)

    const [parsedEvents, setParsedEvents] = useState<IParsedEvent[]>([])
    const { ref: wrapperRef, width: containerWidth } = useElementSize()

    const showBottomBar = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`)

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
                    let end = start + minute
                    if (startDate.isSame(endDate)) end += 30

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
            boxDate.date() === date.date() &&
            boxDate.month() === date.month() &&
            boxDate.year() === date.year()
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
        let end = dayjs(new Date(event.end))
        if (start.isSame(end)) end.add(30, 'minutes')
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

    return (
        <div className={classes.wrapper} ref={wrapperRef}>
            {parsedEvents.map((row, i) => (
                <Box
                    className={classes.box}
                    sx={{
                        top: row.top,
                        height: row.height,
                        minHeight: '60px',
                        width: row.width,
                        left: row.left + col * containerWidth + col
                    }}
                    key={i}
                >
                    <Box
                        className={classes.innerBox}
                        sx={{ backgroundColor: theme.colors.blue[7] }}
                        onClick={() => handleOpenEventInfo(row.event)}
                    >
                        <Text
                            size={showBottomBar ? 'xs' : 'sm'}
                            lineClamp={showBottomBar ? 10 : 1}
                            weight="bold"
                        >
                            {row.event.summary || row.event.title}

                            {!showBottomBar && (
                                <Text size="sm" lineClamp={1} weight="normal">
                                    {row.event.location}
                                </Text>
                            )}
                        </Text>
                    </Box>
                </Box>
            ))}

            {hours.map((_, hour) => (
                <div className={classes.timeBox} key={hour}></div>
            ))}

            {checkRenderBox(dayjs()) && (
                <Box
                    className={classes.needle}
                    sx={{ top: needlePos, left: col * containerWidth + col, width: containerWidth }}
                />
            )}
        </div>
    )
}

export default DashboardCalendarWeekViewTimeline

const useStyles = createStyles((theme) => {
    const colors = theme.colors

    return {
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid',
            borderLeftColor: colors.dark[5]
        },
        timeBox: {
            width: '100%',
            height: '100%',
            borderBottom: '1px solid',
            borderRight: '1px solid',
            borderColor: colors.dark[5]
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
        needle: {
            position: 'absolute',
            right: 0,
            height: '1px',
            backgroundColor: colors.red[6]
        }
    }
})
