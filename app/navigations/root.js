import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import LoginScreen from '../screens/loginScreen';
import RegisterScreen from '../screens/registerScreen';
import DetailScreen from '../screens/detailScreen';
import BottomTabNavigator from './tabNavigator';
import { AuthContext } from '../context/authContext';


const Stack = createNativeStackNavigator();

export default function RootStack() {
    const { isSignIn } = useContext(AuthContext)

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isSignIn
                ?
                <>
                    <Stack.Screen name='HomeTab' component={BottomTabNavigator} />
                    <Stack.Screen name='Detail' component={DetailScreen} />
                </>
                :
                <>
                    <Stack.Screen name='Login' component={LoginScreen} />
                    <Stack.Screen name='Register' component={RegisterScreen} />
                </>}
        </Stack.Navigator>
    )
}