import { hookstate } from '@hookstate/core'

import data from './data'
import auth from './auth'

import dayjs from 'dayjs'

const state = {
    data,
    auth,
    date: hookstate(dayjs())
}

export default state
