import { hookstate } from '@hookstate/core'
import { CalendarViews } from '../config/types'

import auth from './auth'

import dayjs from 'dayjs'

const state = {
    auth,
    date: hookstate(dayjs()),
    calendarView: hookstate<CalendarViews>('month'),
    hasRedirectedDashboard: hookstate(false)
}

export default state
