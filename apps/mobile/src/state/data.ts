import { hookstate } from '@hookstate/core'

import { Calendar, IEvent, Task } from '../config/types'

const data = {
    tasks: hookstate<Task[]>([]),
    events: hookstate<IEvent[]>([]),
    calendars: hookstate<Calendar[]>([])
}

export default data
