import TabScreenWrapper from '../../navigation/TabScreenWrapper'
import { TabStackScreenProps } from '~/navigation/TabNavigator'
import { Heading } from 'native-base'

const DashboardSettingsScreen: React.FC<TabStackScreenProps<'DashboardSettings'>> = () => {
    return (
        <TabScreenWrapper>
            <Heading>Dashboard Settings Screen</Heading>
        </TabScreenWrapper>
    )
}

export default DashboardSettingsScreen
