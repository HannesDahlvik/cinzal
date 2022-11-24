import { useEffect, useState } from 'react'
import { IEvent, Task } from '../../config/types'

import { useHookstate } from '@hookstate/core'
import state from '../../state'

import { createStyles, Text } from '@mantine/core'

import ErrorPage from '../Error'
import LoadingPage from '../Loading'

import DashboardDateChanger from '../../components/dashboard/DateChanger'
import DashboardCalendarDayRenderer from '../../components/dashboard/calendar/DayRenderer'

import dayjs, { Dayjs } from 'dayjs'
import { trpc } from '../../utils'

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

const DashboardCalendarPage: React.FC = () => {
    const { classes } = useStyles()

    const tasksQuery = trpc.tasks.get.useQuery()
    const calendarLinks = trpc.calendar.links.useQuery()
    const eventsQuery = trpc.events.all.useQuery(
        { calendarUrls: calendarLinks.data },
        { enabled: !!calendarLinks.isSuccess }
    )

    const { value: globalDate } = useHookstate(state.date)

    const [month, setMonth] = useState<IFormatedDate[][]>([])

    useEffect(() => {
        if (eventsQuery.data && tasksQuery.data)
            createMonth(tasksQuery.data as Task[], eventsQuery.data as IEvent[])
    }, [globalDate, eventsQuery.isFetched, tasksQuery.isFetched])

    const formatDateObject = (date: Dayjs, data: IMonthData): IFormatedDate => {
        const formatedObj: IFormatedDate = {
            date: date,
            isThisMonth: globalDate.month() === date.month(),
            isToday: date.isToday(),
            tasks: data.tasks.filter((task) => dayjs(task.deadline).date() === date.date()),
            events: data.events.filter((event) => dayjs(event.start).date() === date.date())
        }
        return formatedObj
    }

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

    if (tasksQuery.error || calendarLinks.error || eventsQuery.error)
        return (
            <ErrorPage
                error={
                    tasksQuery.error?.message ||
                    calendarLinks.error?.message ||
                    eventsQuery.error?.message
                }
            />
        )

    if (calendarLinks.isLoading || eventsQuery.isLoading || tasksQuery.isLoading)
        return <LoadingPage />

    return (
        <div className={classes.calendar}>
            <div className={classes.dateChanger}>
                <DashboardDateChanger />
            </div>

            <div className={classes.weekNames}>
                {dayjs.weekdays().map((day) => (
                    <Text className={classes.weekName} key={day}>
                        {day}
                    </Text>
                ))}
            </div>

            <div className={classes.innerWrapper}>
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

                                <div>
                                    <DashboardCalendarDayRenderer
                                        tasks={day.tasks}
                                        events={day.events}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DashboardCalendarPage

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors
    const spacing = theme.spacing

    return {
        calendar: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100%'
        },
        dateChanger: {
            padding: spacing.md,
            width: '100%'
        },
        weekNames: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        },
        weekName: {
            textAlign: 'center',
            width: '100%',
            border: '1px solid',
            borderBottom: 0,
            borderColor: isDark ? colors.dark[5] : colors.gray[4]
        },
        innerWrapper: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
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
