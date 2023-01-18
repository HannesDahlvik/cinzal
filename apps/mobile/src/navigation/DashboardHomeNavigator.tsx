import { createDrawerNavigator } from '@react-navigation/drawer'
import DashboardHomeLeftSidebar from '../components/dashboard/home/LeftSidebar'
import DashboardHomeScreen from '../screens/dashboard/Home'

const Drawer = createDrawerNavigator()

const DashboardHomeNavigator: React.FC = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DashboardHomeLeftSidebar {...props} />}
            initialRouteName="DashboardHome"
        >
            <Drawer.Screen
                options={{
                    headerShown: false
                }}
                name="DashboardHomeDrawer"
                component={DashboardHomeScreen}
            />
        </Drawer.Navigator>
    )
}

export default DashboardHomeNavigator
