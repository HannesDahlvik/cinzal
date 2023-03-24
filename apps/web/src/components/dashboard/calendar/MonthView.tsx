import { useEffect, useRef, useState } from 'react'
import { IEvent, Task } from '../../../config/types'

import { useHookstate } from '@hookstate/core'
import state from '../../../state'

import { Box, createStyles, Text, useMantineTheme } from '@mantine/core'
import { useMediaQuery, useViewportSize } from '@mantine/hooks'
import { getWeekdaysNames } from '@mantine/dates'

import dayjs, { Dayjs, locale } from 'dayjs'
import DashboardCalendarDayRenderer from './DayRenderer'

interface IFormatedDate {
    date: Dayjs
    isThisMonth: boolean
    isToday: boolean
    tasks: Task[]
    events: IEvent[]
}

interface IMonthData {
    tasks: Task[]
    events: IEvent[]
}

interface Props {
    events: IEvent[]
    tasks: Task[]
}

const DashboardCalendarMonthView: React.FC<Props> = ({ events, tasks }) => {
    const { classes } = useStyles()
    const theme = useMantineTheme()

    const { value: globalDate } = useHookstate(state.date)

    const [month, setMonth] = useState<IFormatedDate[][]>([])
    const wrapperRef = useRef<HTMLDivElement>(null)
    const showBottomBar = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`)
    const { width: windowWidth } = useViewportSize()

    useEffect(() => {
        if (events && tasks) createMonth(tasks, events)
    }, [globalDate, events, tasks])

    const createMonth = (tasks: Task[], events: IEvent[]) => {
        let currentDate = globalDate.startOf('month').weekday(0)
        const nextMonth = globalDate.add(1, 'month').month()
        let allDates: IFormatedDate[][] = []
        let weekDates: IFormatedDate[] = []
        let weekCounter = 1
        while (currentDate.weekday(0).month() !== nextMonth) {
            const formated = formatDateObject(currentDate, {
                events,
                tasks
            })
            weekDates.push(formated)
            if (weekCounter === 7) {
                allDates.push(weekDates)
                weekDates = []
                weekCounter = 0
            }
            weekCounter++
            currentDate = currentDate.add(1, 'day')
        }

        calcCalendarWeekHeight(allDates.length)
        setMonth(allDates)
    }

    const formatDateObject = (date: Dayjs, data: IMonthData): IFormatedDate => {
        const formatedObj: IFormatedDate = {
            date,
            isThisMonth: globalDate.month() === date.month(),
            isToday: date.isToday(),
            tasks: data.tasks.filter((task) => dayjs(task.deadline).isSame(date, 'day')),
            events: data.events.filter((event) => dayjs(event.start).isSame(date, 'day'))
        }
        return formatedObj
    }

    const calcCalendarWeekHeight = (numOfWeeks: number) => {
        if (wrapperRef.current)
            wrapperRef.current.style.gridTemplateRows = `repeat(${numOfWeeks}, calc(100% / ${numOfWeeks}))`
    }

    return (
        <div>
            <div className={classes.weekNames}>
                {getWeekdaysNames(locale(), 'monday', !showBottomBar ? 'dddd' : 'ddd').map(
                    (day) => (
                        <Text className={classes.weekName} key={day}>
                            {day}
                        </Text>
                    )
                )}
            </div>

            <div className={classes.innerWrapper} ref={wrapperRef}>
                {month.map((week, i) => (
                    <Box
                        className={classes.week}
                        key={i}
                        sx={{
                            gridTemplateColumns: `repeat(7, ${
                                (showBottomBar ? windowWidth : windowWidth - 100) / 7
                            }px)`
                        }}
                    >
                        {week.map((day, j) => (
                            <div
                                className={`${classes.day} ${day.isToday ? classes.isToday : ''} ${
                                    !day.isThisMonth ? classes.notThisMonth : ''
                                }`}
                                key={j}
                            >
                                <Text className={`${classes.dayText} `}>{day.date.date()}</Text>

                                <DashboardCalendarDayRenderer
                                    tasks={day.tasks}
                                    events={day.events}
                                />
                            </div>
                        ))}
                    </Box>
                ))}
            </div>
        </div>
    )
}

export default DashboardCalendarMonthView

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors
    const spacing = theme.spacing

    return {
        weekNames: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        weekName: {
            textAlign: 'center',
            width: '100%',
            border: '1px solid',
            borderTop: 0,
            borderBottom: 0,
            borderColor: isDark ? colors.dark[5] : colors.gray[4]
        },
        innerWrapper: {
            display: 'grid',
            height: 'calc(100% - 25.6px)',
            width: '100%'
        },
        week: {
            display: 'grid',
            height: '100%'
        },
        day: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
            padding: '2px',
            paddingLeft: spacing.xs,
            paddingRight: spacing.xs,
            border: '1px solid',
            borderColor: isDark ? colors.dark[5] : colors.gray[4],

            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                paddingLeft: 0,
                paddingRight: 0,
                padding: '4px'
            }
        },
        dayText: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '26px',
            zIndex: 1,
            color: isDark ? '#fff' : '#000'
        },
        isToday: {
            '&:after': {
                content: `""`,
                position: 'absolute',
                top: 3,
                left: 0,
                right: 0,
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '26px',
                height: '26px',
                backgroundColor: colors.blue[5],
                borderRadius: theme.radius.xl
            }
        },
        notThisMonth: {
            opacity: '0.75',
            backgroundColor: isDark ? colors.dark[8] : colors.gray[3]
        }
    }
})
