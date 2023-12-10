import 'react-native-gesture-handler';
import * as React from 'react';
import NetworkStatus from './NetworkHandler/NetworkStatus';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

import BottomTab from './Navigation/bottomTab';
import Notifications from './Screens/Notifications';
import MyProfile from './Screens/MyProfile';
import EditProfile from './Screens/EditProfile';
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
import ViewTournament from './Screens/ViewTournament';
import Matches from './Screens/Matches';
import EditTournament from './Screens/EditTournament';
import AddMatch from './Screens/AddMatch';
import EditMatch from './Screens/EditMatch';
import StartMatch from './Screens/StartMatch';
import CricketMatch from './Screens/CricketMatch';
import EditTeam from './Screens/EditTeam';
import ViewArena from './Screens/ViewArena';
import Reviews from './Screens/Reviews';
import Slots from './Screens/Slots';
import VerifyMail from './Screens/VerifyMail';
import ForgotPassword from './Screens/ForgotPassword';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';

const Stack = createStackNavigator();

const toastConfig = {
    success: props => (
        <BaseToast
            {...props}
            style={{borderLeftColor: '#08c979'}}
            contentContainerStyle={{paddingHorizontal: 15}}
            text1Style={{
                fontSize: 15,
                fontWeight: '400',
            }}
        />
    ),

    error: props => (
        <ErrorToast
            {...props}
            text1Style={{
                fontSize: 17,
            }}
            text2Style={{
                fontSize: 15,
            }}
        />
    ),

    info: props => (
        <BaseToast
            {...props}
            style={{borderLeftColor: 'blue'}}
            contentContainerStyle={{paddingHorizontal: 15}}
            text1Style={{
                fontSize: 14,
                fontWeight: '400',
            }}
        />
    ),
};

export default function App() {
    const [routeName, setRouteName] = useState(null);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
            if (user) {
                setRouteName('BottomTab');
            } else {
                setRouteName('GettingStarted');
            }
        });

        return () => unsubscribe();
    }, []);

    if (routeName === null) {
        return (
            <ActivityIndicator
                size={'large'}
                style={{flex: 1, alignSelf: 'center'}}
            />
        );
    }

    return (
        <NetworkStatus>
            <>
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName={routeName}
                        screenOptions={{
                            headerShown: false,
                        }}>
                        <Stack.Screen
                            name="GettingStarted"
                            component={GettingStarted}
                        />
                        <Stack.Screen name="SignUp" component={SignUp} />

                        <Stack.Screen
                            name="VerifyMail"
                            component={VerifyMail}
                            options={{gestureEnabled: false}}
                        />
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen
                            name="ForgotPassword"
                            component={ForgotPassword}
                        />

                        <Stack.Screen name="Welcome" component={Welcome} />
                        <Stack.Screen name="BottomTab" component={BottomTab} />
                        <Stack.Screen
                            name="Notifications"
                            component={Notifications}
                        />
                        <Stack.Screen name="MyProfile" component={MyProfile} />
                        <Stack.Screen
                            name="EditProfile"
                            component={EditProfile}
                        />
                        <Stack.Screen
                            name="ViewProfile"
                            component={ViewProfile}
                        />
                        <Stack.Screen
                            name="ChatScreen"
                            component={ChatScreen}
                        />
                        <Stack.Screen
                            name="CreateTeam"
                            component={CreateTeam}
                        />
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
                        <Stack.Screen
                            name="ViewTournament"
                            component={ViewTournament}
                        />
                        <Stack.Screen name="Matches" component={Matches} />
                        <Stack.Screen
                            name="EditTournament"
                            component={EditTournament}
                        />
                        <Stack.Screen name="AddMatch" component={AddMatch} />
                        <Stack.Screen name="EditMatch" component={EditMatch} />
                        <Stack.Screen
                            name="StartMatch"
                            component={StartMatch}
                        />
                        <Stack.Screen
                            name="CricketMatch"
                            component={CricketMatch}
                        />
                        <Stack.Screen name="EditTeam" component={EditTeam} />
                        <Stack.Screen name="ViewArena" component={ViewArena} />
                        <Stack.Screen name="Reviews" component={Reviews} />
                        <Stack.Screen name="Slots" component={Slots} />
                    </Stack.Navigator>
                </NavigationContainer>
                <Toast config={toastConfig} />
            </>
        </NetworkStatus>
    );
}
