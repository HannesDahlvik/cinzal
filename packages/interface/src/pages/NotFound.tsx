import { useLocation, useNavigate } from 'react-router-dom'

import { Button, Center, Code, Container, Divider, Text, Title, createStyles } from '@mantine/core'

const NotFoundPage: React.FC = () => {
    const { classes } = useStyles()
    const navigate = useNavigate()
    const location = useLocation()

    const handleNavigate = () => {
        if (location.pathname.includes('dashboard')) navigate('/dashboard')
        else navigate('/')
    }

    return (
        <Center className={classes.wrapper}>
            <Container size="md" className={classes.container}>
                <Title className={classes.title}>404</Title>

                <Text className={classes.text}>
                    No match for <Code className={classes.code}>{location.pathname}</Code>
                </Text>

                <Divider />

                <Button size="lg" className={classes.button} onClick={handleNavigate}>
                    HOME
                </Button>
            </Container>
        </Center>
    )
}

export default NotFoundPage

const useStyles = createStyles((theme) => {
    const isDark = theme.colorScheme === 'dark'
    const colors = theme.colors

    return {
        wrapper: {
            height: '100vh'
        },
        container: {
            textAlign: 'center'
        },
        title: {
            fontSize: '5rem'
        },
        text: {
            marginBottom: '8px',
            fontSize: '2rem'
        },
        code: {
            fontSize: '2rem',
            backgroundColor: isDark ? colors.dark[5] : colors.gray[4]
        },
        button: {
            marginTop: '12px'
        }
    }
})
