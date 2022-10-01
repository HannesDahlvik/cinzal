import { Task } from '../config/types'

import { Outlet } from 'react-router-dom'

import state from '../state'
import { useHookstate } from '@hookstate/core'

import { createStyles } from '@mantine/core'

import LoadingPage from '../pages/Loading'
import DashboardSidebar from '../components/dashboard/Sidebar'

import { errorHandler, trpc } from '../utils'

const DashboardLayout: React.FC = () => {
    const { classes } = useStyles()

    const { value: user } = useHookstate(state.auth.user)

    const { isLoading } = trpc.tasks.get.useQuery(
        { uuid: user?.uuid as string },
        {
            onError: (err) => errorHandler(err.message),
            onSuccess: (data) => {
                state.data.tasks.set(data as unknown as Task[])
            }
        }
    )

    if (isLoading) return <LoadingPage />

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
            backgroundColor: isDark ? colors.dark[7] : colors.gray[2]
        },
        innerWrapper: {
            height: '100%'
        }
    }
})
