import { hookstate } from '@hookstate/core'

import auth from './auth'

import dayjs from 'dayjs'

const state = {
    auth,
    date: hookstate(dayjs())
}

export default state
