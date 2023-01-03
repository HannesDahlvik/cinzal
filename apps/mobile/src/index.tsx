import Providers from './Providers'
import App from './App'

import dayjs from 'dayjs'
import en from 'dayjs/locale/en'
import localeData from 'dayjs/plugin/localeData'
import weekdayPlugin from 'dayjs/plugin/weekday'
import isTodayPlugin from 'dayjs/plugin/isToday'

dayjs.locale({
    ...en,
    weekStart: 1
})
dayjs.extend(localeData)
dayjs.extend(weekdayPlugin)
dayjs.extend(isTodayPlugin)

const Index: React.FC = () => {
    return (
        <Providers>
            <App />
        </Providers>
    )
}

export default Index
