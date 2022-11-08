import { hookstate } from '@hookstate/core'

import ical from 'node-ical'

import { Calendar, Event, Task } from '../config/types'

export type IEvent = ical.VEvent & Event

const data = {
    tasks: hookstate<Task[]>([]),
    events: hookstate<IEvent[]>([]),
    calendars: hookstate<Calendar[]>([])
}

export default data
