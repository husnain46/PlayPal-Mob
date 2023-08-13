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
import ChatScreen from './Screens/ChatScreen';
import CreateTeam from './Screens/CreateTeam';
import JoinTeam from './Screens/JoinTeam';
import ViewTeam from './Screens/ViewTeam';
import OrganizeTournament from './Screens/OrganizeTournament';
import ExploreTournament from './Screens/ExploreTournament';

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
                <Stack.Screen name="ChatScreen" component={ChatScreen} />
                <Stack.Screen name="CreateTeam" component={CreateTeam} />
                <Stack.Screen name="JoinTeam" component={JoinTeam} />
                <Stack.Screen name="ViewTeam" component={ViewTeam} />
                <Stack.Screen
                    name="OrganizeTournament"
                    component={OrganizeTournament}
                />
                <Stack.Screen
                    name="ExploreTournament"
                    component={ExploreTournament}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
