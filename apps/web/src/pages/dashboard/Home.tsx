import { useEffect, useMemo, useState } from 'react'
import { Calendar, IEvent, Task } from '../../config/types'

import { createStyles } from '@mantine/core'

import LoadingPage from '../Loading'
import ErrorPage from '../Error'

import DashboardHomeLeftSidebar from '../../components/dashboard/home/LeftSidebar'
import DashboardHomeTimeline from '../../components/dashboard/home/Timeline'
import DashboardHomeRightSidebar from '../../components/dashboard/home/RightSidebar'

import { trpc } from '../../utils'
import dayjs from 'dayjs'

const DashboardHomePage: React.FC = () => {
    const { classes } = useStyles()

    const tasksQuery = trpc.tasks.get.useQuery()
    const calendarLinks = trpc.calendar.links.useQuery()
    const eventsQuery = trpc.events.all.useQuery(
        { calendarUrls: calendarLinks.data as Calendar[] },
        { enabled: !!calendarLinks.isSuccess }
    )

    const [needlePos, setNeedlePos] = useState(0)
    const [render, setRender] = useState(false)
    const hours = useMemo(() => Array.from<number>({ length: 24 }).fill(0), [])

    useEffect(() => {
        calcNeedlePos()
        const interval = setInterval(() => calcNeedlePos(), 1000)
        setRender(true)
        return () => clearInterval(interval)
    }, [])

    const calcNeedlePos = () => {
        const time = dayjs()
        const hour = time.hour()
        const minute = time.minute()

        const hourPos = hour * 100
        const minutePos = 100 / (60 / minute)
        const finalPos = hourPos + minutePos

        setNeedlePos(finalPos)
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

    if (render)
        return (
            <div className={classes.wrapper}>
                <DashboardHomeLeftSidebar calendars={calendarLinks.data as Calendar[]} />

                <DashboardHomeTimeline
                    hours={hours}
                    needlePos={needlePos}
                    tasks={tasksQuery.data}
                    events={eventsQuery.data as IEvent[]}
                />

                <DashboardHomeRightSidebar tasks={tasksQuery.data as Task[]} />
            </div>
        )
    else return <LoadingPage />
}

export default DashboardHomePage

const useStyles = createStyles(() => {
    return {
        wrapper: {
            display: 'grid',
            gridTemplateColumns: '1fr 1.75fr 1fr',
            height: '100vh'
        }
    }
})
