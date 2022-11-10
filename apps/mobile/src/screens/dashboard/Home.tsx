import { StyleSheet } from 'react-native'

import TabScreenWrapper from '../../navigation/TabScreenWrapper'
import { TabStackScreenProps } from '~/navigation/TabNavigator'

import { Box, ScrollView, Text, View } from 'native-base'

const DashboardHomeScreen: React.FC<TabStackScreenProps<'DashboardHome'>> = () => {
    const hours = Array.from<number>({ length: 24 }).fill(0)

    return (
        <TabScreenWrapper>
            <ScrollView>
                {hours.map((_, hour) => (
                    <View style={styles.hourBox} key={hour}>
                        <Box p="1" borderWidth={1} borderColor="dark.400" width="60px">
                            <Text>{hour}:00</Text>
                        </Box>

                        <Box p="1" borderWidth={1} borderColor="dark.400" width="100%" />
                    </View>
                ))}
            </ScrollView>
        </TabScreenWrapper>
    )
}

export default DashboardHomeScreen

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flexDirection: 'column'
    },
    hourBox: {
        display: 'flex',
        flexDirection: 'row',
        height: 100
    }
})
