import React, {useState, useEffect, useCallback} from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Badge} from '@rneui/themed';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export default function Header({navigation}) {
    const [userData, setUserData] = useState();

    const [badgeCount, setBadgeCount] = useState(0);
    const myId = auth().currentUser.uid;

    useFocusEffect(
        useCallback(() => {
            // Set up real-time listener for new unread notifications
            const unsubscribe = firestore()
                .collection('notifications')
                .where('receiverId', '==', myId)
                .where('read', '==', false)
                .onSnapshot(snapshot => {
                    const unreadNotifications = snapshot.docs.length;

                    setBadgeCount(unreadNotifications);
                });

            return () => {
                unsubscribe();
            };
        }, [navigation]),
    );

    useEffect(() => {
        // Fetch user data from Firestore
        const fetchUserData = async () => {
            try {
                const userDoc = await firestore()
                    .collection('users')
                    .doc(myId)
                    .get();

                if (userDoc.exists) {
                    const myData = userDoc.data();
                    myData.id = userDoc.id;
                    setUserData(myData);
                } else {
                    // User data not found, display an error message
                    Alert.alert(
                        'User Data Not Found',
                        'User data not found. Please try again later.',
                        [
                            {
                                text: 'Reload',
                                onPress: () => {
                                    // Reload the app
                                    navigation.navigate('BottomTab', {
                                        screen: 'Home',
                                    });
                                },
                            },
                        ],
                    );
                }
            } catch (error) {
                // Handle the error and display an error message
                Alert.alert(
                    'Error',
                    'An error occurred while fetching user data. Please try again later.',
                    [
                        {
                            text: 'Reload',
                            onPress: () => {
                                // Reload the app
                                navigation.navigate('BottomTab', {
                                    screen: 'Home',
                                });
                            },
                        },
                    ],
                );
                console.error('Error fetching user data: ', error.message);
            }
        };

        fetchUserData();
    }, []);

    return (
        <SafeAreaView style={styles.header}>
            <View>
                <Image
                    source={require('../Assets/Icons/Logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.rightView}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('Notifications', {user: userData})
                    }
                    style={{flexDirection: 'row'}}>
                    <Image
                        source={require('../Assets/Icons/bell.png')}
                        style={styles.bell}
                        resizeMode="contain"
                    />
                    {badgeCount > 0 && (
                        <Badge
                            status="error"
                            value={badgeCount}
                            containerStyle={{marginLeft: -10}}
                        />
                    )}
                </TouchableOpacity>
                <View style={styles.divider} />

                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('MyProfile', {user: userData})
                    }>
                    <Image
                        source={require('../Assets/Icons/account.png')}
                        style={styles.account}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 90,
    },
    rightView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bell: {
        width: 26,
        height: 29,
    },
    divider: {
        width: 2,
        height: 30,
        backgroundColor: '#BCBCBC',
        marginHorizontal: 20,
    },
    account: {
        width: 35,
        height: 35,
    },
});
