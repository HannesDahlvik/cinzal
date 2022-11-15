import { useCallback, useRef, useState } from 'react'
import { Task } from '~/config/types'

import { Box, Button, Checkbox, Flex, Heading, ScrollView, Text } from 'native-base'
import { TrashSimple } from 'phosphor-react-native'
import { RefreshControl } from 'react-native'

import TabScreenWrapper from '../../navigation/TabScreenWrapper'
import { TabStackScreenProps } from '~/navigation/TabNavigator'
import LoadingScreen from '../Loading'

import dayjs from 'dayjs'
import { trpc, useErrorHandler } from '../../utils'

const DashboardTasksScreen: React.FC<TabStackScreenProps<'DashboardTasks'>> = () => {
    const errorHandler = useErrorHandler()

    const tu = trpc.useContext()
    const { data: tasks, isLoading } = trpc.tasks.get.useQuery()
    const taskToggleCompletedMutation = trpc.tasks.toggle.useMutation()
    const taskDeleteMutation = trpc.tasks.delete.useMutation()

    const [refreshing, setRefreshing] = useState(false)
    const scrollRef = useRef<any>()

    const refreshData = useCallback(() => {
        setRefreshing(true)
        tu.tasks.get.invalidate().finally(() => setRefreshing(false))
    }, [])

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

    const handleDeleteTask = (task: Task) => {
        taskDeleteMutation.mutate(
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

    if (isLoading) return <LoadingScreen />

    return (
        <TabScreenWrapper>
            <Heading mt="4" mb="4" textAlign="center">
                Tasks
            </Heading>

            {tasks?.length === 0 && (
                <Text textAlign="center" fontSize="lg">
                    You have 0 tasks
                </Text>
            )}
            <ScrollView
                height="100%"
                ref={scrollRef}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} />}
            >
                {tasks?.map((task, i) => (
                    <Flex flexDir="row" alignItems="center" position="relative" key={i}>
                        <Checkbox
                            isChecked={task.completed}
                            value="completed"
                            ml="4"
                            accessibilityLabel="completed"
                            onChange={() => handleToggleCompleted(task)}
                        />

                        <Box
                            mx="3"
                            backgroundColor="blue.500"
                            borderRadius="full"
                            width={1}
                            height="100%"
                        />

                        <Flex>
                            <Heading numberOfLines={1}>{task.title}</Heading>
                            <Text>{dayjs(task.deadline).format('DD.MM.YYYY - hh:mm')}</Text>
                        </Flex>

                        <Button
                            variant="ghost"
                            ml="auto"
                            mr="4"
                            onPress={() => handleDeleteTask(task)}
                        >
                            <TrashSimple />
                        </Button>
                    </Flex>
                ))}
            </ScrollView>
        </TabScreenWrapper>
    )
}

export default DashboardTasksScreen
