import { useEffect, useState } from 'react'
import { IEvent, Task } from '~/config/types'

import TabScreenWrapper from '../../navigation/TabScreenWrapper'
import { TabStackScreenProps } from '~/navigation/TabNavigator'

import LoadingScreen from '../Loading'
import DashboardHomeTimeline from '../../dashboard/home/Timeline'

import dayjs from 'dayjs'
import { trpc } from '../../utils'

const DashboardHomeScreen: React.FC<TabStackScreenProps<'DashboardHome'>> = () => {
    const hours = Array.from<number>({ length: 24 }).fill(0)

    const calendarLinks = trpc.calendar.links.useQuery()
    const eventsQuery = trpc.events.all.useQuery(
        { calendarUrls: calendarLinks.data },
        { enabled: !!calendarLinks.isSuccess }
    )
    const tasksQuery = trpc.tasks.get.useQuery()

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

    if (calendarLinks.isLoading || eventsQuery.isLoading || tasksQuery.isLoading)
        return <LoadingScreen />

    if (needlePos)
        return (
            <TabScreenWrapper>
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
