import { hookstate } from '@hookstate/core'
import { Task } from '../config/types'

import data from './data'
import auth from './auth'

import dayjs from 'dayjs'

const state = {
    data,
    auth,
    date: hookstate(dayjs()),
    selectedTask: hookstate<Task | null>(null)
}

export default state
