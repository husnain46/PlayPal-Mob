import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../Screens/Home';
import FindPlayers from '../Screens/FindPlayers';
import Team from '../Screens/Team';
import Tournament from '../Screens/Tournament';
import FindArena from '../Screens/FindArena';
import {View, Image, Text, StyleSheet} from 'react-native';
import Header from './header';

const Tab = createBottomTabNavigator();

const BottomTab = ({navigation}) => {
    return (
        <Tab.Navigator
            initialRouteName="FindArena"
            screenOptions={{
                headerTitle: () => <Header navigation={navigation} />,
                tabBarHideOnKeyboard: true,
                headerStyle: {height: 65, borderBottomWidth: 2},
                tabBarShowLabel: false,

                tabBarStyle: {
                    position: 'absolute',
                    bottom: 10,
                    left: 12,
                    right: 12,
                    elevation: 5,
                    backgroundColor: '#ffffff',
                    borderRadius: 15,
                    borderWidth: 2,
                    borderTopWidth: 2,
                    borderTopColor: 'darkgrey',
                    borderColor: 'darkgrey',
                    height: 75,
                },
            }}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({focused}) => (
                        <View>
                            <View
                                style={{
                                    width: 43,
                                    height: 43,
                                    borderRadius: 15,
                                    backgroundColor: focused
                                        ? '#4A5B96'
                                        : 'white',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Image
                                    source={require('../Assets/Icons/home.png')}
                                    resizeMode="contain"
                                    style={{
                                        width: 25,
                                        height: 25,
                                        tintColor: focused
                                            ? 'white'
                                            : '#A1A1A1',
                                    }}
                                />
                            </View>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 13,
                                    fontWeight: 'bold',
                                }}>
                                Home
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="FindPlayers"
                component={FindPlayers}
                options={{
                    tabBarIcon: ({focused}) => (
                        <View style={{right: 3}}>
                            <View
                                style={{
                                    width: 43,
                                    height: 43,
                                    borderRadius: 15,
                                    backgroundColor: focused
                                        ? '#4A5B96'
                                        : 'white',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Image
                                    source={require('../Assets/Icons/player.png')}
                                    resizeMode="contain"
                                    style={{
                                        width: 25,
                                        height: 25,
                                        tintColor: focused
                                            ? 'white'
                                            : '#A1A1A1',
                                    }}
                                />
                            </View>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 13,
                                    fontWeight: 'bold',
                                }}>
                                Players
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Team"
                component={Team}
                options={{
                    tabBarIcon: ({focused}) => (
                        <View style={{right: 8}}>
                            <View
                                style={{
                                    width: 43,
                                    height: 43,
                                    borderRadius: 15,
                                    backgroundColor: focused
                                        ? '#4A5B96'
                                        : 'white',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Image
                                    source={require('../Assets/Icons/jersey2.png')}
                                    resizeMode="contain"
                                    style={{
                                        width: 25,
                                        height: 25,
                                        tintColor: focused
                                            ? 'white'
                                            : '#A1A1A1',
                                    }}
                                />
                            </View>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 13,
                                    fontWeight: 'bold',
                                }}>
                                Team
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Tournament"
                component={Tournament}
                options={{
                    tabBarIcon: ({focused}) => (
                        <View
                            style={{
                                width: 80,
                                alignItems: 'center',
                                right: 5,
                            }}>
                            <View
                                style={{
                                    width: 43,
                                    height: 43,
                                    borderRadius: 15,
                                    backgroundColor: focused
                                        ? '#4A5B96'
                                        : 'white',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    right: 1,
                                }}>
                                <Image
                                    source={require('../Assets/Icons/trophy.png')}
                                    resizeMode="contain"
                                    style={{
                                        width: 25,
                                        height: 25,
                                        tintColor: focused
                                            ? 'white'
                                            : '#A1A1A1',
                                    }}
                                />
                            </View>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 13,
                                    fontWeight: 'bold',
                                }}>
                                Tournament
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="FindArena"
                component={FindArena}
                options={{
                    tabBarIcon: ({focused}) => (
                        <View>
                            <View
                                style={{
                                    width: 43,
                                    height: 43,
                                    borderRadius: 15,
                                    backgroundColor: focused
                                        ? '#4A5B96'
                                        : 'white',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Image
                                    source={require('../Assets/Icons/arena.png')}
                                    resizeMode="contain"
                                    style={{
                                        width: 26,
                                        height: 26,
                                        tintColor: focused
                                            ? 'white'
                                            : '#A1A1A1',
                                    }}
                                />
                            </View>
                            <Text
                                style={{
                                    alignSelf: 'center',
                                    fontSize: 13,
                                    fontWeight: 'bold',
                                }}>
                                Arenas
                            </Text>
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    homeIcon: {},
});

export default BottomTab;
