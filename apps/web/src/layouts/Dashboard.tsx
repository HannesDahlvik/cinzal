import { Outlet } from 'react-router-dom'

import { createStyles } from '@mantine/core'

import DashboardSidebar from '../components/dashboard/Sidebar'

const DashboardLayout: React.FC = () => {
    const { classes } = useStyles()

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
            gridTemplateColumns: '300px 1fr',
            minHeight: '100vh',
            backgroundColor: isDark ? colors.dark[7] : colors.gray[2]
        },
        innerWrapper: {
            height: '100%'
        }
    }
})
