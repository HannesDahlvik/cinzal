import TabScreenWrapper from '../../navigation/TabScreenWrapper'
import { TabStackScreenProps } from '~/navigation/TabNavigator'
import { Heading } from 'native-base'

const DashboardTasksScreen: React.FC<TabStackScreenProps<'DashboardTasks'>> = () => {
    return (
        <TabScreenWrapper>
            <Heading>Dashboard Tasks Screen</Heading>
        </TabScreenWrapper>
    )
}

export default DashboardTasksScreen
