import { hookstate } from '@hookstate/core'

import { Task } from '../config/types'

const data = {
    tasks: hookstate<Task[]>([]),
    events: hookstate<any[]>([]),
    calendars: hookstate<any[]>([])
}

export default data
