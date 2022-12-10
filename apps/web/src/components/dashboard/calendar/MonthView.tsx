import { useEffect, useRef, useState } from 'react'
import { IEvent, Task } from '../../../config/types'

import { useHookstate } from '@hookstate/core'
import state from '../../../state'

import { createStyles, Text } from '@mantine/core'

import dayjs, { Dayjs } from 'dayjs'
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

    const { value: globalDate } = useHookstate(state.date)

    const [month, setMonth] = useState<IFormatedDate[][]>([])
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (events && tasks) createMonth(tasks, events)
    }, [globalDate, events, tasks])

    const createMonth = (tasks: Task[], events: IEvent[]) => {
        let currentDate = globalDate.startOf('month').weekday(0)
        const nextMonth = globalDate.add(1, 'month').month()
        const monthData = createMonthData(globalDate.month(), tasks, events)
        let allDates = []
        let weekDates = []
        let weekCounter = 1
        while (currentDate.weekday(0).month() !== nextMonth) {
            const formated = formatDateObject(currentDate, monthData)
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

    const createMonthData = (month: number, tasks: Task[], events: IEvent[]) => {
        const obj: IMonthData = {
            tasks: [],
            events: []
        }

        tasks.map((task) => {
            const taskDeadline = dayjs(task.deadline)
            if (taskDeadline.year() === globalDate.year() && taskDeadline.month() === month)
                obj.tasks.push(task)
        })

        events.map((event) => {
            const eventStart = dayjs(event.start)
            if (eventStart.year() === globalDate.year() && eventStart.month() === month)
                obj.events.push(event)
        })

        return obj
    }

    const formatDateObject = (date: Dayjs, data: IMonthData): IFormatedDate => {
        const formatedObj: IFormatedDate = {
            date: date,
            isThisMonth: globalDate.month() === date.month(),
            isToday: date.isToday(),
            tasks: data.tasks.filter(
                (task) =>
                    dayjs(task.deadline).date() === date.date() &&
                    dayjs(task.deadline).month() === date.month()
            ),
            events: data.events.filter(
                (event) =>
                    dayjs(event.start).date() === date.date() &&
                    dayjs(event.start).month() === date.month()
            )
        }
        return formatedObj
    }

    const calcCalendarWeekHeight = (numOfWeeks: number) => {
        if (wrapperRef.current)
            wrapperRef.current.style.gridTemplateRows = `repeat(${numOfWeeks}, calc(100% / ${numOfWeeks}))`
    }

    return (
        <>
            <div className={classes.weekNames}>
                {dayjs.weekdays().map((day) => (
                    <Text className={classes.weekName} key={day}>
                        {day}
                    </Text>
                ))}
            </div>

            <div className={classes.innerWrapper} ref={wrapperRef}>
                {month.map((week, i) => (
                    <div className={classes.week} key={i}>
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
                    </div>
                ))}
            </div>
        </>
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
            borderBottom: 0,
            borderColor: isDark ? colors.dark[5] : colors.gray[4]
        },
        innerWrapper: {
            display: 'grid',
            height: 'calc(100% - 25.6px)',
            width: '100%'
        },
        week: {
            display: 'flex',
            justifyContent: 'space-between',
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
            borderColor: isDark ? colors.dark[5] : colors.gray[4]
        },
        dayText: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '26px',
            zIndex: 20,
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
