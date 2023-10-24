import React, {useState, useEffect, useCallback, useRef} from 'react';
import styles from '../Styles/viewProfileStyles';
import {
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ToastAndroid,
    SafeAreaView,
    Modal,
} from 'react-native';
import {Avatar, Text, ListItem, Divider, Button} from '@rneui/themed';
import getAge from '../Functions/getAge';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import getSportsByIds from '../Functions/getSportsByIds';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';
import AlertPro from 'react-native-alert-pro';

const ViewProfile = ({navigation, route}) => {
    const {user} = route.params;
    const sportName = getSportsByIds(user.preferredSports);
    const [requestSent, setRequestSent] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [chatId, setChatId] = useState('');
    const myId = auth().currentUser.uid;
    const playerId = user.id;
    const [sender, setSender] = useState('');
    const [receiver, setReceiver] = useState('');
    const [isAccepted, setIsAccepted] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (isFriend) {
                const fetchChatId = async () => {
                    try {
                        const senderId = auth().currentUser.uid;
                        const receiverId = user.id;

                        const chatSnapshot = await firestore()
                            .collection('chats')
                            .where('participants', '==', [senderId, receiverId])
                            .get();

                        if (chatSnapshot.empty) {
                            // No chat found, create a new chat
                            const newChat = await firestore()
                                .collection('chats')
                                .add({
                                    participants: [senderId, receiverId],
                                    messages: [],
                                });
                            // Return the newly created chatId
                            setChatId(newChat.id);
                        } else {
                            // Found an existing chat, return the chatId
                            const cId = chatSnapshot.docs[0].id;
                            setChatId(cId);
                        }
                    } catch (error) {
                        Alert.alert('Error initiating chat', error.message);
                    }
                };

                fetchChatId();
            }
        }, [isFriend, user.id]),
    );

    useEffect(() => {
        const checkIfPlayerIsFriend = async () => {
            try {
                const userDoc = await firestore()
                    .collection('users')
                    .doc(myId)
                    .get();

                if (userDoc.exists) {
                    const {friends} = userDoc.data();

                    if (friends && friends.includes(playerId)) {
                        setIsFriend(true);
                    } else {
                        setIsFriend(false);

                        const requestSnapshot = await firestore()
                            .collection('friendRequests')
                            .where('sender_id', 'in', [myId, playerId])
                            .where('receiver_id', 'in', [myId, playerId])
                            .get();

                        if (!requestSnapshot.empty) {
                            const req = requestSnapshot.docs[0].data();
                            const reqSender =
                                req.sender_id === myId ? myId : playerId;
                            const reqReceiver =
                                req.receiver_id === myId ? myId : playerId;

                            setSender(reqSender);
                            setReceiver(reqReceiver);

                            if (req.sender_id === myId) {
                                setRequestSent(true);
                            }
                        }
                    }
                }

                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                Alert.alert('Error', error.message);
            }
        };

        checkIfPlayerIsFriend();
    }, [myId, playerId]);

    const gotoChat = () => {
        navigation.navigate('ChatScreen', {user, chatId, senderId: myId});
    };

    const handleAcceptFriend = async () => {
        try {
            if (sender && receiver) {
                setReqLoading(true);

                const userRef1 = firestore().collection('users').doc(myId);

                // Update the friends attribute using FieldValue.arrayUnion
                await userRef1.update({
                    friends: firestore.FieldValue.arrayUnion(playerId),
                });

                const userRef2 = firestore().collection('users').doc(playerId);

                // Update the friends attribute using FieldValue.arrayUnion
                await userRef2.update({
                    friends: firestore.FieldValue.arrayUnion(myId),
                });

                const reqSnapshot = await firestore()
                    .collection('friendRequests')
                    .where('sender_id', '==', playerId)
                    .where('receiver_id', '==', myId)
                    .where('status', '==', 'pending')
                    .get();

                await reqSnapshot.docs[0].ref.delete();

                setIsFriend(true);
                setIsAccepted(true);
                setReqLoading(false);

                ToastAndroid.show(
                    `${user.firstName} ${user.lastName} has been added to your friends.`,
                    ToastAndroid.LONG,
                );
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleRemoveRequest = async () => {
        try {
            setReqLoading(true);

            const requestSnapshot = await firestore()
                .collection('friendRequests')
                .where('sender_id', '==', playerId)
                .where('receiver_id', '==', myId)
                .where('status', '==', 'pending')
                .get();

            await requestSnapshot.docs[0].ref.delete();
            setReqLoading(false);

            setIsAccepted(true);

            ToastAndroid.show(`Friend request removed!`, ToastAndroid.SHORT);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const alertProRef = useRef();

    const [removeLoading, setRemoveLoading] = useState(false);

    const removeFriend = async () => {
        try {
            setRemoveLoading(true);
            await firestore()
                .collection('users')
                .doc(playerId)
                .update({
                    friends: firestore.FieldValue.arrayRemove(myId),
                });

            await firestore()
                .collection('users')
                .doc(myId)
                .update({
                    friends: firestore.FieldValue.arrayRemove(playerId),
                });

            setIsFriend(false);
            ToastAndroid.show(
                `You unfriended ${user.firstName} ${user.lastName}`,
                ToastAndroid.TOP,
            );
            setRemoveLoading(false);
            alertProRef.current.close();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const [reqLoading, setReqLoading] = useState(false);

    const handleAddFriend = async () => {
        try {
            if (isFriend) {
                alertProRef.current.open();
            } else {
                setReqLoading(true);

                const requestSnapshot = await firestore()
                    .collection('friendRequests')
                    .where('sender_id', '==', myId)
                    .where('receiver_id', '==', playerId)
                    .where('status', '==', 'pending')
                    .get();

                // If the friend request exists, remove it
                if (requestSent && !requestSnapshot.empty) {
                    await requestSnapshot.docs[0].ref.delete();
                    setReqLoading(false);
                    setRequestSent(false);

                    ToastAndroid.show(
                        `Friend request cancelled`,
                        ToastAndroid.SHORT,
                    );
                } else {
                    // If the friend request doesn't exist, add it
                    await firestore().collection('friendRequests').add({
                        sender_id: myId,
                        receiver_id: playerId,
                        status: 'pending',
                    });

                    setReqLoading(false);

                    setRequestSent(true);

                    ToastAndroid.show(
                        `Friend request sent to ${user.firstName} ${user.lastName}`,
                        ToastAndroid.SHORT,
                    );
                }

                // Toggle requestSent state
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    if (isLoading) {
        return (
            <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size={40} style={{alignSelf: 'center'}} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.topView}>
                    <Avatar
                        rounded
                        source={{uri: user.profilePic}}
                        size="xlarge"
                        containerStyle={styles.avatar}
                    />
                    <Text
                        style={
                            styles.nameText
                        }>{`${user.firstName} ${user.lastName}`}</Text>

                    <Text
                        style={styles.usernameText}>{`@${user.username}`}</Text>
                </View>

                {removeLoading ? (
                    <Modal transparent visible={true} animationType="fade">
                        <View style={styles.modalBackground}>
                            <ActivityIndicator
                                size={50}
                                color={'#28a168'}
                                style={{alignSelf: 'center'}}
                            />
                        </View>
                    </Modal>
                ) : (
                    <AlertPro
                        ref={ref => (alertProRef.current = ref)}
                        onCancel={() => alertProRef.current.close()}
                        onConfirm={removeFriend}
                        title="Remove Friend"
                        message={`Are you sure you want to remove ${user.firstName} ${user.lastName} from your friends?`}
                        textCancel="No"
                        textConfirm="Yes"
                    />
                )}

                <View style={styles.detailsContainer}>
                    <ListItem containerStyle={styles.listTop}>
                        <ListItem.Content>
                            <ListItem.Title style={styles.detailTitle}>
                                About me:
                            </ListItem.Title>
                            <ListItem.Subtitle style={styles.detailText}>
                                {user.bio}
                            </ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                    <Divider width={1} />

                    <ListItem>
                        <Image
                            style={styles.icon}
                            source={require('../Assets/Icons/user.png')}
                        />
                        <ListItem.Content>
                            <ListItem.Title style={styles.detailTitle}>
                                {user.gender}
                            </ListItem.Title>
                            <ListItem.Subtitle style={styles.detailText}>
                                {`${getAge(user.DOB)} years old`}
                            </ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                    <Divider width={1} />

                    <ListItem>
                        <Image
                            style={styles.icon}
                            source={require('../Assets/Icons/location.png')}
                        />
                        <ListItem.Content>
                            <ListItem.Title style={styles.detailTitle}>
                                Lives in:
                            </ListItem.Title>
                            <ListItem.Subtitle style={styles.detailText}>
                                {`${user.area}, ${user.city}`}
                            </ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                    <Divider width={1} />

                    <ListItem>
                        <Image
                            style={styles.icon}
                            source={require('../Assets/Icons/sports.png')}
                        />
                        <ListItem.Content>
                            <ListItem.Title style={styles.detailTitle}>
                                Sports interest:
                            </ListItem.Title>
                            <ListItem.Subtitle style={styles.detailText}>
                                {sportName.join(', ')}
                            </ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                    <Divider width={1} />

                    <ListItem containerStyle={styles.listBottom}>
                        <Image
                            style={styles.icon}
                            source={require('../Assets/Icons/level.png')}
                        />
                        <ListItem.Content>
                            <ListItem.Title style={styles.detailTitle}>
                                Skill Level
                            </ListItem.Title>
                            <ListItem.Subtitle style={styles.detailText}>
                                {user.skillLevel}
                            </ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                    {isFriend ? (
                        <>
                            <Divider width={1} />
                            <ListItem containerStyle={styles.listBottom}>
                                <Image
                                    style={styles.icon}
                                    source={require('../Assets/Icons/phone.png')}
                                />
                                <ListItem.Content>
                                    <ListItem.Title style={styles.detailTitle}>
                                        Contact
                                    </ListItem.Title>
                                    <ListItem.Subtitle
                                        style={styles.detailText}>
                                        {user.phone}
                                    </ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        </>
                    ) : (
                        <></>
                    )}
                </View>

                <View style={styles.requestBtnView}>
                    {!reqLoading ? (
                        receiver == myId && !isAccepted ? (
                            <View
                                style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}>
                                <TouchableOpacity
                                    style={styles.acceptButton}
                                    onPress={handleAcceptFriend}>
                                    <Icons
                                        name="account-check"
                                        size={30}
                                        color="white"
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={handleRemoveRequest}>
                                    <Icons
                                        name="close"
                                        size={30}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[
                                    styles.addButton,
                                    (requestSent || isFriend) &&
                                        styles.sentButton,
                                    isFriend && styles.unfriendButton,
                                ]}
                                onPress={handleAddFriend}>
                                <Icons
                                    name={
                                        requestSent
                                            ? 'account-clock'
                                            : isFriend
                                            ? 'account-remove'
                                            : 'account-plus'
                                    }
                                    size={25}
                                    color="white"
                                />
                                <Text style={styles.addButtonText}>
                                    {requestSent
                                        ? 'Request Sent'
                                        : isFriend
                                        ? 'Unfriend'
                                        : 'Add Friend'}
                                </Text>
                            </TouchableOpacity>
                        )
                    ) : (
                        <View
                            style={{
                                width: 120,
                                height: 65,
                                paddingVertical: 12,
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: 20,
                            }}>
                            <ActivityIndicator size={30} />
                        </View>
                    )}

                    {isFriend ? (
                        <TouchableOpacity
                            style={styles.chatButton}
                            onPress={() => gotoChat()}>
                            <Icons name="chat" size={25} color={'white'} />
                            <Text style={styles.addButtonText}>Chat</Text>
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ViewProfile;
