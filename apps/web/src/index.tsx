import React from 'react'
import ReactDOM from 'react-dom/client'

import Providers from './Providers'
import App from './App'

import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import en from 'dayjs/locale/en'

dayjs.locale({
    ...en
})
dayjs.extend(localeData)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Providers>
        <App />
    </Providers>
)
