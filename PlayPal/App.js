import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import GettingStarted from './Screens/GettingStarted'
import SignUp from './Screens/SignUp'
import Login from './Screens/Login'
import WelcomeScreen from './Screens/WelcomeScreen'

const Stack = createStackNavigator();

export default function App() {
  return (
     <NavigationContainer>
      <Stack.Navigator
        initialRouteName="GettingStarted"
        screenOptions={{
          headerShown: false
          }
        }>
        <Stack.Screen
          name="GettingStarted"
          component={GettingStarted}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
        />
        <Stack.Screen
          name="Login"
          component={Login}
        />
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
