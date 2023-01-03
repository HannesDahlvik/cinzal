import { useEffect, useState } from 'react'
import { Calendar, IEvent, Task } from '~/config/types'

import TabScreenWrapper from '../../navigation/TabScreenWrapper'
import { TabStackScreenProps } from '~/navigation/TabNavigator'

import ErrorScreen from '../Error'
import LoadingScreen from '../Loading'
import DashboardHomeDayChanger from '../../components/dashboard/home/DayChanger'
import DashboardHomeTimeline from '../../components/dashboard/home/Timeline'

import dayjs from 'dayjs'
import { trpc } from '../../utils'

const DashboardHomeScreen: React.FC<TabStackScreenProps<'DashboardHome'>> = () => {
    const hours = Array.from<number>({ length: 24 }).fill(0)

    const tasksQuery = trpc.tasks.get.useQuery()
    const calendarLinks = trpc.calendar.links.useQuery()
    const eventsQuery = trpc.events.all.useQuery(
        { calendarUrls: calendarLinks.data as Calendar[] },
        { enabled: !!calendarLinks.isSuccess }
    )

    const [needlePos, setNeedlePos] = useState(0)

    useEffect(() => {
        calcNeedlePos()
        const interval = setInterval(() => calcNeedlePos(), 1000)
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
            <TabScreenWrapper>
                <ErrorScreen
                    error={
                        tasksQuery.error?.message ||
                        calendarLinks.error?.message ||
                        eventsQuery.error?.message
                    }
                />
            </TabScreenWrapper>
        )

    if (calendarLinks.isLoading || eventsQuery.isLoading || tasksQuery.isLoading)
        return <LoadingScreen />

    if (needlePos)
        return (
            <TabScreenWrapper>
                <DashboardHomeDayChanger />

                <DashboardHomeTimeline
                    hours={hours}
                    needlePos={needlePos}
                    tasks={tasksQuery.data as unknown as Task[]}
                    events={eventsQuery.data as unknown as IEvent[]}
                />
            </TabScreenWrapper>
        )
    else return <LoadingScreen />
}

export default DashboardHomeScreen
