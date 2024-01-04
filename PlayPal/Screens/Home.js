import React, {useEffect, useState} from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import levelIcon from '../Assets/Icons/level.png';
import {IconButton} from 'react-native-paper';
import {Card, Divider} from '@rneui/themed';
import {ActivityIndicator} from 'react-native';
import {useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';

const Home = ({navigation}) => {
    const [friends, setFriends] = useState();
    const [myData, setMyData] = useState();
    const [loading, setLoading] = useState(true);
    const myId = auth().currentUser.uid;

    const gotoChat = async (user, chatId) => {
        const cid = await fetchChatId(chatId);

        navigation.navigate('ChatScreen', {user, chatId: cid, senderId: myId});
    };

    const gotoViewProfile = user => {
        navigation.navigate('ViewProfile', {user});
    };

    const fetchChatId = async userId => {
        try {
            const senderId = myId;
            const receiverId = userId;

            const chatSnapshot = await firestore()
                .collection('chats')
                .where('participants', 'array-contains', senderId)
                .get();

            const chatId = chatSnapshot.docs
                .filter(doc => doc.data().participants.includes(receiverId))
                .map(doc => doc.id)[0];

            if (!chatId) {
                // No chat found, create a new chat
                const newChat = await firestore()
                    .collection('chats')
                    .add({
                        participants: [senderId, receiverId],
                        messages: [],
                    });
                // Return the newly created chatId
                let cId = newChat.id;
                return cId;
            } else {
                return chatId;
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error initiating chat!',
                text2: error.message,
            });
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetchFriends = async () => {
                try {
                    const usersRef = firestore().collection('users').doc(myId);
                    const querySnapshot = await usersRef.get();

                    const userData = querySnapshot.data();

                    if (userData.points > 15 && userData.points < 30) {
                        await usersRef.update({skillLevel: 'Amateur'});
                        userData.skillLevel = 'Amateur';
                    } else if (userData.points > 30) {
                        await usersRef.update({skillLevel: 'Pro'});
                        userData.skillLevel = 'Pro';
                    } else if (userData.points >= 0) {
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
        }, []),
    );

    const renderFriendItem = ({item}) => {
        const friendName = `${item.firstName} ${item.lastName}`;

        return (
            <View style={styles.friendsView}>
                <TouchableOpacity onPress={() => gotoViewProfile(item)}>
                    <Text style={styles.friendName}>{friendName}</Text>

                    <View style={styles.levelView}>
                        <Image source={levelIcon} style={styles.infoIcons} />
                        <Text style={styles.friendDetails}>
                            {item.skillLevel}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={{height: 50, justifyContent: 'center'}}>
                    <IconButton
                        icon={'android-messages'}
                        size={35}
                        onPress={() => gotoChat(item, item.id)}
                    />
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cardsContainer}>
                <Card containerStyle={styles.card}>
                    <Card.Title style={{fontSize: 18}}>My Points</Card.Title>

                    {loading ? (
                        <ActivityIndicator
                            size={'small'}
                            style={{alignSelf: 'center'}}
                        />
                    ) : (
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '30%',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                alignSelf: 'center',
                                left: -2,
                            }}>
                            <Image
                                source={require('../Assets/Icons/star.png')}
                                style={{width: 16, height: 16}}
                            />
                            <Text style={styles.cardText}>{myData.points}</Text>
                        </View>
                    )}
                </Card>

                <Card containerStyle={styles.card}>
                    <Card.Title style={{fontSize: 18}}>
                        My Experience
                    </Card.Title>

                    {loading ? (
                        <ActivityIndicator
                            size={'small'}
                            style={{alignSelf: 'center'}}
                        />
                    ) : (
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '75%',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                alignSelf: 'center',
                            }}>
                            <Image
                                source={levelIcon}
                                style={{width: 16, height: 16}}
                            />
                            <Text style={styles.cardText}>
                                {myData.skillLevel}
                            </Text>
                        </View>
                    )}
                </Card>
            </View>

            <Text style={styles.friendsTitle}>Friends</Text>
            <Divider style={styles.divider} width={1} />
            {loading ? (
                <ActivityIndicator
                    size={'large'}
                    style={{alignSelf: 'center'}}
                />
            ) : (
                <FlatList
                    data={friends}
                    keyExtractor={item => item.id}
                    renderItem={renderFriendItem}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyText}>
                            You did not add any friends yet!
                        </Text>
                    )}
                />
            )}
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
        width: '90%',
        justifyContent: 'center',
        marginBottom: 60,
        alignSelf: 'center',
    },
    card: {
        width: '50%',
        height: 100,
        borderRadius: 12,
    },
    cardText: {
        textAlign: 'center',
        fontSize: 17,
        color: 'grey',
    },
    friendsTitle: {
        fontSize: 24,
        textAlign: 'center',
        fontWeight: '600',
        color: '#4a5a96',
    },
    divider: {
        marginTop: 10,
        width: '100%',
        backgroundColor: 'grey',
        marginBottom: 20,
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
        fontSize: 19,
        fontWeight: '500',
        color: 'black',
    },
    levelView: {
        flexDirection: 'row',
        width: 100,
        justifyContent: 'flex-start',
        marginTop: 5,
    },
    friendDetails: {
        fontSize: 17,
        color: 'orange',
        left: 10,
    },
    infoIcons: {
        width: 20,
        height: 20,
    },
    emptyText: {
        fontSize: 17,
        color: 'grey',
        textAlign: 'center',
    },
});

export default Home;
