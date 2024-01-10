import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View, FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {IconButton} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {ActivityIndicator} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {Button, Divider} from '@rneui/themed';

const Notifications = ({navigation, route}) => {
    const {user} = route.params;
    const [notifications, setNotifications] = useState([]);
    const [userData, setUserData] = useState([]);
    const myId = auth().currentUser.uid;
    const [loading, setLoading] = useState(false);

    const checkNotification = user => {
        navigation.navigate('ViewProfile', {user});
    };

    const gotoTeams = () => {
        navigation.navigate('BottomTab', {screen: 'Team'});
    };

    const gotoMyProfile = () => {
        navigation.navigate('MyProfile', {user});
    };

    const gotoTournament = tournamentId => {
        navigation.navigate('ViewTournament', {tournamentId});
    };

    const markAsRead = async nId => {
        await firestore()
            .collection('notifications')
            .doc(nId)
            .update({read: true});
    };

    const clearNotifications = async () => {
        try {
            setLoading(true);
            setNotifications([]);

            const querySnapshot = await firestore()
                .collection('notifications')
                .where('receiverId', '==', myId)
                .get();

            const batch = firestore().batch();

            querySnapshot.forEach(doc => {
                const notificationData = doc.data();
                const {type} = notificationData;

                if (
                    type === 'no_final' ||
                    type === 'tour_started' ||
                    type === 'tour_ended' ||
                    type === 'tour_abandoned'
                ) {
                    // Update the status field in the document
                    batch.update(doc.ref, {status: false, read: true});
                } else {
                    // If no update needed, delete the document
                    batch.delete(doc.ref);
                }
            });

            await batch.commit().then(setLoading(false));
        } catch (error) {
            setLoading(false);
            Toast.show({
                type: 'error',
                text2: 'An error occurred!',
            });
        }
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const querySnapshot = await firestore()
                    .collection('notifications')
                    .where('receiverId', '==', myId)
                    .orderBy('timestamp', 'desc')
                    .get();

                // const tourQuery = await firestore()
                //     .collection('notifications')
                //     .where('receiverId', 'array-contains', myId)
                //     .orderBy('timestamp', 'desc')
                //     .get();

                // const mergedNotifications = querySnapshot.docs.concat(
                //     tourQuery.docs,
                // );

                const notificationsData = await Promise.all(
                    querySnapshot.docs.map(async doc => {
                        const notification = doc.data();
                        if (
                            notification.type === 'tour_invite' ||
                            notification.type === 'tour_accepted'
                        ) {
                            if (notification.type === 'tour_invite') {
                                return {
                                    id: doc.id,
                                    senderId: notification.senderId,
                                    receiverId: notification.receiverId,
                                    newMessage: notification.message,
                                    type: notification.type,
                                    tourId: notification.tourId,
                                    timestamp: notification.timestamp,
                                };
                            } else if (notification.type === 'tour_accepted') {
                                return {
                                    id: doc.id,
                                    senderId: notification.senderId,
                                    receiverId: notification.receiverId,
                                    newMessage: notification.message,
                                    type: notification.type,
                                    tourId: notification.tourId,
                                    timestamp: notification.timestamp,
                                };
                            }
                        } else if (
                            notification.type === 'no_final' ||
                            notification.type === 'tour_started' ||
                            notification.type === 'tour_ended' ||
                            notification.type === 'tour_abandoned'
                        ) {
                            return {
                                id: doc.id,
                                receiverId: notification.receiverId,
                                newMessage: notification.message,
                                type: notification.type,
                                tourId: notification.tourId,
                                timestamp: notification.timestamp,
                                status: notification.status,
                            };
                        } else {
                            const userRef = await firestore()
                                .collection('users')
                                .doc(notification.senderId)
                                .get();

                            // Set userData to an array of user objects
                            setUserData(prevUserData => [
                                ...prevUserData,
                                {id: userRef.id, ...userRef.data()},
                            ]);

                            const firstName = userRef.data().firstName;
                            const lastName = userRef.data().lastName;
                            const senderName = `${firstName} ${lastName}`;

                            if (notification.type === 'friend_request') {
                                const newMessage =
                                    notification.message + senderName;

                                return {
                                    id: doc.id,
                                    senderId: notification.senderId,
                                    receiverId: notification.receiverId,
                                    newMessage,
                                    type: notification.type,
                                    timestamp: notification.timestamp,
                                };
                            } else if (
                                notification.type === 'friend_accepted'
                            ) {
                                const newMessage =
                                    senderName + notification.message;

                                return {
                                    id: doc.id,
                                    senderId: notification.senderId,
                                    receiverId: notification.receiverId,
                                    newMessage,
                                    type: notification.type,
                                    timestamp: notification.timestamp,
                                };
                            } else if (notification.type === 'team_request') {
                                const newMessage =
                                    senderName +
                                    notification.message +
                                    notification.teamName;

                                return {
                                    id: doc.id,
                                    senderId: notification.senderId,
                                    receiverId: notification.receiverId,
                                    newMessage,
                                    type: notification.type,
                                    timestamp: notification.timestamp,
                                };
                            } else if (
                                notification.type === 'team_accept_request'
                            ) {
                                return {
                                    id: doc.id,
                                    senderId: notification.senderId,
                                    receiverId: notification.receiverId,
                                    newMessage: notification.message,
                                    type: notification.type,
                                    timestamp: notification.timestamp,
                                };
                            } else if (notification.type === 'team_invite') {
                                const newMessage =
                                    senderName + notification.message;

                                return {
                                    id: doc.id,
                                    senderId: notification.senderId,
                                    receiverId: notification.receiverId,
                                    newMessage,
                                    type: notification.type,
                                    teamId: notification.teamId,
                                    timestamp: notification.timestamp,
                                };
                            }
                        }
                    }),
                );

                const filteredNotifications = notificationsData.filter(
                    notification =>
                        notification && notification.status !== false,
                );

                setNotifications(filteredNotifications);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
                Toast.show({
                    type: 'error',
                    text2: error.message,
                });
            }
        };

        fetchNotifications();
    }, []);

    const renderItem = ({item}) => {
        const senderUserData = userData.find(user => user.id === item.senderId);
        const timestamp = item.timestamp.toDate().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });

        return (
            <View style={styles.notificationItemView}>
                <View style={styles.notificationItem}>
                    <Text style={styles.notificationText}>
                        {item.newMessage}
                    </Text>

                    <IconButton
                        icon={'arrow-right-circle-outline'}
                        size={32}
                        style={{
                            height: 40,
                            width: '15%',
                            margin: -3,
                        }}
                        onPress={() => {
                            if (
                                item.type === 'friend_request' ||
                                item.type === 'friend_accepted'
                            ) {
                                checkNotification(senderUserData);
                            } else if (item.type === 'team_request') {
                                gotoTeams();
                            } else if (item.type === 'team_invite') {
                                gotoMyProfile();
                            } else if (
                                item.type === 'tour_invite' ||
                                item.type === 'tour_accepted' ||
                                item.type === 'no_final' ||
                                item.type === 'tour_started'
                            ) {
                                gotoTournament(item.tourId);
                            }

                            markAsRead(item.id);
                        }}
                    />
                </View>

                <Text style={styles.timestampText}>({timestamp})</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 10,
                    paddingHorizontal: 15,
                }}>
                <Text style={styles.title}>Notifications</Text>
                <Button
                    title={'Clear'}
                    color={'transparent'}
                    titleStyle={{
                        color: '#6a4ea7',
                        fontSize: 15,
                        margin: -3,
                    }}
                    containerStyle={{
                        borderWidth: 1,
                        borderColor: '#6a4ea7',
                        fontSize: 17,
                        borderRadius: 15,
                        width: 70,
                        height: 35,
                    }}
                    onPress={() => clearNotifications()}
                />
            </View>
            <Divider
                style={{width: '95%', alignSelf: 'center', marginBottom: 10}}
                width={1}
            />
            {loading ? (
                <ActivityIndicator size={'large'} style={{marginTop: 50}} />
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{
                        padding: 12,
                    }}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={{fontSize: 16, color: 'grey'}}>
                                No notification yet!
                            </Text>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4a5a96',
    },
    notificationItemView: {
        padding: 5,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginBottom: 15,
    },
    notificationItem: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3,
    },
    notificationText: {
        width: '85%',
        fontSize: 15,
        color: 'black',
    },
    timestampText: {
        width: '100%',
        fontSize: 13,
        color: 'grey',
    },
    arrowIcon: {
        width: 20,
        height: 20,
        tintColor: 'gray', // Adjust the color as needed
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
});

export default Notifications;
