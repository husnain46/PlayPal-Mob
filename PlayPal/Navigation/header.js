import React, {useState, useEffect} from 'react';
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

export default function Header({navigation}) {
    const [userData, setUserData] = useState();

    useEffect(() => {
        // Fetch user data from Firestore
        const fetchUserData = async () => {
            const uid = auth().currentUser.uid;
            try {
                const userDoc = await firestore()
                    .collection('users')
                    .doc(uid)
                    .get();
                if (userDoc.exists) {
                    setUserData(userDoc.data());
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
                                    navigation.navigate('App', {
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
                                navigation.navigate('App', {
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
                    onPress={() => navigation.navigate('Notifications')}>
                    <Image
                        source={require('../Assets/Icons/bell.png')}
                        style={styles.bell}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <View style={styles.divider} />

                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('MyProfile', {userData})
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
