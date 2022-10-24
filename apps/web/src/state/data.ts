import { hookstate } from '@hookstate/core'

import ical from 'node-ical'

import { Calendar, Event, Task } from '../config/types'

export type IEvents = ical.VEvent & Event

const data = {
    tasks: hookstate<Task[]>([]),
    events: hookstate<IEvents[]>([]),
    calendars: hookstate<Calendar[]>([])
}

export default data
