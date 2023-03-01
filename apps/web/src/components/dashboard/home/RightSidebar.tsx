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
        const itemsArr: Item[] = []
        const items: Items[] = []

        const tomorrow = dayjs().add(1, 'd').set('h', 0).set('m', 0).set('s', 0)
        const threeDaysFromToday = dayjs().add(3, 'd').set('h', 23).set('m', 59).set('s', 59)

        events.map((event) => {
            const eventStart = dayjs(event.start)
            if (eventStart.isBetween(tomorrow, threeDaysFromToday)) {
                itemsArr.push({
                    title: event.summary || event.title,
                    description: event.description,
                    color: 'blue',
                    deadline: eventStart
                })
            }
        })
        tasks.map((task) => {
            const taskDeadline = dayjs(task.deadline)
            if (taskDeadline.isBetween(tomorrow, threeDaysFromToday))
                itemsArr.push({
                    title: task.title,
                    description: task.description,
                    color: task.color,
                    deadline: taskDeadline
                })
        })

        for (let i = 1; i <= 3; i++) {
            items.push({
                date: now.add(i, 'd'),
                items: []
            })
        }

        itemsArr.map((item) => {
            const deadline = item.deadline
            const beforeChecker = now.add(1, 'd').set('h', 23).set('m', 59).set('s', 59)
            if (deadline.isAfter(tomorrow) && deadline.isBefore(beforeChecker))
                items[0].items.push(item)
            if (
                deadline.isAfter(tomorrow.add(1, 'd')) &&
                deadline.isBefore(beforeChecker.add(1, 'd'))
            )
                items[1].items.push(item)
            if (
                deadline.isAfter(tomorrow.add(2, 'd')) &&
                deadline.isBefore(beforeChecker.add(2, 'd'))
            )
                items[2].items.push(item)
        })

        const checks = [false, false, false]
        let counter = 0
        items.map((item, i) => (item.items.length === 0 ? (checks[i] = true) : (checks[i] = false)))
        checks.map((row) => (row ? counter++ : counter--))
        if (counter === 3) setNothingToShow(true)
        else setNothingToShow(false)

        setItems(items)
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
