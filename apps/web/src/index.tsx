import React from 'react'
import ReactDOM from 'react-dom/client'

import Providers from './Providers'
import App from './App'

import dayjs from 'dayjs'
import en from 'dayjs/locale/en'
import localeData from 'dayjs/plugin/localeData'
import weekdayPlugin from 'dayjs/plugin/weekday'
import isTodayPlugin from 'dayjs/plugin/isToday'

dayjs.locale({
    ...en,
    weekStart: 1,
    weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
})
dayjs.extend(localeData)
dayjs.extend(weekdayPlugin)
dayjs.extend(isTodayPlugin)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Providers>
        <App />
    </Providers>
)
