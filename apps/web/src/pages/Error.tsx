import { useRouteError } from 'react-router-dom'

import { Button, Center, Code, createStyles, Group, Title } from '@mantine/core'

const ErrorPage: React.FC = () => {
    const { classes } = useStyles()

    const error: any = useRouteError()
    console.error(error)

    return (
        <Center className={classes.center}>
            <Title>APP CRASHED</Title>

            <Code mt="sm" className={classes.code}>
                Error: {error.statusText || error.message}
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
            fontSize: theme.fontSizes.md
        }
    }
})
