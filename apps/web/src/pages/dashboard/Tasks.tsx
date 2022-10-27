import { Task } from '../../config/types'

import { useHookstate } from '@hookstate/core'
import state from '../../state'

import { Box, Button, Checkbox, createStyles, Text, Title, useMantineTheme } from '@mantine/core'
import { openModal } from '@mantine/modals'

import DashboardCreateTaskModal from '../../components/dashboard/modals/CreateTask'

import dayjs from 'dayjs'
import { errorHandler, trpc } from '../../utils'

const DashboardTasksPage: React.FC = () => {
    const theme = useMantineTheme()
    const { classes } = useStyles()

    const tu = trpc.useContext()
    const taskToggleCompletedMutation = trpc.tasks.toggle.useMutation()

    const { value: tasks } = useHookstate(state.data.tasks)

    const handleCreateTask = () => {
        openModal({
            title: 'Create task',
            children: <DashboardCreateTaskModal />
        })
    }

    const handleToggleCompleted = (task: Task) => {
        taskToggleCompletedMutation.mutate(
            {
                id: task.id,
                completed: task.completed
            },
            {
                onError: (err) => {
                    errorHandler(err.message)
                },
                onSuccess: () => {
                    tu.tasks.get.invalidate()
                }
            }
        )
    }

    return (
        <div className={classes.wrapper}>
            <Title mt="md">All tasks</Title>

            <div className={classes.tasksWrapper}>
                <Button onClick={handleCreateTask}>Create task</Button>

                {tasks.map((task) => (
                    <div className={classes.task} key={task.id}>
                        <Checkbox
                            size="md"
                            checked={task.completed}
                            onChange={() => handleToggleCompleted(task)}
                        />

                        <Box
                            className={classes.taskDivider}
                            sx={{ backgroundColor: theme.colors[task.color][5] }}
                        />

                        <div>
                            <Text lineClamp={1}>{task.title}</Text>
                            <Text>{dayjs(task.deadline).format('DD.MM.YYYY - HH:mm')}</Text>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DashboardTasksPage

const useStyles = createStyles((theme) => {
    const spacing = theme.spacing
    const radius = theme.radius

    return {
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%'
        },
        tasksWrapper: {
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
            width: '300px',
            marginTop: spacing.md
        },
        task: {
            display: 'flex',
            alignItems: 'center',
            height: '60px'
        },
        taskDivider: {
            height: '100%',
            width: '4px',
            marginLeft: spacing.md,
            marginRight: spacing.md,
            borderRadius: radius.xl
        }
    }
})
