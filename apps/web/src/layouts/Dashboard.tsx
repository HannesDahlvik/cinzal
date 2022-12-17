import { Suspense, useEffect } from 'react'
import { CalendarViews } from '../config/types'

import { useHookstate } from '@hookstate/core'
import state from '../state'

import { Outlet } from 'react-router-dom'

import { createStyles, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

import LoadingPage from '../pages/Loading'
import DashboardSidebar from '../components/dashboard/Sidebar'
import DashboardBottomBar from '../components/dashboard/BottomBar'

const DashboardLayout: React.FC = () => {
    const theme = useMantineTheme()
    const { classes } = useStyles()

    const { value: user } = useHookstate(state.auth.user)
    const { set: setCalenderView } = useHookstate(state.calendarView)
    const { set: setHasRedirected } = useHookstate(state.hasRedirectedDashboard)

    const showBottomBar = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`)

    useEffect(() => {
        setCalenderView(user?.calendarView as CalendarViews)
        setHasRedirected(true)
    }, [user])

    return (
        <div className={classes.wrapper}>
            {!showBottomBar && <DashboardSidebar />}

            <div className={classes.innerWrapper}>
                <Suspense fallback={<LoadingPage />}>
                    <Outlet />
                </Suspense>
            </div>

            {showBottomBar && <DashboardBottomBar />}
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
            backgroundColor: isDark ? colors.dark[7] : colors.gray[1],

            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                gridTemplateColumns: '1fr',
                gridTemplateRows: '1fr 80px'
            }
        },
        innerWrapper: {
            height: '100%',

            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                height: 'calc(100vh - 80px)'
            }
        }
    }
})
