import React, {useState, useEffect, useCallback, useRef} from 'react';
import styles from '../Styles/viewProfileStyles';
import {
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    Modal,
} from 'react-native';
import {Avatar, Text, ListItem, Divider} from '@rneui/themed';
import getAge from '../Functions/getAge';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import getSportsByIds from '../Functions/getSportsByIds';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';
import AlertPro from 'react-native-alert-pro';
import Toast from 'react-native-toast-message';

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
    const [isInvited, setIsInvited] = useState(false);
    const [isCaptain, setIsCaptain] = useState(false);
    const [myTeam, setMyTeam] = useState({});
    const [isTeamMate, setIsTeamMate] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (isFriend) {
                const fetchChatId = async () => {
                    try {
                        const senderId = auth().currentUser.uid;
                        const receiverId = user.id;

                        const chatSnapshot = await firestore()
                            .collection('chats')
                            .where('participants', 'array-contains', senderId)
                            .get();

                        const chatId = chatSnapshot.docs
                            .filter(doc =>
                                doc.data().participants.includes(receiverId),
                            )
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
                            setChatId(newChat.id);
                        } else {
                            // Found an existing chat, return the chatId
                            setChatId(chatId);
                        }
                    } catch (error) {
                        Toast.show({
                            type: 'error',
                            text1: 'Error initiating chat!',
                            text2: error.message,
                        });
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

                const playerDoc = await firestore()
                    .collection('users')
                    .doc(playerId)
                    .get();

                // check if the current is captain of a team
                const myTeamRef = firestore()
                    .collection('teams')
                    .where('captainId', '==', myId);

                const myTeamDoc = await myTeamRef.get();
                if (myTeamDoc.empty) {
                    setIsCaptain(false);
                } else {
                    setIsCaptain(true);
                }

                // check if player is already in your team
                const teamPlayers = myTeamDoc.docs[0].data().playersId;
                const inTeam = teamPlayers.includes(playerId);
                setIsTeamMate(inTeam);

                const team = {
                    id: myTeamDoc.docs[0].id,
                    name: myTeamDoc.docs[0].data().name,
                };

                setMyTeam(team);

                // check if player is invited
                const isPlayerInvited = playerDoc
                    .data()
                    .teamReq.includes(team.id);

                setIsInvited(isPlayerInvited);

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
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.message,
                });
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

                const notifyRef = await firestore()
                    .collection('notifications')
                    .where('senderId', '==', playerId)
                    .where('receiverId', '==', myId)
                    .where('type', '==', 'friend_request')
                    .get();

                await notifyRef.docs[0].ref.delete();

                setIsFriend(true);
                setIsAccepted(true);
                setReqLoading(false);

                Toast.show({
                    type: 'success',
                    text1: `${user.firstName} ${user.lastName} has been added to your friends.`,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
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

            const notifyRef = await firestore()
                .collection('notifications')
                .where('senderId', '==', playerId)
                .where('receiverId', '==', myId)
                .where('type', '==', 'friend_request')
                .get();

            await notifyRef.docs[0].ref.delete();

            setReqLoading(false);

            setIsAccepted(true);

            Toast.show({
                type: 'info',
                text1: 'Friend request removed!',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
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

            await firestore().collection('chats').doc(chatId).delete();

            setIsFriend(false);

            Toast.show({
                type: 'info',
                text1: `You unfriended ${user.firstName} ${user.lastName}`,
            });

            setRemoveLoading(false);
            alertProRef.current.close();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
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

                    const notifyRef = await firestore()
                        .collection('notifications')
                        .where('senderId', '==', myId)
                        .where('receiverId', '==', playerId)
                        .where('type', '==', 'friend_request')
                        .get();

                    await notifyRef.docs[0].ref.delete();

                    setReqLoading(false);
                    setRequestSent(false);

                    Toast.show({
                        type: 'info',
                        text1: 'Friend request cancelled!',
                    });
                } else {
                    // If the friend request doesn't exist, add it
                    await firestore().collection('friendRequests').add({
                        sender_id: myId,
                        receiver_id: playerId,
                        status: 'pending',
                    });

                    const notification = {
                        senderId: myId,
                        receiverId: playerId,
                        message: 'You have received a friend request from ',
                        type: 'friend_request',
                        read: false,
                    };
                    await firestore()
                        .collection('notifications')
                        .add(notification);

                    setReqLoading(false);
                    setRequestSent(true);

                    Toast.show({
                        type: 'success',
                        text1: `Friend request sent to ${user.firstName} ${user.lastName}`,
                    });
                }
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
        }
    };

    const inviteAlertRef = useRef();

    const handleTeamInvite = async () => {
        try {
            if (isInvited) {
                await firestore()
                    .collection('users')
                    .doc(playerId)
                    .update({
                        teamReq: firestore.FieldValue.arrayRemove(myTeam.id),
                    });

                const notifyRef = await firestore()
                    .collection('notifications')
                    .where('senderId', '==', myId)
                    .where('receiverId', '==', playerId)
                    .where('type', '==', 'team_invite')
                    .get();

                await notifyRef.docs[0].ref.delete();

                Toast.show({
                    type: 'info',
                    text1: 'Team invitation cancelled!',
                });

                setIsInvited(false);
            } else {
                if (isTeamMate) {
                    inviteAlertRef.current.open();
                } else {
                    await firestore()
                        .collection('users')
                        .doc(playerId)
                        .update({
                            teamReq: firestore.FieldValue.arrayUnion(myTeam.id),
                        });

                    const notification = {
                        senderId: myId,
                        receiverId: playerId,
                        message: ` has invited you to join his team ${myTeam.name}`,
                        type: 'team_invite',
                        teamId: myTeam.id,
                        read: false,
                    };
                    await firestore()
                        .collection('notifications')
                        .add(notification);
                    Toast.show({
                        type: 'info',
                        text1: 'Team invitation sent!',
                    });

                    setIsInvited(true);
                }
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
        }
    };

    if (isLoading) {
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={isLoading}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator
                            size="large"
                            color="#0000ff"
                            animating={isLoading}
                        />
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.topView}>
                    <View>
                        <Avatar
                            rounded
                            source={{uri: user.profilePic}}
                            size="xlarge"
                            containerStyle={styles.avatar}
                        />
                    </View>
                    <View style={{marginLeft: 30}}>
                        <Text
                            style={
                                styles.nameText
                            }>{`${user.firstName} ${user.lastName}`}</Text>

                        <Text
                            style={
                                styles.usernameText
                            }>{`@${user.username}`}</Text>

                        <TouchableOpacity
                            style={[
                                !isInvited
                                    ? styles.inviteBtn
                                    : styles.invitedBtn,
                            ]}
                            onPress={() => handleTeamInvite()}>
                            <Text
                                style={[
                                    !isInvited
                                        ? styles.inviteText
                                        : styles.invitedText,
                                ]}>
                                {!isInvited ? 'Invite' : 'Invited'}
                            </Text>

                            {!isInvited ? (
                                <Image
                                    source={require('../Assets/Icons/send.png')}
                                    resizeMode="contain"
                                    style={styles.inviteIcon}
                                />
                            ) : (
                                <Image
                                    source={require('../Assets/Icons/tick.png')}
                                    resizeMode="contain"
                                    style={styles.invitedIcon}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
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
                        customStyles={{
                            buttonConfirm: {backgroundColor: 'red'},
                            buttonCancel: {backgroundColor: '#0084ff'},
                        }}
                    />
                )}

                <AlertPro
                    ref={ref => (inviteAlertRef.current = ref)}
                    onConfirm={() => inviteAlertRef.current.close()}
                    title={''}
                    message={'This player is your team member already!'}
                    showCancel={false}
                    textConfirm="Ok"
                    customStyles={{
                        buttonConfirm: {backgroundColor: '#4a5a96'},
                        message: {marginTop: -30},
                        container: {borderWidth: 2, borderColor: 'lightgrey'},
                    }}
                />

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
