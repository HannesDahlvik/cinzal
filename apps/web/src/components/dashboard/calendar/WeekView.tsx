import { useEffect, useMemo, useRef, useState } from 'react'
import { IEvent, Task } from '../../../config/types'

import { useHookstate } from '@hookstate/core'
import state from '../../../state'

import { Box, createStyles, Text, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

import LoadingPage from '../../../pages/Loading'
import DashboardCalendarWeekViewTimeline from './WeekViewTimeline'

import dayjs, { Dayjs } from 'dayjs'

interface IFormatedDate {
    date: Dayjs
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
    const theme = useMantineTheme()

    const { value: globalDate } = useHookstate(state.date)

    const [render, setRender] = useState(false)
    const [needlePos, setNeedlePos] = useState(0)
    const [weekDays, setWeekDays] = useState<IWeekDays[]>([])
    const [week, setWeek] = useState<IFormatedDate[]>([])
    const hours = useMemo(() => Array.from<number>({ length: 24 }).fill(0), [])
    const wrapperEl = useRef<HTMLDivElement>(null)

    const showBottomBar = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`)

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

    useEffect(() => {
        if (render && wrapperEl.current)
            wrapperEl.current.scrollTo({
                top: needlePos - 300,
                behavior: 'smooth'
            })
    }, [render])

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
        for (let i = 0; i < 7; i++) {
            week.push({
                date: currentDate,
                name: dayjs.weekdaysShort(true)[i]
            })
            currentDate = currentDate.add(1, 'day')
        }
        setWeekDays(week)
    }

    const createWeek = () => {
        let currentDate = globalDate.startOf('week')
        const data: IFormatedDate[] = []
        for (let i = 0; i < 7; i++) {
            const formatted = formatDateObject(currentDate, {
                events,
                tasks
            })
            data.push(formatted)
            currentDate = currentDate.add(1, 'day')
        }
        setWeek(data)
    }

    const formatDateObject = (date: Dayjs, data: IWeekData): IFormatedDate => {
        const formatedObj: IFormatedDate = {
            date: date,
            tasks: data.tasks.filter((task) => dayjs(task.deadline).isSame(date, 'day')),
            events: data.events.filter((event) => dayjs(event.start).isSame(date, 'day'))
        }
        return formatedObj
    }

    if (!render) return <LoadingPage />

    return (
        <div className={classes.wrapper}>
            <div className={classes.weekDates}>
                {weekDays.map((day) => (
                    <div className={classes.weekDate} key={day.name}>
                        <Text size={showBottomBar ? 'xs' : 'sm'} transform="uppercase">
                            {day.name}
                        </Text>
                        <Text size={showBottomBar ? 'md' : 'xl'} weight="bold">
                            {day.date.date()}
                        </Text>
                    </div>
                ))}
            </div>

            <div className={classes.weekWrapper} ref={wrapperEl}>
                <div className={classes.hoursWrapper}>
                    {hours.map((_, hour) => (
                        <Text
                            className={classes.timeBox}
                            size={showBottomBar ? 'sm' : 'md'}
                            key={hour}
                        >
                            {hour}:00
                        </Text>
                    ))}
                </div>

                <div className={classes.week}>
                    {week.map((row, i) => (
                        <DashboardCalendarWeekViewTimeline
                            {...row}
                            hours={hours}
                            col={i}
                            key={row.date.date()}
                            needlePos={needlePos}
                        />
                    ))}
                </div>
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
            display: 'grid',
            gridTemplateRows: '75px 1fr',
            height: 'calc(100vh - 60px)',

            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                gridTemplateRows: '50px 1fr',
                height: 'calc(100vh - 140px)'
            }
        },
        weekDates: {
            top: 60,
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: '75px',
            backgroundColor: colors.dark[7],
            borderBottom: '1px solid',
            borderColor: colors.dark[5],
            zIndex: 1,

            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                paddingLeft: '50px'
            }
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
            overflowY: 'auto',
            scrollbarWidth: 'thin',

            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                gridTemplateColumns: '50px 1fr'
            }
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
        week: {
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)'
        }
    }
})
