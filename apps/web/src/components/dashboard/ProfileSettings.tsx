import { ColorScheme, Group, Select, Stack, Text, useMantineColorScheme } from '@mantine/core'

const DashboardProfileSettings = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme()

    return (
        <Stack>
            <Group grow>
                <Text>Theme</Text>
                <Select
                    value={colorScheme}
                    onChange={(value) => toggleColorScheme(value as ColorScheme)}
                    data={[
                        { value: 'light', label: 'Light' },
                        { value: 'dark', label: 'Dark' }
                    ]}
                />
            </Group>
        </Stack>
    )
}

export default DashboardProfileSettings
