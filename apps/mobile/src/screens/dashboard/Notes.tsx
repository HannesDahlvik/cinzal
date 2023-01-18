import TabScreenWrapper from '../../navigation/TabScreenWrapper'
import { TabStackScreenProps } from '~/navigation/TabNavigator'
import { Heading } from 'native-base'

const DashboardNotesScreen: React.FC<TabStackScreenProps<'DashboardNotes'>> = () => {
    return (
        <TabScreenWrapper>
            <Heading>Dashboard Notes Screen</Heading>
        </TabScreenWrapper>
    )
}

export default DashboardNotesScreen
