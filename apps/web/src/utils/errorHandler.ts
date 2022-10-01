import { showNotification } from '@mantine/notifications'

const errorHandler = (msg: string) => {
    showNotification({
        title: 'Error',
        message: msg,
        color: 'red'
    })
}

export default errorHandler
