import { useRouteError } from 'react-router-dom'

import { Button, Center, Code, createStyles, Group, Title } from '@mantine/core'

interface Props {
    error?: string
}

const ErrorPage: React.FC<Props> = ({ error }) => {
    console.log(error)

    const { classes } = useStyles()

    const routerError: any = useRouteError()

    return (
        <Center className={classes.center}>
            <Title>APP CRASHED</Title>

            <Code mt="sm" className={classes.code}>
                Error: {error || routerError.statusText || routerError.message}
            </Code>

            <Group mt="md">
                <Button onClick={() => location.reload()}>Reload</Button>
            </Group>
        </Center>
    )
}

export default ErrorPage

const useStyles = createStyles((theme) => {
    return {
        center: {
            flexDirection: 'column',
            height: '100vh'
        },
        code: {
            fontSize: theme.fontSizes.md,
            maxWidth: '600px'
        }
    }
})
