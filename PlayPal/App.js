import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

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
import ViewTournament from './Screens/ViewTournament';
import Matches from './Screens/Matches';
import EditTournament from './Screens/EditTournament';
import AddMatch from './Screens/AddMatch';
import EditMatch from './Screens/EditMatch';
import StartMatch from './Screens/StartMatch';
import EditTeam from './Screens/EditTeam';
import ViewArena from './Screens/ViewArena';
import Reviews from './Screens/Reviews';
import Slots from './Screens/Slots';
import VerifyMail from './Screens/VerifyMail';
import ForgotPassword from './Screens/ForgotPassword';

const Stack = createStackNavigator();

export default function App() {
    const [isUserSignedIn, setIsUserSignedIn] = React.useState(false);

    React.useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
            if (user) {
                setIsUserSignedIn(true);
            } else {
                setIsUserSignedIn(false);
            }
        });

        return unsubscribe;
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={!isUserSignedIn ? 'Login' : 'GettingStarted'}
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
                <Stack.Screen name="StartMatch" component={StartMatch} />
                <Stack.Screen name="EditTeam" component={EditTeam} />
                <Stack.Screen name="ViewArena" component={ViewArena} />
                <Stack.Screen name="Reviews" component={Reviews} />
                <Stack.Screen name="Slots" component={Slots} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
