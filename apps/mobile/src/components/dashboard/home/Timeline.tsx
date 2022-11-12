import { useCallback, useEffect, useRef, useState } from 'react'
import { IEvent, Task } from '~/config/types'

import { RefreshControl, StyleSheet } from 'react-native'

import { useHookstate } from '@hookstate/core'
import state from '../../../state'

import { Box, Flex, ScrollView, Text, View } from 'native-base'

import dayjs from 'dayjs'
import { trpc } from '../../../utils'

interface Props {
    hours: number[]
    needlePos: number
    tasks: Task[]
    events: IEvent[]
}

const DashboardHomeTimeline: React.FC<Props> = ({ hours, needlePos, tasks, events }) => {
    const { value: globalDate } = useHookstate(state.date)

    const tu = trpc.useContext()

    const [refreshing, setRefreshing] = useState(false)
    const scrollRef = useRef<any>()

    useEffect(() => {
        scrollRef.current?.scrollTo({
            y: needlePos - 200,
            animated: true
        })
    }, [])

    const refreshData = useCallback(() => {
        setRefreshing(true)
        tu.tasks.get.invalidate()
        tu.events.all.invalidate().finally(() => setRefreshing(false))
    }, [])

    const checkRenderBox = (boxDate: dayjs.Dayjs) => {
        if (
            boxDate.date() === globalDate.date() &&
            boxDate.month() === globalDate.month() &&
            boxDate.year() === globalDate.year()
        )
            return true
        else return false
    }

    const calcBoxPos = (boxDate: dayjs.Dayjs): number => {
        const hourPos = boxDate.hour() * 100
        const minutePos = 100 / (60 / boxDate.minute())
        const finalPos = hourPos + minutePos
        return finalPos
    }

    const calcEventBoxHeight = (event: IEvent) => {
        const start = dayjs(new Date(event.start))
        const end = dayjs(new Date(event.end))
        const minute = end.diff(start, 'minute')
        return (minute / 60) * 100
    }

    return (
        <ScrollView
            ref={scrollRef}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} />}
        >
            <View
                position="absolute"
                top={0}
                right={1}
                display="flex"
                flexDirection="column"
                width="83%"
                height="100%"
            >
                {events.map((event, i) => {
                    if (checkRenderBox(dayjs(event.start))) {
                        const topPos = calcBoxPos(dayjs(event.start))
                        const height = calcEventBoxHeight(event)

                        return (
                            <Box
                                position="absolute"
                                top={topPos}
                                width="100%"
                                height={height}
                                minHeight="60px"
                                p="0 3px"
                                zIndex={99}
                                key={i}
                            >
                                <Flex
                                    height="100%"
                                    borderRadius="sm"
                                    backgroundColor="blue.700"
                                    color="white"
                                    padding="2px"
                                >
                                    <Text fontWeight="bold" numberOfLines={1}>
                                        {dayjs(event.start).format('HH:mm')}{' '}
                                        {event.summary || event.title}
                                    </Text>
                                    <Text numberOfLines={1}>{event.location}</Text>
                                </Flex>
                            </Box>
                        )
                    } else return null
                })}

                {tasks.map((task, i) => {
                    if (checkRenderBox(dayjs(task.deadline))) {
                        const topPos = calcBoxPos(dayjs(task.deadline))

                        return (
                            <Box
                                position="absolute"
                                top={topPos}
                                width="100%"
                                height="30px"
                                p="0 3px"
                                key={i}
                            >
                                <Flex
                                    flexDir="row"
                                    height="100%"
                                    borderRadius="sm"
                                    backgroundColor="blue.700"
                                    color="white"
                                    padding="2px"
                                >
                                    <Text mr="2" fontWeight="bold">
                                        {dayjs(task.deadline).format('HH:mm')}
                                    </Text>
                                    <Text numberOfLines={1} fontWeight="bold">
                                        {task.title}
                                    </Text>
                                </Flex>
                            </Box>
                        )
                    } else return null
                })}
            </View>
            {hours.map((_, hour) => (
                <View style={styles.hourBox} key={hour}>
                    <Box p="1" borderWidth={1} borderColor="dark.500" width="15%">
                        <Text>{hour < 10 ? '0' + hour : hour}:00</Text>
                    </Box>

                    <Box p="1" borderWidth={1} borderColor="dark.500" width="100%" />
                </View>
            ))}

            <Box
                position="absolute"
                top={needlePos}
                width="100%"
                height="1px"
                backgroundColor="red.600"
            />
        </ScrollView>
    )
}

export default DashboardHomeTimeline

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flexDirection: 'column'
    },
    hourBox: {
        display: 'flex',
        flexDirection: 'row',
        height: 100
    }
})
