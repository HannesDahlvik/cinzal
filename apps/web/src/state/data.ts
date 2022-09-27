import { hookstate } from '@hookstate/core'

import { Task } from '../config/types'

const data = {
    tasks: hookstate<Task[]>([])
}

export default data
