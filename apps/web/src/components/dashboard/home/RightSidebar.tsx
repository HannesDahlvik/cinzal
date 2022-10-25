import { useHookstate } from '@hookstate/core'
import state from '../../../state'

import { Box, Center, createStyles, Text, useMantineTheme } from '@mantine/core'

import dayjs from 'dayjs'

const DashboardHomeRightSidebar: React.FC = () => {
    const theme = useMantineTheme()
    const { classes } = useStyles()

    const now = dayjs()
    const { value: tasks } = useHookstate(state.data.tasks)

    return (
        <div className={classes.sidebar}>
            <Text size="xl" weight="bold" align="center" mt="md">
                Upcoming tasks
            </Text>

            <Box p="md">
                {tasks.map((task) => {
                    const date = dayjs(task.deadline).date()

                    if (date !== now.date() && date <= now.date() + 2)
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
