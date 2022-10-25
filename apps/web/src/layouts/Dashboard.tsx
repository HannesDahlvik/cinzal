import { Task } from '../config/types'

import { Outlet } from 'react-router-dom'

import state, { IEvents } from '../state'
import { useHookstate } from '@hookstate/core'

import { createStyles } from '@mantine/core'

import ErrorPage from '../pages/Error'
import LoadingPage from '../pages/Loading'
import DashboardSidebar from '../components/dashboard/Sidebar'

import { trpc } from '../utils'

const DashboardLayout: React.FC = () => {
    const { classes } = useStyles()

    const { value: user } = useHookstate(state.auth.user)

    const calendarLinks = trpc.calendar.links.useQuery(undefined, {
        onSuccess: (data) => {
            state.data.calendars.set(data)
        }
    })
    const eventsQuery = trpc.events.all.useQuery(
        { calendarUrls: calendarLinks.data },
        {
            enabled: !!calendarLinks.isSuccess,
            onSuccess: (data) => {
                state.data.events.set(data as unknown as IEvents[])
            }
        }
    )
    const tasksQuery = trpc.tasks.get.useQuery(undefined, {
        enabled: !!user,
        onSuccess: (data) => {
            state.data.tasks.set(data as unknown as Task[])
        }
    })

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

    if (tasksQuery.isLoading || eventsQuery.isLoading || calendarLinks.isLoading)
        return <LoadingPage />

    return (
        <div className={classes.wrapper}>
            <DashboardSidebar />

            <div className={classes.innerWrapper}>
                <Outlet />
            </div>
        </div>
    )
}

export default DashboardLayout

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors

    return {
        wrapper: {
            display: 'grid',
            gridTemplateColumns: '150px 1fr',
            minHeight: '100vh',
            backgroundColor: isDark ? colors.dark[7] : colors.gray[1]
        },
        innerWrapper: {
            height: '100%'
        }
    }
})
