import { hookstate } from '@hookstate/core'

import ical from 'node-ical'

import { Task } from '../config/types'

const data = {
    tasks: hookstate<Task[]>([]),
    events: hookstate<ical.VEvent[]>([]),
    calendars: hookstate<any[]>([])
}

export default data
