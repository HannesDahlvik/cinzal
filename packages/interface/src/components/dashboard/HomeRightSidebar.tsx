import { createStyles } from '@mantine/core'

const DashboardHomeRightSidebar: React.FC = () => {
    const { classes } = useStyles()

    return (
        <div className={classes.sidebar}>
            <></>
        </div>
    )
}

export default DashboardHomeRightSidebar

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors

    return {
        sidebar: {
            borderLeft: '1px solid',
            borderLeftColor: isDark ? colors.dark[6] : colors.gray[4]
        }
    }
})
