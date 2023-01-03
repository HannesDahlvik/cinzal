import { useToast } from 'native-base'

export const useErrorHandler = () => {
    const toast = useToast()
    const showError = (msg: string) => {
        toast.show({
            title: msg,
            placement: 'top'
        })
    }
    return showError
}
