import React, {useEffect, useState} from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import levelIcon from '../Assets/Icons/level.png';
import {IconButton} from 'react-native-paper';
import {Badge, Button, Card, Divider} from '@rneui/themed';
import {ActivityIndicator} from 'react-native';
import {useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';

const Home = ({navigation}) => {
    const [friends, setFriends] = useState();
    const [myData, setMyData] = useState();
    const [loading, setLoading] = useState(true);
    const [badgeCount, setBadgeCount] = useState(0);

    const myId = auth().currentUser.uid;

    const gotoChat = async (user, chatId) => {
        // friends[user.id].unreadMsg = 0;
        navigation.navigate('ChatScreen', {
            user,
            chatId: chatId,
            senderId: myId,
        });
    };

    const gotoViewProfile = user => {
        navigation.navigate('ViewProfile', {user});
    };

    const gotoMyBookings = () => {
        navigation.navigate('MyBookings');
    };

    const gotoReviews = () => {
        navigation.navigate('Reviews');
    };

    useFocusEffect(
        useCallback(() => {
            const fetchFriends = async () => {
                try {
                    const usersRef = firestore().collection('users').doc(myId);
                    const querySnapshot = await usersRef.get();

                    const userData = querySnapshot.data();

                    if (userData.points >= 15 && userData.points < 30) {
                        await usersRef.update({skillLevel: 'Amateur'});
                        userData.skillLevel = 'Amateur';
                    } else if (userData.points >= 30) {
                        await usersRef.update({skillLevel: 'Pro'});
                        userData.skillLevel = 'Pro';
                    } else if (userData.points >= 0 && userData.points < 15) {
                        await usersRef.update({skillLevel: 'Beginner'});
                        userData.skillLevel = 'Beginner';
                    }

                    setMyData(userData);

                    const friendsId = userData.friends;

                    const friendsData = [];

                    if (friendsId.length > 0) {
                        for (const fId of friendsId) {
                            const friendRef = firestore()
                                .collection('users')
                                .doc(fId);

                            const friendSnapshot = await friendRef.get();

                            const fData = friendSnapshot.data();
                            fData.id = fId;

                            // Fetch chatId for friend
                            const chatSnapshot = await firestore()
                                .collection('chats')
                                .where('participants', 'array-contains', myId)
                                .get();

                            const chatId = chatSnapshot.docs
                                .filter(doc =>
                                    doc.data().participants.includes(fId),
                                )
                                .map(doc => doc.id)[0];

                            // Fetch messages without senderId == receiverId and myId in readBy array
                            let unreadCount = 0;

                            if (!chatId) {
                                // No chat found, create a new chat
                                const newChat = await firestore()
                                    .collection('chats')
                                    .add({
                                        participants: [senderId, receiverId],
                                        messages: [],
                                    });
                            } else {
                                const chatData = await firestore()
                                    .collection('chats')
                                    .doc(chatId)
                                    .get();

                                const messages = chatData.data().messages || [];
                                unreadCount = messages.filter(message => {
                                    return (
                                        message.sender !== fId && // Not sent by friend
                                        (!message.readBy ||
                                            !message.readBy.includes(myId)) // Not read by me
                                    );
                                }).length;
                            }

                            fData.chatId = chatId;
                            fData.unreadMsg = unreadCount;

                            friendsData.push(fData);
                        }
                        setFriends(friendsData);
                        setLoading(false);
                    } else {
                        setFriends([]);
                        setLoading(false);
                    }
                } catch (error) {
                    setLoading(false);
                    Toast.show({
                        type: 'error',
                        text2: error.message,
                    });
                }
            };

            fetchFriends();
        }, [myId]),
    );

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('bookings')
            .where('userId', '==', myId)
            .where('bookingDate', '<', new Date())
            .where('reviewed', '==', false)
            .where('type', '==', 'inApp')
            .onSnapshot(snapshot => {
                const numReviews = snapshot.docs.length;
                setBadgeCount(numReviews);
            });

        // Unsubscribe from the snapshot listener when component unmounts
        return () => unsubscribe();
    }, []);

    const renderFriendItem = ({item}) => {
        const friendName = `${item.firstName} ${item.lastName}`;

        return (
            <View style={styles.friendsView}>
                <TouchableOpacity
                    onPress={() => gotoViewProfile(item)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <View style={{marginEnd: 10}}>
                        <Image
                            source={{uri: item.profilePic}}
                            resizeMode="stretch"
                            style={{
                                width: 51,
                                height: 51,
                                borderWidth: 1.5,
                                borderColor: 'black',
                                borderRadius: 10,
                            }}
                        />
                    </View>
                    <View
                        style={{
                            justifyContent: 'space-around',
                            height: 51,
                            bottom: 2,
                        }}>
                        <Text style={styles.friendName}>{friendName}</Text>

                        <View style={styles.levelView}>
                            <Image
                                source={levelIcon}
                                style={styles.infoIcons}
                            />
                            <Text style={styles.friendDetails}>
                                {item.skillLevel}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{height: 50, justifyContent: 'center'}}>
                    <IconButton
                        icon={'android-messages'}
                        size={35}
                        onPress={() => gotoChat(item, item.chatId)}
                    />
                    {item.unreadMsg > 0 && (
                        <Badge
                            status="error"
                            value={item.unreadMsg}
                            containerStyle={{
                                position: 'absolute',
                                alignSelf: 'flex-end',
                                bottom: 25,
                                right: 10,
                            }}
                        />
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={{flex: 1}}
                contentContainerStyle={{paddingBottom: 90}}>
                <View style={styles.cardsContainer}>
                    <View style={styles.card}>
                        <Text style={styles.pointsText}>My Points</Text>

                        {loading ? (
                            <ActivityIndicator
                                size={'small'}
                                style={{alignSelf: 'center', top: 20}}
                            />
                        ) : (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    height: '50%',
                                    left: -2,
                                }}>
                                <Image
                                    source={require('../Assets/Icons/star.png')}
                                    style={{
                                        width: 15,
                                        height: 15,
                                        marginRight: 7,
                                    }}
                                />
                                <Text style={styles.cardText}>
                                    {myData.points}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.pointsText}>My Experience</Text>

                        {loading ? (
                            <ActivityIndicator
                                size={'small'}
                                style={{alignSelf: 'center', top: 20}}
                            />
                        ) : (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    height: '50%',

                                    left: -2,
                                }}>
                                <Image
                                    source={levelIcon}
                                    style={{
                                        width: 15,
                                        height: 15,
                                        marginRight: 7,
                                    }}
                                />
                                <Text style={styles.cardText}>
                                    {myData.skillLevel}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.bookingView}>
                    <Button
                        title={'My Bookings'}
                        color={'#4a5a96'}
                        containerStyle={styles.bookingBtn}
                        onPress={() => gotoMyBookings()}
                    />

                    <View style={styles.reviewBtnView}>
                        <Button
                            title={'To Review'}
                            color={'#1ac775'}
                            titleStyle={{color: 'white'}}
                            containerStyle={styles.reviewBtn}
                            onPress={() => gotoReviews()}
                        />
                        {badgeCount > 0 ? (
                            <Badge
                                status="error"
                                containerStyle={{
                                    zIndex: 10,
                                    left: -12,
                                }}
                                badgeStyle={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 30,
                                }}
                            />
                        ) : (
                            <></>
                        )}
                    </View>
                </View>

                <Text style={styles.friendsTitle}>Friends</Text>
                <Divider style={styles.divider} width={1} />
                {loading ? (
                    <ActivityIndicator
                        size={'large'}
                        color={'darkblue'}
                        style={{alignSelf: 'center', top: 20}}
                    />
                ) : (
                    <FlatList
                        data={friends}
                        keyExtractor={item => item.id}
                        scrollEnabled={false}
                        renderItem={renderFriendItem}
                        ListEmptyComponent={() => (
                            <Text style={styles.emptyText}>
                                You did not add any friends yet!
                            </Text>
                        )}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    cardsContainer: {
        flexDirection: 'row',
        width: '96%',
        justifyContent: 'space-between',
        marginBottom: 15,
        alignSelf: 'center',
        marginTop: 10,
    },
    card: {
        width: '46%',
        height: 90,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'lightgrey',
        backgroundColor: 'white',
    },
    pointsText: {
        fontSize: 17,
        color: 'black',
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 10,

        fontStyle: 'italic',
    },
    cardText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#546DDC',
    },
    bookingView: {
        width: '97%',
        height: 60,
        alignSelf: 'center',
        marginBottom: 25,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    bookingBtn: {
        width: '46%',
        borderRadius: 12,
        elevation: 5,
    },
    reviewBtnView: {
        width: '46%',
        flexDirection: 'row',
    },
    reviewBtn: {
        width: '100%',
        borderRadius: 12,
        elevation: 1,
    },
    friendsTitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '600',
        color: '#4a5a96',
        fontStyle: 'italic',
    },
    divider: {
        marginTop: 5,
        width: '98%',
        alignSelf: 'center',
        backgroundColor: 'grey',
        marginBottom: 5,
    },
    friendsView: {
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        paddingVertical: 10,
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    friendName: {
        fontSize: 17,
        fontWeight: '500',
        color: 'black',
    },
    levelView: {
        flexDirection: 'row',
        width: 100,
        justifyContent: 'flex-start',
    },
    friendDetails: {
        fontSize: 15,
        color: '#7d41ab',
        left: 7,
    },
    infoIcons: {
        width: 18,
        height: 18,
    },
    emptyText: {
        fontSize: 17,
        color: 'grey',
        textAlign: 'center',
    },
});

export default Home;
