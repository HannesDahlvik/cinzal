import { DrawerContentComponentProps } from '@react-navigation/drawer/lib/typescript/src/types'

import { Box, Text } from 'native-base'

const DashboardHomeLeftSidebar: React.FC<DrawerContentComponentProps> = () => {
    return (
        <>
            <Box>
                <Text>Left sidebar</Text>
            </Box>
        </>
    )
}

export default DashboardHomeLeftSidebar
