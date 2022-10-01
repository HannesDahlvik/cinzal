import { createStyles, Loader } from '@mantine/core'

const LoadingPage: React.FC = () => {
    const { classes } = useStyles()

    return (
        <div className={classes.wrapper}>
            <Loader size="xl" />
        </div>
    )
}

export default LoadingPage

const useStyles = createStyles(() => {
    return {
        wrapper: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh'
        }
    }
})
