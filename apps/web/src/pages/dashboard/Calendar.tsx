import { useEffect, useState } from 'react'
import { Task } from '../../config/types'

import { useHookstate } from '@hookstate/core'
import state from '../../state'

import { createStyles, Text } from '@mantine/core'

import DashboardDateChanger from '../../components/dashboard/DateChanger'

import dayjs, { Dayjs } from 'dayjs'
import DashboardCalendarDayTasks from '../../components/dashboard/calendar/DayTasks'

interface IFormatedDate {
    date: Dayjs
    isThisMonth: boolean
    isToday: boolean
    tasks: Task[]
}

interface IMonthData {
    tasks: Task[]
}

const DashboardCalendarPage: React.FC = () => {
    const { classes } = useStyles()

    const { value: globalDate } = useHookstate(state.date)
    const { value: tasks } = useHookstate(state.data.tasks)

    const [month, setMonth] = useState<IFormatedDate[][]>([])

    useEffect(() => {
        createMonth()
    }, [globalDate])

    const formatDateObject = (date: Dayjs, data: IMonthData): IFormatedDate => {
        const formatedObj: IFormatedDate = {
            date: date,
            isThisMonth: globalDate.month() === date.month(),
            isToday: date.isToday(),
            tasks: data.tasks.filter((task) => dayjs(task.deadline).date() === date.date())
        }
        return formatedObj
    }

    const createMonth = () => {
        let currentDate = globalDate.startOf('month').weekday(0)
        const nextMonth = globalDate.add(1, 'month').month()
        const monthData = createMonthData(globalDate.month())
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

    const createMonthData = (month: number) => {
        const obj: IMonthData = {
            tasks: []
        }

        tasks.map((task) => {
            const taskDeadline = dayjs(task.deadline)
            if (taskDeadline.year() === globalDate.year() && taskDeadline.month() === month)
                obj.tasks.push(task)
        })

        return obj
    }

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

                                {day.tasks && <DashboardCalendarDayTasks tasks={day.tasks} />}
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

    return {
        calendar: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100%'
        },
        dateChanger: {
            padding: theme.spacing.md,
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
            display: 'grid',
            gridTemplateRows: '32px 1fr',
            gap: '8px',
            width: '100%',
            padding: theme.spacing.xs,
            border: '1px solid',
            borderColor: isDark ? colors.dark[5] : colors.gray[4]
        },
        dayText: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '32px',
            zIndex: 99
        },
        isToday: {
            '&:after': {
                content: `""`,
                position: 'absolute',
                top: 12,
                left: 0,
                right: 0,
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '32px',
                height: '32px',
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
