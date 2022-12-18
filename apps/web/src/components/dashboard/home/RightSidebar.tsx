import { Fragment, useEffect, useState } from 'react'
import { IEvent, Task } from '../../../config/types'

import { Box, createStyles, MantineColor, Text } from '@mantine/core'

import DashboardHomeRightSidebarItem from './RightSidebarItem'
import dayjs, { Dayjs } from 'dayjs'

interface Props {
    events: IEvent[]
    tasks: Task[]
}

interface Item {
    title: string
    description: string
    color: MantineColor
    deadline: Dayjs
}

interface Items {
    date: Dayjs
    items: Item[]
}

const DashboardHomeRightSidebar: React.FC<Props> = ({ events, tasks }) => {
    const { classes } = useStyles()

    const [items, setItems] = useState<Items[]>([])
    const [nothingToShow, setNothingToShow] = useState(false)

    const now = dayjs()

    useEffect(() => {
        const itemsArr: Items[] = []
        const itemArr: Item[] = []

        for (let i = 1; i <= 3; i++) {
            itemsArr.push({
                date: now.add(i, 'd'),
                items: []
            })
        }

        events.map((event) => {
            const eventStart = dayjs(event.start)
            if (eventStart.isBetween(now, now.add(3, 'd')))
                itemArr.push({
                    title: event.summary || event.title,
                    description: event.description,
                    color: 'blue',
                    deadline: eventStart
                })
        })
        tasks.map((task) => {
            const taskDeadline = dayjs(task.deadline)
            if (taskDeadline.isBetween(now, now.add(3, 'day')))
                itemArr.push({
                    title: task.title,
                    description: task.description,
                    color: task.color,
                    deadline: taskDeadline
                })
        })

        itemArr.map((item) => {
            const deadline = item.deadline
            if (deadline.isAfter(now) && deadline.isBefore(now.add(1, 'd')))
                itemsArr[0].items.push(item)
            if (deadline.isAfter(now.add(1, 'd')) && deadline.isBefore(now.add(2, 'd')))
                itemsArr[1].items.push(item)
            if (deadline.isAfter(now.add(2, 'd')) && deadline.isBefore(now.add(3, 'd')))
                itemsArr[2].items.push(item)
        })

        const checks = [false, false, false]
        itemsArr.map((item, i) => {
            if (item.items.length === 0) checks[i] = true
            else checks[i] = false
        })
        let counter = 0
        checks.map((row) => (row ? counter++ : counter--))
        if (counter === 3) setNothingToShow(true)
        else setNothingToShow(false)

        setItems(itemsArr)
    }, [events, tasks])

    return (
        <div className={classes.sidebar}>
            <Text size="xl" weight="bold" align="center" mt="md">
                Coming up
            </Text>

            <Box p="md">
                {nothingToShow && (
                    <Text align="center">Nothing coming up in the next three days</Text>
                )}

                {items.map((row, i) => {
                    if (row.items.length > 0)
                        return (
                            <Box key={i}>
                                <Text color="dimmed" mb="md">
                                    {row.date.format('DD MMMM')}
                                </Text>

                                {row.items.map((item, j) => (
                                    <Fragment key={j}>
                                        {j < 3 && (
                                            <DashboardHomeRightSidebarItem
                                                title={item.title}
                                                description={item.description}
                                                color={item.color}
                                                deadline={item.deadline}
                                            />
                                        )}
                                    </Fragment>
                                ))}
                            </Box>
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
            borderLeftColor: isDark ? colors.dark[6] : colors.gray[4],
            height: '100vh'
        }
    }
})
