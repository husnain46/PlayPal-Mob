import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Welcome from './Screens/WelcomeScreen'
import SignUp from './Screens/SignUp'

const Stack = createStackNavigator();

export default function App() {
  return (
     <NavigationContainer>
      <Stack.Navigator
        initialRouteName="WelcomeScreen"
        screenOptions={{
          headerShown: false
          }
        }>
        <Stack.Screen
          name="WelcomeScreen"
          component={Welcome}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
