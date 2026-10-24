import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../styles/theme';
import HomeScreen from '../screens/homeScreen';
import CreateScreen from '../screens/createScreen';
import ProfileScreen from '../screens/profileScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
    Home: ['home', 'home-outline'],
    Create: ['add-circle', 'add-circle-outline'],
    Profile: ['person-circle', 'person-circle-outline'],
};

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.secondaryText,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginBottom: 3,
                },
                tabBarStyle: {
                    height: 60,
                    paddingTop: 6,
                    paddingBottom: 4,
                    backgroundColor: COLORS.background,
                    borderTopColor: COLORS.border,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    const [activeIcon, inactiveIcon] = TAB_ICONS[route.name];

                    return (
                        <Ionicons
                            name={focused ? activeIcon : inactiveIcon}
                            size={size + (route.name === 'Create' ? 4 : 0)}
                            color={color}
                        />
                    );
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Create" component={CreateScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}