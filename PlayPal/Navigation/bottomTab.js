import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../Screens/Home';
import FindPlayers from '../Screens/FindPlayers';
import Team from '../Screens/Team';
import Tournament from '../Screens/Tournament';
import FindArena from '../Screens/FindArena';
import {View, Image, Text, StyleSheet} from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 18,
                    left: 20,
                    right: 20,
                    elevation: 6,
                    backgroundColor: '#ffffff',
                    borderRadius: 15,
                    height: 75,
                    shadowColor: '#7F5Df0',
                    shadowOffset: {height: 10, width: 0},
                    shadowOpacity: 0.25,
                    shadowRadius: 3.5,
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
                                    source={require('../Assets/Icons/team.png')}
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
