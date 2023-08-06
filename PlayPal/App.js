import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import BottomTab from './Navigation/bottomTab';
import GettingStarted from './Screens/GettingStarted';
import SignUp from './Screens/SignUp';
import Login from './Screens/Login';
import Welcome from './Screens/Welcome';
import ViewProfile from './Screens/ViewProfile';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="BottomTab"
                screenOptions={{
                    headerShown: false,
                }}>
                <Stack.Screen
                    name="GettingStarted"
                    component={GettingStarted}
                />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="BottomTab" component={BottomTab} />
                <Stack.Screen name="ViewProfile" component={ViewProfile} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
