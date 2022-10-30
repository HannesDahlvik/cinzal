import { showNotification } from '@mantine/notifications'

export const errorHandler = (msg: string) => {
    showNotification({
        title: 'Error',
        message: msg,
        color: 'red'
    })
}
