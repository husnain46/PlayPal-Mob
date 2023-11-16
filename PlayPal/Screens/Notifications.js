import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View, FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {IconButton} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {ActivityIndicator} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

const Notifications = ({navigation, route}) => {
    const [notifications, setNotifications] = useState([]);
    const [userData, setUserData] = useState([]);
    const myId = auth().currentUser.uid;
    const [loading, setLoading] = useState(true);

    const checkNotification = user => {
        navigation.navigate('ViewProfile', {user});
    };

    useFocusEffect(
        useCallback(() => {
            const fetchNotifications = async () => {
                try {
                    setLoading(true);
                    const querySnapshot = await firestore()
                        .collection('notifications')
                        .where('receiverId', '==', myId)
                        .get();

                    const notificationsData = await Promise.all(
                        querySnapshot.docs.map(async doc => {
                            const notification = doc.data();

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

                            const newMessage =
                                notification.message + senderName;

                            return {
                                id: doc.id,
                                senderId: notification.senderId,
                                receiverId: notification.receiverId,
                                newMessage,
                            };
                        }),
                    );

                    setNotifications(notificationsData);
                    setLoading(false);
                } catch (error) {
                    setLoading(false);

                    Toast.show({
                        type: 'error',
                        text2: error.message,
                    });
                }
            };

            fetchNotifications();
        }, [navigation]),
    );

    const renderItem = ({item}) => {
        const senderUserData = userData.find(user => user.id === item.senderId);
        return (
            <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>{item.newMessage}</Text>
                <IconButton
                    icon={'arrow-right-circle-outline'}
                    size={32}
                    style={{height: 40}}
                    onPress={() => checkNotification(senderUserData)}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Notifications</Text>
            {loading ? (
                <ActivityIndicator size={'large'} style={{marginTop: 50}} />
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={{fontSize: 16}}>
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
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#4a5a96',
    },
    notificationItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notificationText: {
        flex: 1,
        fontSize: 17,
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
