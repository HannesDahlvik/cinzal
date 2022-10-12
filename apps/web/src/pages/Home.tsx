import state from '../state'
import { useHookstate } from '@hookstate/core'

import { useNavigate } from 'react-router-dom'

import { Button, Group, Text, Title } from '@mantine/core'

const Home: React.FC = () => {
    const navigate = useNavigate()

    const { value: user } = useHookstate(state.auth.user)

    return (
        <>
            <Title>Home</Title>

            <Group mt={10}>
                <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>

                <Button onClick={() => navigate('/login')}>Login</Button>

                <Button onClick={() => navigate('/signup')}>Signup</Button>
            </Group>

            <Text mt="md">Auth state: {user ? 'Authed' : 'Not authed'}</Text>
        </>
    )
}

export default Home
