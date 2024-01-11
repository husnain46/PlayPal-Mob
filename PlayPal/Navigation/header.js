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
import {Badge} from '@rneui/themed';

export default function Header({navigation}) {
    const [userData, setUserData] = useState();

    const [badgeCount, setBadgeCount] = useState(0);
    const myId = auth().currentUser.uid;

    useEffect(() => {
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
    }, []);

    const checkedTournaments = {}; // Store checked tournaments
    const startedTournaments = {};
    const endedTournaments = {};

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

        const getNotifications = async () => {
            try {
                const teamRef = firestore()
                    .collection('teams')
                    .where('playersId', 'array-contains', myId);

                const teamSnapshot = await teamRef.get();
                const teamsData = [];

                teamSnapshot.forEach(doc => {
                    teamsData.push({
                        id: doc.id,
                        teamName: doc.data().name,
                        players: doc.data().playersId,
                        captain: doc.data().captainId,
                    });
                });

                const currentDate = new Date();

                for (const team of teamsData) {
                    const tournamentRef = firestore()
                        .collection('tournaments')
                        .where('teamIds', 'array-contains', team.id);

                    let isCaptain = team.captainId === myId;

                    const tournamentSnapshot = await tournamentRef.get();

                    tournamentSnapshot.forEach(async doc => {
                        const tournamentData = doc.data();
                        const startDate = tournamentData.start_date.toDate();
                        const endDate = tournamentData.end_date.toDate();
                        let isOrganizer = tournamentData.organizer === team.id;

                        if (!startedTournaments[doc.id]) {
                            startedTournaments[doc.id] = true;

                            const existingTourNotif = await firestore()
                                .collection('notifications')
                                .where('receiverId', '==', myId)
                                .where('tourId', '==', doc.id)
                                .where('type', '==', 'tour_started')
                                .get();

                            if (existingTourNotif.empty) {
                                if (startDate <= currentDate) {
                                    const notification = {
                                        receiverId: myId,
                                        message: `Game on! ${tournamentData.name} has officially kicked off. Ready, Set, Conquer! 🎉`,
                                        type: 'tour_started',
                                        tourId: doc.id,
                                        read: false,
                                        timestamp: startDate,
                                        status: true,
                                    };
                                    await firestore()
                                        .collection('notifications')
                                        .add(notification);
                                }
                            }
                        }

                        if (!endedTournaments[doc.id]) {
                            endedTournaments[doc.id] = true;

                            if (endDate <= currentDate) {
                                const existingRef = firestore()
                                    .collection('notifications')
                                    .where('receiverId', '==', myId)
                                    .where('tourId', '==', doc.id);

                                const existingNotify1 = await existingRef
                                    .where('type', '==', 'tour_ended')
                                    .get();

                                const existingNotify2 = await existingRef
                                    .where('type', '==', 'tour_abandoned')
                                    .get();

                                if (
                                    existingNotify1.empty &&
                                    existingNotify2.empty
                                ) {
                                    const timeDiffer =
                                        endDate.getTime() -
                                        currentDate.getTime();
                                    const daysDiffer =
                                        timeDiffer / (1000 * 3600 * 24);
                                    const roundedDays =
                                        Math.round(daysDiffer * 100) / 100;

                                    if (roundedDays <= 0) {
                                        let notifyMsg = 'Tournament ended!';
                                        let notifyType = 'tour_ended';

                                        if (
                                            tournamentData.matches.some(
                                                match =>
                                                    match.title !== 'Final',
                                            )
                                        ) {
                                            notifyMsg = `${tournamentData.name} got abandoned!\nFinal match was not scheduled/held.`;
                                            notifyType = 'tour_abandoned';
                                        } else {
                                            notifyMsg = `${tournamentData.winner} won the ${tournamentData.name}.`;
                                            notifyType = 'tour_ended';
                                        }

                                        const notification = {
                                            receiverId: myId,
                                            message: notifyMsg,
                                            type: notifyType,
                                            tourId: doc.id,
                                            read: false,
                                            timestamp: endDate,
                                            status: true,
                                        };

                                        await firestore()
                                            .collection('notifications')
                                            .add(notification);
                                    }
                                }
                            }
                        }

                        if (
                            startDate <= currentDate &&
                            endDate >= currentDate &&
                            tournamentData.matches.some(
                                match => match.title !== 'Final',
                            )
                        ) {
                            const timeDifference =
                                endDate.getTime() - currentDate.getTime();
                            const daysDifference = Math.ceil(
                                timeDifference / (1000 * 3600 * 24),
                            );

                            if (daysDifference <= 2) {
                                if (!checkedTournaments[doc.id]) {
                                    checkedTournaments[doc.id] = true;

                                    const existingNotification =
                                        await firestore()
                                            .collection('notifications')
                                            .where('receiverId', '==', myId)
                                            .where('tourId', '==', doc.id)
                                            .where('type', '==', 'no_final')
                                            .get();

                                    if (existingNotification.empty) {
                                        const organizerRef = await firestore()
                                            .collection('teams')
                                            .doc(tournamentData.organizer)
                                            .get();
                                        const organizerName =
                                            organizerRef.data().name;

                                        let daysMsg =
                                            daysDifference < 1
                                                ? 'today'
                                                : daysDifference === 1
                                                ? `in ${daysDifference} day`
                                                : `in ${daysDifference} days`;

                                        let newMessage =
                                            isOrganizer && isCaptain
                                                ? `${tournamentData.name} is ending ${daysMsg}!\nAs an organizer team captain, you must schedule the FINAL match of the tournament now.`
                                                : `${tournamentData.name} is ending ${daysMsg}!\n${organizerName} has not scheduled the FINAL match of the tournament yet.`;

                                        const notification = {
                                            receiverId: myId,
                                            message: newMessage,
                                            type: 'no_final',
                                            tourId: doc.id,
                                            read: false,
                                            timestamp: currentDate,
                                            status: true,
                                        };

                                        await firestore()
                                            .collection('notifications')
                                            .add(notification);
                                    }
                                }
                            }
                        }
                    });
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        getNotifications();

        fetchUserData();
    }, []);

    return (
        <SafeAreaView style={styles.header}>
            <View style={styles.logoView}>
                <Image
                    source={require('../Assets/Icons/homeLogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.rightView}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('Notifications', {user: userData})
                    }
                    style={{flexDirection: 'row-reverse'}}>
                    <Image
                        source={require('../Assets/Icons/bell.png')}
                        style={styles.bell}
                        resizeMode="contain"
                    />
                    {badgeCount > 0 && (
                        <Badge
                            status="error"
                            value={badgeCount}
                            containerStyle={{
                                position: 'absolute',
                                width: 8,
                                height: 8,
                                top: -2,
                            }}
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
    logoView: {
        width: '70%',
        justifyContent: 'center',
        top: 2,
    },
    logo: {
        width: 150,
    },
    rightView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '30%',
    },
    bell: {
        width: 24,
        height: 27,
    },
    divider: {
        width: 2,
        height: 30,
        backgroundColor: '#BCBCBC',
        marginHorizontal: 20,
    },
    account: {
        width: 33,
        height: 33,
    },
});
