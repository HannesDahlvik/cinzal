import { createStyles } from '@mantine/core'

import DashboardHomeLeftSidebar from '../../components/dashboard/home/LeftSidebar'
import DashboardHomeTimeline from '../../components/dashboard/home/Timeline'
import DashboardHomeRightSidebar from '../../components/dashboard/home/RightSidebar'

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
