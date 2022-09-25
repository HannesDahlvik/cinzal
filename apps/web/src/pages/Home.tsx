import { useNavigate } from 'react-router-dom'

import { Button, Group, Title } from '@mantine/core'

const Home: React.FC = () => {
    const navigate = useNavigate()

    return (
        <>
            <Title>Home</Title>

            <Group mt={10}>
                <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
            </Group>
        </>
    )
}

export default Home
