import state from '../../state'
import { useHookstate } from '@hookstate/core'

import { useNavigate } from 'react-router-dom'

import { Button, Center, createStyles, Group, Image, Title, useMantineTheme } from '@mantine/core'
import { ArrowRight } from 'phosphor-react'

import dashboardHome from '../../assets/imgs/dashboard-home.jpg'

const HomePage: React.FC = () => {
    const theme = useMantineTheme()
    const { classes } = useStyles()

    const navigate = useNavigate()

    const { value: user } = useHookstate(state.auth.user)

    return (
        <>
            <Center sx={{ flexDirection: 'column', height: '400px' }}>
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
                            <Button size="md" onClick={() => navigate('/signup')}>
                                Get started
                            </Button>
                        </>
                    )}
                </Group>
            </Center>

            <Center className={classes.dashboardHomeWrapper}>
                <div className={classes.dashboardHome}>
                    <div className={classes.bloomWrapper} />

                    <Image
                        styles={{
                            image: {
                                border: `1px solid ${theme.colors.dark[5]}`
                            }
                        }}
                        src={dashboardHome}
                        radius="lg"
                        withPlaceholder
                    />
                </div>

                <Button size="md" mt="xl" onClick={() => navigate('/signup')}>
                    Get started
                </Button>
            </Center>
        </>
    )
}

export default HomePage

const useStyles = createStyles((theme) => {
    const breakpoints = theme.breakpoints

    return {
        title: {
            fontSize: '3.5rem',

            [`@media (max-width: ${breakpoints.xs}px)`]: {
                fontSize: '1.75rem'
            }
        },
        dashboardHomeWrapper: {
            flexDirection: 'column',
            position: 'relative',
            paddingTop: '200px',
            paddingBottom: '200px',

            [`@media (max-width: ${breakpoints.sm}px)`]: {
                paddingTop: '75px',
                paddingBottom: '75px'
            }
        },
        dashboardHome: {
            transform: '',
            position: 'relative',
            width: '1200px',

            [`@media (max-width: ${breakpoints.xl}px)`]: {
                width: '90%'
            }
        },
        bloomWrapper: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
                'conic-gradient(from 90deg at 50% 50%, rgba(77, 171, 247, 0.3) 0%, rgba(255, 255, 255, 0.15) 26%, rgba(132, 94, 247, 0.3) 49%, rgba(255, 107, 107, 0.2) 75%, rgba(77, 171, 247, 0.3) 100%)',
            filter: 'blur(100px)'
        }
    }
})
