import { Task } from '../../../config/types'

import { Box, createStyles, Text, useMantineTheme } from '@mantine/core'
import { openModal } from '@mantine/modals'

import DashboardEditTaskModal from '../modals/EditTask'

interface Props {
    tasks: Task[]
}

const DashboardCalendarDayTasks: React.FC<Props> = (props) => {
    const theme = useMantineTheme()
    const { classes } = useStyles()

    const handleEditTask = (task: Task) => {
        openModal({
            title: `Edit ${task.title}`,
            children: <DashboardEditTaskModal task={task} />
        })
    }

    return (
        <div className={classes.dayTasks}>
            {props.tasks.map((task) => (
                <Box
                    sx={{
                        backgroundColor: theme.colors[task.color][7]
                    }}
                    className={classes.dayTask}
                    onClick={() => handleEditTask(task)}
                    key={task.id}
                >
                    <Text size="sm">{task.title}</Text>
                </Box>
            ))}
        </div>
    )
}

export default DashboardCalendarDayTasks

const useStyles = createStyles((theme) => {
    return {
        dayTasks: {
            width: '100%',
            height: '100%'
        },
        dayTask: {
            borderRadius: theme.radius.sm,
            cursor: 'pointer',
            marginBottom: '2px'
        }
    }
})
