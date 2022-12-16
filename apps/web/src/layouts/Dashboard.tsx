import { Suspense, useEffect } from 'react'
import { CalendarViews } from '../config/types'

import { useHookstate } from '@hookstate/core'
import state from '../state'

import { Outlet } from 'react-router-dom'

import { createStyles } from '@mantine/core'

import LoadingPage from '../pages/Loading'
import DashboardSidebar from '../components/dashboard/Sidebar'

const DashboardLayout: React.FC = () => {
    const { classes } = useStyles()

    const { value: user } = useHookstate(state.auth.user)
    const { set: setCalenderView } = useHookstate(state.calendarView)
    const { set: setHasRedirected } = useHookstate(state.hasRedirectedDashboard)

    useEffect(() => {
        setCalenderView(user?.calendarView as CalendarViews)
        setHasRedirected(true)
    }, [user])

    return (
        <div className={classes.wrapper}>
            <DashboardSidebar />

            <div className={classes.innerWrapper}>
                <Suspense fallback={<LoadingPage />}>
                    <Outlet />
                </Suspense>
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
            gridTemplateColumns: '100px 1fr',
            minHeight: '100vh',
            backgroundColor: isDark ? colors.dark[7] : colors.gray[1]
        },
        innerWrapper: {
            height: '100%'
        }
    }
})
