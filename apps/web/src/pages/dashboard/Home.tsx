import { createStyles } from '@mantine/core'

import DashboardHomeLeftSidebar from '../../components/dashboard/HomeLeftSidebar'
import DashboardHomeTimeline from '../../components/dashboard/HomeTimeline'
import DashboardHomeRightSidebar from '../../components/dashboard/HomeRightSidebar'

const DashboardHomePage: React.FC = () => {
    const { classes } = useStyles()

    return (
        <div className={classes.wrapper}>
            <DashboardHomeLeftSidebar />

            <DashboardHomeTimeline />

            <DashboardHomeRightSidebar />
        </div>
    )
}

export default DashboardHomePage

const useStyles = createStyles((theme) => {
    return {
        wrapper: {
            display: 'grid',
            gridTemplateColumns: '1fr 1.75fr 1fr',
            height: '100vh'
        }
    }
})
