import { useEffect, useState } from 'react'

import { useHookstate } from '@hookstate/core'
import state from '../../state'

import { createStyles, Text } from '@mantine/core'

import DashboardDateChanger from '../../components/dashboard/DateChanger'

import dayjs, { Dayjs } from 'dayjs'

interface IFormatedDate {
    date: Dayjs
    isThisMonth: boolean
    isToday: boolean
}

const DashboardCalendarPage: React.FC = () => {
    const { classes } = useStyles()

    const { value: globalDate } = useHookstate(state.date)

    const [month, setMonth] = useState<IFormatedDate[][]>([])

    useEffect(() => {
        createMonth()
    }, [globalDate])

    const formatDateObject = (date: Dayjs): IFormatedDate => {
        const formatedObj: IFormatedDate = {
            date: date,
            isThisMonth: globalDate.month() === date.month(),
            isToday: date.isToday()
        }
        return formatedObj
    }

    const createMonth = () => {
        let currentDate = globalDate.startOf('month').weekday(0)
        const nextMonth = globalDate.add(1, 'month').month()
        let allDates = []
        let weekDates = []
        let weekCounter = 1
        while (currentDate.weekday(0).month() !== nextMonth) {
            const formated = formatDateObject(currentDate)
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
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            padding: theme.spacing.md,
            border: '1px solid',
            borderColor: isDark ? colors.dark[5] : colors.gray[4]
        },
        dayText: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '32px',
            height: '32px',
            zIndex: 99
        },
        isToday: {
            '&:after': {
                content: `""`,
                position: 'absolute',
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
