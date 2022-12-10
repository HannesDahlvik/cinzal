import { useEffect, useMemo, useState } from 'react'
import { IEvent, Task } from '../../../config/types'

import { useHookstate } from '@hookstate/core'
import state from '../../../state'

import { Box, createStyles, Text } from '@mantine/core'

import LoadingPage from '../../../pages/Loading'

import dayjs, { Dayjs } from 'dayjs'

interface IFormatedDate {
    date: Dayjs
    isBeforeNow: boolean
    tasks: Task[]
    events: IEvent[]
}

interface IWeekDays {
    name: string
    date: Dayjs
}

interface IWeekData {
    tasks: Task[]
    events: IEvent[]
}

interface Props {
    events: IEvent[]
    tasks: Task[]
}

const DashboardCalendarWeekView: React.FC<Props> = ({ events, tasks }) => {
    const { classes } = useStyles()

    const { value: globalDate } = useHookstate(state.date)

    const [weekDays, setWeekDays] = useState<IWeekDays[]>([])
    const [needlePos, setNeedlePos] = useState(0)
    const [render, setRender] = useState(false)
    const [week, setWeek] = useState<IFormatedDate[]>([])
    const hours = useMemo(() => Array.from<number>({ length: 24 }).fill(0), [])

    useEffect(() => {
        calcNeedlePos()
        const interval = setInterval(() => calcNeedlePos(), 1000)
        setRender(true)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (events && tasks) {
            createWeekDays()
            createWeek()
        }
    }, [globalDate, events, tasks])

    const calcNeedlePos = () => {
        const time = dayjs()
        const hour = time.hour()
        const minute = time.minute()

        const hourPos = hour * 100
        const minutePos = 100 / (60 / minute)
        const finalPos = hourPos + minutePos

        setNeedlePos(finalPos)
    }

    const createWeekDays = () => {
        let currentDate = globalDate.startOf('week')
        const week: IWeekDays[] = []
        for (let i = 0; i <= 6; i++) {
            week.push({
                date: currentDate,
                name: dayjs.weekdaysShort()[i]
            })
            currentDate = currentDate.add(1, 'day')
        }
        setWeekDays(week)
    }

    const createWeek = () => {
        let currentDate = globalDate.startOf('week')
        const weekStart = globalDate.startOf('week')
        const weekEnd = globalDate.endOf('week')
        const weekData = createWeekData(weekStart, weekEnd)
        const data: IFormatedDate[] = []
        for (let i = weekStart.date(); i <= weekEnd.date(); i++) {
            const formatted = formatDateObject(currentDate, weekData)
            data.push(formatted)
            currentDate = currentDate.add(1, 'day')
        }

        setWeek(data)
    }

    const createWeekData = (start: Dayjs, end: Dayjs) => {
        const obj: IWeekData = {
            tasks: [],
            events: []
        }

        tasks.map((task) => {
            const taskDeadline = dayjs(task.deadline)
            if (taskDeadline.year() === globalDate.year() && taskDeadline.isBetween(start, end))
                obj.tasks.push(task)
        })

        events.map((event) => {
            const eventStart = dayjs(event.start)
            if (eventStart.year() === globalDate.year() && eventStart.isBetween(start, end))
                obj.events.push(event)
        })

        return obj
    }

    const formatDateObject = (date: Dayjs, data: IWeekData): IFormatedDate => {
        const formatedObj: IFormatedDate = {
            date: date,
            isBeforeNow: false,
            tasks: data.tasks.filter(
                (task) =>
                    dayjs(task.deadline).year() === date.year() &&
                    dayjs(task.deadline).date() === date.date() &&
                    dayjs(task.deadline).month() === date.month()
            ),
            events: data.events.filter(
                (event) =>
                    dayjs(event.start).year() === date.year() &&
                    dayjs(event.start).date() === date.date() &&
                    dayjs(event.start).month() === date.month()
            )
        }
        return formatedObj
    }

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

    if (!render) return <LoadingPage />

    return (
        <div className={classes.wrapper}>
            <div className={classes.weekDates}>
                {weekDays.map((day) => (
                    <div className={classes.weekDate} key={day.name}>
                        <Text size="sm" transform="uppercase">
                            {day.name}
                        </Text>
                        <Text size="xl" weight="bold">
                            {day.date.date()}
                        </Text>
                    </div>
                ))}
            </div>

            <div className={classes.weekWrapper}>
                <div className={classes.hoursWrapper}>
                    {hours.map((_, hour) => (
                        <Text className={classes.timeBox} key={hour}>
                            {hour}:00
                        </Text>
                    ))}
                </div>

                {checkRenderBox(dayjs()) && (
                    <Box className={classes.needle} sx={{ top: needlePos }} />
                )}
            </div>
        </div>
    )
}

export default DashboardCalendarWeekView

const useStyles = createStyles((theme) => {
    const colors = theme.colors

    return {
        wrapper: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
        },
        weekDates: {
            position: 'sticky',
            top: 60,
            display: 'flex',
            justifyContent: 'space-between',
            height: '75px',
            paddingLeft: '75px',
            backgroundColor: colors.dark[7],
            borderBottom: '1px solid',
            borderColor: colors.dark[5],
            zIndex: 1
        },
        weekDate: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            textAlign: 'center'
        },
        weekWrapper: {
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '75px 1fr',
            overflowY: 'auto'
        },
        hoursWrapper: {
            display: 'grid',
            gridTemplateRows: 'repeat(24, 100px)',
            textAlign: 'center'
        },
        timeBox: {
            width: '100%',
            height: '100%',
            borderBottom: '1px solid',
            borderColor: colors.dark[5]
        },
        needle: {
            position: 'absolute',
            right: 0,
            width: 'calc(100% - 75px)',
            height: '1px',
            backgroundColor: colors.red[6]
        }
    }
})
