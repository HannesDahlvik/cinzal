import TabScreenWrapper from '../../navigation/TabScreenWrapper'
import { TabStackScreenProps } from '~/navigation/TabNavigator'
import { Heading } from 'native-base'

const DashboardHomeScreen: React.FC<TabStackScreenProps<'DashboardHome'>> = () => {
    return (
        <TabScreenWrapper>
            <Heading>Dashboard Home Screen</Heading>
        </TabScreenWrapper>
    )
}

export default DashboardHomeScreen
