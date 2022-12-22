import React from 'react'
import ReactDOM from 'react-dom/client'

import Providers from './Providers'
import App from './App'

import dayjs from 'dayjs'
import en from 'dayjs/locale/en'
import isBetween from 'dayjs/plugin/isBetween'
import localeData from 'dayjs/plugin/localeData'
import weekdayPlugin from 'dayjs/plugin/weekday'
import isTodayPlugin from 'dayjs/plugin/isToday'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.locale({
    ...en,
    weekStart: 1
})
dayjs.extend(isBetween)
dayjs.extend(localeData)
dayjs.extend(weekdayPlugin)
dayjs.extend(isTodayPlugin)
dayjs.extend(weekOfYear)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Providers>
        <App />
    </Providers>
)
