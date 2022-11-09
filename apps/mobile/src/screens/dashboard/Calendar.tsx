import TabScreenWrapper from '../../navigation/TabScreenWrapper'
import { TabStackScreenProps } from '~/navigation/TabNavigator'
import { Heading } from 'native-base'

const DashboardCalendarScreen: React.FC<TabStackScreenProps<'DashboardCalendar'>> = () => {
    return (
        <TabScreenWrapper>
            <Heading>Dashboard Calendar Screen</Heading>
        </TabScreenWrapper>
    )
}

export default DashboardCalendarScreen
