import { Task } from '../config/types'

import { Outlet } from 'react-router-dom'

import state from '../state'
import { useHookstate } from '@hookstate/core'

import { createStyles } from '@mantine/core'

import LoadingPage from '../pages/Loading'
import DashboardSidebar from '../components/dashboard/Sidebar'

import { errorHandler, trpc } from '../utils'
import ErrorPage from '../pages/Error'

const DashboardLayout: React.FC = () => {
    const { classes } = useStyles()

    const { value: user } = useHookstate(state.auth.user)

    const iCalLinksQuery = trpc.calendar.getICalLinks.useQuery(undefined, {
        enabled: !!user
    })
    const calendarsQuery = trpc.calendar.getICalEventsFromUrls.useQuery(
        {
            links: iCalLinksQuery.data ? iCalLinksQuery.data : []
        },
        {
            enabled: !!iCalLinksQuery.data,
            onError: (err) => {
                errorHandler(err.message)
            },
            onSuccess: (data) => {
                state.data.events.merge(data)
            }
        }
    )

    const tasksQuery = trpc.tasks.get.useQuery(
        { uuid: user?.uuid as string },
        {
            enabled: !!user,
            onError: (err) => {
                errorHandler(err.message)
            },
            onSuccess: (data) => {
                state.data.tasks.set(data as unknown as Task[])
            }
        }
    )

    if (tasksQuery.error || iCalLinksQuery.error || calendarsQuery.error)
        return (
            <ErrorPage
                error={
                    tasksQuery.error?.message ||
                    iCalLinksQuery.error?.message ||
                    calendarsQuery.error?.message
                }
            />
        )

    if (tasksQuery.isLoading || calendarsQuery.isLoading || iCalLinksQuery.isLoading)
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
