import { useState } from 'react'
import { IEvent } from '../../config/types'

import { createStyles, Select } from '@mantine/core'

import ErrorPage from '../Error'
import LoadingPage from '../Loading'

import DashboardDateChanger from '../../components/dashboard/DateChanger'
import DashboardCalendarMonthView from '../../components/dashboard/calendar/MonthView'
import DashboardCalendarWeekView from '../../components/dashboard/calendar/WeekView'

import { trpc } from '../../utils'

type CalendarViews = 'month' | 'week'

const DashboardCalendarPage: React.FC = () => {
    const { classes } = useStyles()

    const tasksQuery = trpc.tasks.get.useQuery()
    const calendarLinks = trpc.calendar.links.useQuery()
    const eventsQuery = trpc.events.all.useQuery(
        { calendarUrls: calendarLinks.data },
        { enabled: !!calendarLinks.isSuccess }
    )

    const [view, setView] = useState<CalendarViews>('month')

    if (tasksQuery.error || calendarLinks.error || eventsQuery.error)
        return (
            <ErrorPage
                error={
                    tasksQuery.error?.message ||
                    calendarLinks.error?.message ||
                    eventsQuery.error?.message
                }
            />
        )

    if (calendarLinks.isLoading || eventsQuery.isLoading || tasksQuery.isLoading)
        return <LoadingPage />

    return (
        <div className={classes.calendar}>
            <div className={classes.topBar}>
                <DashboardDateChanger />

                <Select
                    value={view}
                    onChange={(ev) => setView(ev as CalendarViews)}
                    data={[
                        {
                            label: 'Month',
                            value: 'month'
                        },
                        {
                            label: 'Week',
                            value: 'week'
                        }
                    ]}
                />
            </div>

            <div>
                {view === 'month' ? (
                    <DashboardCalendarMonthView
                        events={eventsQuery.data as IEvent[]}
                        tasks={tasksQuery.data}
                    />
                ) : view === 'week' ? (
                    <DashboardCalendarWeekView
                        events={eventsQuery.data as IEvent[]}
                        tasks={tasksQuery.data}
                    />
                ) : null}
            </div>
        </div>
    )
}

export default DashboardCalendarPage

const useStyles = createStyles((theme) => {
    const spacing = theme.spacing

    return {
        calendar: {
            display: 'grid',
            gridTemplateRows: '60px 1fr',
            height: '100%'
        },
        topBar: {
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            padding: spacing.md
        }
    }
})
