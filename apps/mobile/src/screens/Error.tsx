import { Button, Center, Code, HStack, Heading } from 'native-base'

interface Props {
    error?: string
}

const ErrorScreen: React.FC<Props> = ({ error }) => {
    return (
        <Center>
            <Heading>APP CRASHED</Heading>

            <Code mt="sm">Error: {error}</Code>

            <HStack mt="md">
                <Button onPress={() => location.reload()}>Reload</Button>
            </HStack>
        </Center>
    )
}

export default ErrorScreen
