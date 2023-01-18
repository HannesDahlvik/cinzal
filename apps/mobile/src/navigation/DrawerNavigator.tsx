import { createDrawerNavigator } from '@react-navigation/drawer'
import DashboardHomeLeftSidebar from '../components/dashboard/home/LeftSidebar'
import TabNavigator from './TabNavigator'
import DashboardHomeScreen from '../screens/dashboard/Home'
import { useTheme } from 'native-base'

const LeftDrawer = createDrawerNavigator()

const DrawerNavigator: React.FC = () => {
    const theme = useTheme()

    return (
        <LeftDrawer.Navigator
            id="DashboardLeftDrawer"
            drawerContent={(props) => <DashboardHomeLeftSidebar {...props} />}
            screenOptions={{
                drawerPosition: 'left',
                headerShown: false,
                drawerStyle: {
                    backgroundColor: theme.colors.dark[700]
                }
            }}
        >
            <LeftDrawer.Screen name="HomeDrawer" component={RightDrawerScreen} />
        </LeftDrawer.Navigator>
    )
}

export default DrawerNavigator

const RightDrawer = createDrawerNavigator()

function RightDrawerScreen() {
    return (
        <RightDrawer.Navigator
            id="DashboardRightDrwaer"
            screenOptions={{ drawerPosition: 'right', headerShown: false }}
        >
            <LeftDrawer.Screen name="Home" component={TabNavigator} />
        </RightDrawer.Navigator>
    )
}
