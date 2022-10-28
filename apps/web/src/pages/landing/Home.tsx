import state from '../../state'
import { useHookstate } from '@hookstate/core'

import { useNavigate } from 'react-router-dom'

import { Button, Center, createStyles, Group, Text, Title } from '@mantine/core'
import { ArrowRight } from 'phosphor-react'

const HomePage: React.FC = () => {
    const { classes } = useStyles()

    const navigate = useNavigate()

    const { value: user } = useHookstate(state.auth.user)

    return (
        <>
            <Center sx={{ flexDirection: 'column', height: '350px' }}>
                <Title align="center" className={classes.title}>
                    A time-management and scheduling service
                </Title>

                <Group mt="xl">
                    {user ? (
                        <Button size="md" onClick={() => navigate('/dashboard')}>
                            Dashboard
                            <ArrowRight size={24} weight="fill" style={{ marginLeft: '5px' }} />
                        </Button>
                    ) : (
                        <>
                            <Button size="md" variant="outline" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                            <Button size="md" onClick={() => navigate('/signup')}>
                                Signup
                            </Button>
                        </>
                    )}
                </Group>
            </Center>
        </>
    )
}

export default HomePage

const useStyles = createStyles((theme) => {
    const breakpoints = theme.breakpoints

    return {
        title: {
            fontSize: '3rem',

            [`@media (max-width: ${breakpoints.xs}px)`]: {
                fontSize: '1.75rem'
            }
        }
    }
})
