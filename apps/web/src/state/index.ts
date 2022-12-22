import { hookstate } from '@hookstate/core'
import { CalendarViews } from '../config/types'

import auth from './auth'
import drawers from './drawers'

import dayjs from 'dayjs'

const state = {
    auth,
    drawers,
    date: hookstate(dayjs()),
    calendarView: hookstate<CalendarViews>('month'),
    hasRedirectedDashboard: hookstate(false)
}

export default state
