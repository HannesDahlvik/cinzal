import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs'

import { useTheme } from 'native-base'
import { CalendarBlank, CheckSquare, GearSix, House, Notebook } from 'phosphor-react-native'

import DashboardTasksScreen from '../screens/dashboard/Tasks'
import DashboardCalendarScreen from '../screens/dashboard/Calendar'
import DashboardHomeScreen from '../screens/dashboard/Home'
import DashboardNotesScreen from '../screens/dashboard/Notes'
import DashboardSettingsScreen from '../screens/dashboard/Settings'

const Tab = createBottomTabNavigator<TabParamList>()
const tabBarIconSize = 30

const TabNavigator: React.FC = () => {
    const { colors } = useTheme()

    return (
        <Tab.Navigator
            initialRouteName="DashboardHome"
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.dark[800],
                    borderTopColor: colors.dark[400],
                    height: 64
                },
                tabBarShowLabel: false
            }}
        >
            <Tab.Screen
                name="DashboardTasks"
                component={DashboardTasksScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <CheckSquare size={tabBarIconSize} weight={focused ? 'fill' : 'regular'} />
                    )
                }}
            />
            <Tab.Screen
                name="DashboardCalendar"
                component={DashboardCalendarScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <CalendarBlank
                            size={tabBarIconSize}
                            weight={focused ? 'fill' : 'regular'}
                        />
                    )
                }}
            />
            <Tab.Screen
                name="DashboardHome"
                component={DashboardHomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <House size={tabBarIconSize} weight={focused ? 'fill' : 'regular'} />
                    )
                }}
            />
            <Tab.Screen
                name="DashboardNotes"
                component={DashboardNotesScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Notebook size={tabBarIconSize} weight={focused ? 'fill' : 'regular'} />
                    )
                }}
            />
            <Tab.Screen
                name="DashboardSettings"
                component={DashboardSettingsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <GearSix size={tabBarIconSize} weight={focused ? 'fill' : 'regular'} />
                    )
                }}
            />
        </Tab.Navigator>
    )
}

export default TabNavigator

export type TabParamList = {
    DashboardTasks: undefined
    DashboardCalendar: undefined
    DashboardHome: undefined
    DashboardNotes: undefined
    DashboardSettings: undefined
}

export type TabStackScreenProps<Screen extends keyof TabParamList> = BottomTabScreenProps<
    TabParamList,
    Screen
>
