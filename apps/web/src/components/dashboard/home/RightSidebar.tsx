import { Task } from '../../../config/types'

import { Box, Center, createStyles, Text, useMantineTheme } from '@mantine/core'
import { TrashSimple } from 'phosphor-react'

import dayjs from 'dayjs'
import { errorHandler, trpc } from '../../../utils'
import { openConfirmModal } from '@mantine/modals'

interface Props {
    tasks: Task[]
}

const DashboardHomeRightSidebar: React.FC<Props> = ({ tasks }) => {
    const theme = useMantineTheme()
    const { classes } = useStyles()

    const tu = trpc.useContext()
    const deleteTaskMutation = trpc.tasks.delete.useMutation()

    const now = dayjs()

    const handleDeleteTask = (task: Task) => {
        openConfirmModal({
            title: `Are you sure you want to delete "${task.title}"`,
            labels: { cancel: 'No', confirm: 'Yes' },
            cancelProps: { variant: 'outline' },
            onConfirm: () => {
                deleteTaskMutation.mutate(
                    {
                        taskId: task.id
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
        })
    }

    return (
        <div className={classes.sidebar}>
            <Text size="xl" weight="bold" align="center" mt="md">
                Upcoming tasks
            </Text>

            <Box p="md">
                {tasks.map((task) => {
                    const deadlineDate = dayjs(task.deadline).date()

                    if (deadlineDate !== now.date() && deadlineDate <= now.date() + 2)
                        return (
                            <div className={classes.taskBox} key={task.id}>
                                <Center>
                                    <Text size="lg" weight="bold">
                                        {dayjs(task.deadline).format('HH:mm')}
                                    </Text>
                                </Center>

                                <Box
                                    className={classes.divider}
                                    sx={{ backgroundColor: theme.colors[task.color][5] }}
                                />

                                <Center sx={{ alignItems: 'flex-start', flexDirection: 'column' }}>
                                    <Text lineClamp={1}>{task.title}</Text>
                                    <Text lineClamp={1}>
                                        {dayjs(task.deadline).format('DD.MM.YYYY')}
                                    </Text>
                                </Center>

                                <Box
                                    sx={{ marginLeft: 'auto', cursor: 'pointer' }}
                                    onClick={() => handleDeleteTask(task)}
                                >
                                    <TrashSimple size={22} />
                                </Box>
                            </div>
                        )
                })}
            </Box>
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
        },
        taskBox: {
            display: 'flex',
            alignItems: 'center',
            height: '60px',
            marginBottom: theme.spacing.md
        },
        divider: {
            height: '100%',
            width: '6px',
            marginLeft: theme.spacing.sm,
            marginRight: theme.spacing.sm,
            borderRadius: theme.radius.xl
        }
    }
})
