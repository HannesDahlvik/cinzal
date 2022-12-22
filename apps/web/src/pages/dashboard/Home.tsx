import { useEffect, useMemo, useState } from 'react'
import { Calendar, IEvent, Task } from '../../config/types'

import { useHookstate } from '@hookstate/core'
import state from '../../state'

import { Drawer, createStyles, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

import LoadingPage from '../Loading'
import ErrorPage from '../Error'

import DashboardHomeLeftSidebar from '../../components/dashboard/home/LeftSidebar'
import DashboardHomeTimeline from '../../components/dashboard/home/Timeline'
import DashboardHomeRightSidebar from '../../components/dashboard/home/RightSidebar'

import { trpc } from '../../utils'
import dayjs from 'dayjs'

const DashboardHomePage: React.FC = () => {
    const theme = useMantineTheme()
    const { classes } = useStyles()

    const { value: rightDrawer, set: setRightDrawer } = useHookstate(state.drawers.homeRightDrawer)
    const { value: leftDrawer, set: setLeftDrawer } = useHookstate(state.drawers.homeLeftDrawer)

    const tasksQuery = trpc.tasks.get.useQuery()
    const calendarLinks = trpc.calendar.links.useQuery()
    const eventsQuery = trpc.events.all.useQuery(
        { calendarUrls: calendarLinks.data as Calendar[] },
        { enabled: !!calendarLinks.isSuccess }
    )

    const showRightDrawer = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`)
    const showLeftDrawer = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`)

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
                {!showLeftDrawer ? (
                    <DashboardHomeLeftSidebar calendars={calendarLinks.data as Calendar[]} />
                ) : (
                    <Drawer
                        size="75%"
                        withCloseButton={false}
                        position="left"
                        opened={leftDrawer}
                        onClose={() => setLeftDrawer(!leftDrawer)}
                    >
                        <DashboardHomeLeftSidebar calendars={calendarLinks.data as Calendar[]} />
                    </Drawer>
                )}

                <DashboardHomeTimeline
                    hours={hours}
                    needlePos={needlePos}
                    tasks={tasksQuery.data}
                    events={eventsQuery.data as IEvent[]}
                />

                {!showRightDrawer ? (
                    <DashboardHomeRightSidebar
                        tasks={tasksQuery.data as Task[]}
                        events={eventsQuery.data as IEvent[]}
                    />
                ) : (
                    <Drawer
                        size={showLeftDrawer ? '75%' : 'md'}
                        withCloseButton={false}
                        position="right"
                        opened={rightDrawer}
                        onClose={() => setRightDrawer(!rightDrawer)}
                    >
                        <DashboardHomeRightSidebar
                            tasks={tasksQuery.data as Task[]}
                            events={eventsQuery.data as IEvent[]}
                        />
                    </Drawer>
                )}
            </div>
        )
    else return <LoadingPage />
}

export default DashboardHomePage

const useStyles = createStyles((theme) => {
    const breakpoints = theme.breakpoints

    return {
        wrapper: {
            display: 'grid',
            gridTemplateColumns: '1fr 1.75fr 1fr',
            height: '100vh',

            [`@media (max-width: ${breakpoints.lg}px)`]: {
                gridTemplateColumns: '1fr 1.75fr'
            },

            [`@media (max-width: ${breakpoints.md}px)`]: {
                gridTemplateColumns: '1fr',
                height: 'calc(100vh - 80px)'
            }
        }
    }
})
