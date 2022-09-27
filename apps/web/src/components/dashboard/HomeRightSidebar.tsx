import { useHookstate } from '@hookstate/core'
import state from '../../state'

import { createStyles, Title } from '@mantine/core'

const DashboardHomeRightSidebar: React.FC = () => {
    const { classes } = useStyles()

    const { value: selectedTask } = useHookstate(state.selectedTask)

    return (
        <div className={classes.sidebar}>
            {!selectedTask && (
                <Title align="center" mt="md">
                    Select a task
                </Title>
            )}

            {selectedTask && (
                <>
                    <Title>{selectedTask.title}</Title>
                </>
            )}
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
