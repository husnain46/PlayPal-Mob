import styles from '../Styles/viewTeamStyles';
import {
    SafeAreaView,
    Text,
    View,
    Image,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Badge, Button, Divider, Icon} from '@rneui/themed';
import {Card, IconButton, Paragraph} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import AlertPro from 'react-native-alert-pro';
import Toast from 'react-native-toast-message';
import getSportsByIds from '../Functions/getSportsByIds';

const ViewTeam = ({navigation, route}) => {
    const {team} = route.params;
    const playerCount = team.playersId.length;
    const [capName, setCapName] = useState('');
    const [playersData, setPlayersData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [reqModal, setReqModal] = useState(false);
    const [request, setRequest] = useState(false);
    const isCaptain = auth().currentUser.uid === team.captainId;
    const myId = auth().currentUser.uid;
    const [reqUsers, setReqUsers] = useState([]);
    const [teamRequests, setTeamRequests] = useState([]);
    const [reqLoading, setReqLoading] = useState(false);
    const isJoined = team.playersId.includes(myId);
    const [badgeCount, setBadgeCount] = useState(0);
    const isPlayer = team.playersId.includes(myId);
    const [tourModal, setTourModal] = useState(false);
    const [tourLoading, setTourLoading] = useState(false);
    const [playedTournaments, setPlayedTournaments] = useState([]);
    const joinAlertRef = useRef([]);
    const sportName = getSportsByIds([team.sportId]);
    const [isInvited, setIsInvited] = useState(false);
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [inviteCount, setInviteCount] = useState(0);
    const [invitesData, setInvitesData] = useState([]);
    const [inviteModal, setInviteModal] = useState(false);
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteTournaments, setInviteTournaments] = useState([]);
    const totalMatch = team.wins + team.draws + team.loses;

    const currentDate = new Date();

    const gotoViewProfile = user => {
        let myId = auth().currentUser.uid;
        setReqModal(false);
        const {id, ...newUser} = user;
        user.id === myId
            ? navigation.navigate('MyProfile', {user})
            : navigation.navigate('ViewProfile', {user});
    };

    const gotoViewTournament = tournamentId => {
        setTourModal(false);
        setInviteModal(false);
        navigation.navigate('ViewTournament', {
            tournamentId,
        });
    };

    const gotoEditTeam = () => {
        navigation.navigate('EditTeam', {
            myTeam: team,
            playersList: playersData,
        });
    };

    const leaveAlertRef = useRef([]);
    const inviteAlertRef = useRef([]);
    const tourInviteAlert = useRef(null);

    const renderTourInviteAlert = isFull => {
        return (
            <AlertPro
                ref={ref => (tourInviteAlert.current = ref)}
                title={
                    isFull
                        ? 'Tournament is full!'
                        : 'Tournament is already started!'
                }
                message={
                    'You cannot accept the invite for this tournament now.'
                }
                onConfirm={() => tourInviteAlert.current.close()}
                showCancel={false}
                textConfirm="Ok"
                customStyles={{
                    buttonConfirm: {backgroundColor: '#4a5a96'},
                    container: {
                        borderWidth: 2,
                        borderColor: 'darkgrey',
                        borderRadius: 10,
                    },
                }}
            />
        );
    };

    const handleTournamentInvite = async (tour, isFull, isStarted) => {
        if (isFull) {
            tourInviteAlert.current.open();
        } else if (isStarted) {
            tourInviteAlert.current.open();
        } else {
            try {
                setInviteLoading(true);

                const tournament_ref = await firestore()
                    .collection('tournaments')
                    .where('teamIds', 'array-contains', team.teamId)
                    .get();

                let hasClash = false;

                tournament_ref.docs.forEach(doc => {
                    const startDate = doc.data().start_date.toDate();
                    const endDate = doc.data().end_date.toDate();

                    if (
                        (startDate <= tour.start_date.toDate() &&
                            endDate >= tour.start_date.toDate()) ||
                        (startDate <= tour.end_date.toDate() &&
                            endDate >= tour.end_date.toDate()) ||
                        (startDate >= tour.start_date.toDate() &&
                            endDate <= tour.end_date.toDate())
                    ) {
                        // Clash detected
                        hasClash = true;
                        return;
                    }
                });

                if (hasClash) {
                    setInviteLoading(false);
                    Toast.show({
                        type: 'error',
                        text1: 'Clash with another tournament!',
                        text2: 'Cannot accept invite, your team has a clash with this tournament.',
                    });
                } else {
                    await firestore()
                        .collection('tournaments')
                        .doc(tour.id)
                        .update({
                            teamIds: firestore.FieldValue.arrayUnion(
                                team.teamId,
                            ),
                        });

                    await firestore()
                        .collection('teams')
                        .doc(team.teamId)
                        .update({
                            invites: firestore.FieldValue.arrayRemove(tour.id),
                        });

                    const notifyRef = await firestore()
                        .collection('notifications')
                        .where('tourId', '==', tour.id)
                        .where('senderId', '==', tour.organizer)
                        .where('receiverId', '==', myId)
                        .where('type', '==', 'tour_invite')
                        .get();

                    await notifyRef.docs[0].ref.delete();

                    const orgRef = await firestore()
                        .collection('teams')
                        .doc(tour.organizer)
                        .get();

                    if (orgRef.exists) {
                        const notification = {
                            senderId: myId,
                            receiverId: orgRef.data().captainId,
                            message: `${team.name} has accepted your invite to play ${tour.name}`,
                            type: 'tour_accepted',
                            tourId: tour.id,
                            read: false,
                            timestamp: currentDate,
                        };

                        await firestore()
                            .collection('notifications')
                            .add(notification);
                    }
                    setInviteTournaments(prevData =>
                        prevData.filter(data => data.id !== tour.id),
                    );

                    setInviteLoading(false);

                    Toast.show({
                        type: 'success',
                        text2: `Your team is added to ${tour.name}!`,
                    });
                }
            } catch (error) {
                setInviteLoading(false);

                Toast.show({
                    type: 'error',
                    text2: 'An error occurred!',
                });
            }
        }
    };

    const handleRemoveInvite = async tour => {
        try {
            setInviteLoading(true);

            await firestore()
                .collection('teams')
                .doc(team.teamId)
                .update({invites: firestore.FieldValue.arrayRemove(tour.id)});

            // add notification removal here
            const notifyRef = await firestore()
                .collection('notifications')
                .where('tourId', '==', tour.id)
                .where('senderId', '==', tour.organizer)
                .where('receiverId', '==', myId)
                .where('type', '==', 'tour_invite')
                .get();

            await notifyRef.docs[0].ref.delete();

            setInviteTournaments(prevData =>
                prevData.filter(data => data.id !== tour.id),
            );

            setInviteLoading(false);
        } catch (error) {
            setInviteLoading(false);
            Toast.show({
                type: 'error',
                text2: 'An error occurred!',
            });
        }
    };

    const handleTeamInvite = async () => {
        try {
            if (playerCount === team.size) {
                inviteAlertRef.current.open();
            } else {
                setAcceptLoading(true);

                const teamRef = firestore()
                    .collection('teams')
                    .doc(team.teamId);

                const userRef = firestore().collection('users').doc(myId);

                await teamRef.update({
                    playersId: firestore.FieldValue.arrayUnion(myId),
                });

                await userRef.update({
                    teamReq: firestore.FieldValue.arrayRemove(team.teamId),
                });

                const notifyRef = await firestore()
                    .collection('notifications')
                    .where('receiverId', '==', myId)
                    .where('teamId', '==', team.teamId)
                    .where('type', '==', 'team_invite')
                    .get();

                await notifyRef.docs[0].ref.delete();

                navigation.navigate('BottomTab', {screen: 'Team'});

                Toast.show({
                    type: 'success',
                    text1: 'Team invite accepted!',
                    text2: `You have joined ${team.name}.`,
                });

                setAcceptLoading(false);
            }
        } catch (error) {
            setAcceptLoading(false);
            Toast.show({
                type: 'error',
                text2: 'An error occurred!',
            });
        }
    };

    const handleLeaveTeam = async () => {
        try {
            leaveAlertRef.current.close();
            setIsLoading(true);

            await firestore()
                .collection('teams')
                .doc(team.teamId)
                .update({playersId: firestore.FieldValue.arrayRemove(myId)});

            setIsLoading(false);

            navigation.navigate('BottomTab', {screen: 'Team'});
            Toast.show({
                type: 'info',
                text1: `You left ${team.name}!`,
            });
        } catch (error) {
            leaveAlertRef.current.close();
            setIsLoading(false);

            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
        }
    };

    const handleAcceptRequest = async uid => {
        if (playerCount === team.size) {
            alertRefs.current.open();
        } else {
            try {
                setReqLoading(true);

                setReqUsers(prevUsers =>
                    prevUsers.filter(user => user.id !== uid),
                );

                const tournament_ref = await firestore()
                    .collection('tournaments')
                    .where('teamIds', 'array-contains', team.teamId)
                    .get();

                let lockRequest;

                tournament_ref.docs.forEach(doc => {
                    const startDate = doc.data().start_date.toDate();
                    const endDate = doc.data().end_date.toDate();

                    if (startDate <= currentDate && endDate >= currentDate) {
                        // Clash detected
                        lockRequest = true;
                        return;
                    }
                });

                if (lockRequest) {
                    setReqUsers(reqUsers);

                    setReqLoading(false);
                    Toast.show({
                        type: 'error',
                        text2: 'Cannot add players during ongoing tournament',
                    });
                } else {
                    const teamRef = firestore()
                        .collection('teams')
                        .doc(team.teamId);

                    await teamRef.update({
                        playersId: firestore.FieldValue.arrayUnion(uid),
                    });

                    await teamRef.update({
                        requests: firestore.FieldValue.arrayRemove(uid),
                    });

                    const notifyRef = await firestore()
                        .collection('notifications')
                        .where('senderId', '==', uid)
                        .where('receiverId', '==', myId)
                        .where('type', '==', 'team_request')
                        .get();

                    await notifyRef.docs[0].ref.delete();

                    const notification = {
                        senderId: myId,
                        receiverId: uid,
                        message: `Your request to join ${team.name} has been accepted!`,
                        type: 'team_accept_request',
                        read: false,
                        timestamp: currentDate,
                    };

                    await firestore()
                        .collection('notifications')
                        .add(notification);

                    setReqLoading(false);
                    team.playersId.push(uid);

                    Toast.show({
                        type: 'success',
                        text1: 'The player is added to your team!',
                    });
                }
            } catch (error) {
                setReqLoading(false);
                console.log(error);

                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.message,
                });
            }
        }
    };

    const handleRemoveRequest = async uid => {
        try {
            setReqLoading(true);

            setReqUsers(prevUsers => prevUsers.filter(user => user.id !== uid));

            await firestore()
                .collection('teams')
                .doc(team.teamId)
                .update({requests: firestore.FieldValue.arrayRemove(uid)});

            const notifyRef = await firestore()
                .collection('notifications')
                .where('senderId', '==', uid)
                .where('receiverId', '==', myId)
                .where('type', '==', 'team_request')
                .get();

            await notifyRef.docs[0].ref.delete();

            setReqLoading(false);
        } catch (error) {
            setReqLoading(false);
            Toast.show({
                type: 'error',
                text1: 'An error occurred!',
            });
        }
    };

    const alertRefs = useRef([]);

    const handleJoinTeam = async () => {
        if (!request) {
            if (playerCount === team.size) {
                alertRefs.current.open();
            } else {
                try {
                    const checkTeamRef = await firestore()
                        .collection('teams')
                        .where('playersId', 'array-contains', myId)
                        .where('sportId', '==', team.sportId)
                        .get();

                    if (!checkTeamRef.empty) {
                        joinAlertRef.current.open();
                    } else {
                        const teamReq = {
                            requests: firestore.FieldValue.arrayUnion(myId),
                        };
                        await firestore()
                            .collection('teams')
                            .doc(team.teamId)
                            .update(teamReq);

                        const notification = {
                            senderId: myId,
                            receiverId: team.captainId,
                            message: ' has requested to join your team ',
                            type: 'team_request',
                            teamName: team.name,
                            read: false,
                            timestamp: currentDate,
                        };
                        await firestore()
                            .collection('notifications')
                            .add(notification);

                        setRequest(true);

                        Toast.show({
                            type: 'info',
                            text1: 'Request sent!',
                        });
                    }
                } catch (error) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: error.message,
                    });
                }
            }
        } else {
            try {
                await firestore()
                    .collection('teams')
                    .doc(team.teamId)
                    .update({
                        requests: firestore.FieldValue.arrayRemove(myId),
                    });

                const notifyRef = await firestore()
                    .collection('notifications')
                    .where('senderId', '==', myId)
                    .where('receiverId', '==', team.captainId)
                    .where('type', '==', 'team_request')
                    .get();

                await notifyRef.docs[0].ref.delete();

                setRequest(false);

                Toast.show({
                    type: 'info',
                    text1: 'Request cancelled!',
                });
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.message,
                });
            }
        }
    };

    const fetchInvitedTournaments = async () => {
        try {
            setInviteLoading(true);
            setInviteModal(true);
            const currentDate = new Date();

            const fetchedDocs = [];
            if (invitesData.length > 0) {
                for (const tId of invitesData) {
                    const docRef = firestore()
                        .collection('tournaments')
                        .doc(tId);
                    const docSnapshot = await docRef.get();

                    if (docSnapshot.exists) {
                        fetchedDocs.push({
                            id: docSnapshot.id,
                            ...docSnapshot.data(),
                        });
                    }
                }
                setInviteTournaments(fetchedDocs);
                setInviteLoading(false);
            } else {
                setInviteTournaments([]);

                setInviteLoading(false);
            }
        } catch (error) {
            setInviteLoading(false);
            Toast.show({
                type: 'error',
                text2: 'Error loading tournaments!',
            });
        }
    };

    const fetchTournaments = async () => {
        try {
            setTourLoading(true);
            setTourModal(true);
            const currentDate = new Date();

            const tourRef = await firestore()
                .collection('tournaments')
                .where('teamIds', 'array-contains', team.teamId)
                .where('end_date', '<', currentDate)
                .where('status', '==', 'Ended')
                .get();

            if (!tourRef.empty) {
                const tournaments = tourRef.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPlayedTournaments(tournaments);

                setTourLoading(false);
            } else {
                setPlayedTournaments([]);

                setTourLoading(false);
            }
        } catch (error) {
            setTourLoading(false);
            Toast.show({
                type: 'error',
                text2: 'Error loading tournaments!',
            });
        }
    };

    useEffect(() => {
        const fetchReqUsersData = async () => {
            try {
                setReqLoading(true);
                const userPromises = teamRequests.map(async userId => {
                    const userDoc = await firestore()
                        .collection('users')
                        .doc(userId)
                        .get();

                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        userData.id = userId;
                        return userData;
                    }
                });
                const usersData = await Promise.all(userPromises);
                setReqUsers(usersData);

                setReqLoading(false);
            } catch (error) {
                setReqLoading(false);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.message,
                });
            }
        };
        fetchReqUsersData();
    }, [teamRequests]);

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                // Fetch captain data
                const querySnapshot = await firestore()
                    .collection('users')
                    .doc(team.captainId)
                    .get();

                if (!team.playersId.includes(myId)) {
                    const myDataRef = await firestore()
                        .collection('users')
                        .doc(myId)
                        .get();

                    if (myDataRef.exists) {
                        const invite = myDataRef
                            .data()
                            .teamReq.includes(team.teamId);
                        setIsInvited(invite);
                    }
                }

                if (!querySnapshot.empty) {
                    const capData = querySnapshot.data();
                    const captainName = `${capData.firstName} ${capData.lastName}`;
                    setCapName(captainName);
                }

                // Fetch player data
                const promises = team.playersId.map(async pid => {
                    const docSnapshot = await firestore()
                        .collection('users')
                        .doc(pid)
                        .get();

                    if (docSnapshot.exists) {
                        const pData = docSnapshot.data();
                        pData.id = pid;
                        return pData;
                    } else {
                        return null;
                    }
                });

                const playerDataArray = await Promise.all(promises);
                const playerInfo = playerDataArray.filter(
                    playerData => playerData !== null,
                );

                setPlayersData(playerInfo);
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error loading data!',
                    text2: error.message,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeamData();
    }, [teamRequests]);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('teams')
            .doc(team.teamId)
            .onSnapshot(
                snapshot => {
                    if (snapshot.exists) {
                        const data = snapshot.data();
                        setTeamRequests(data.requests);
                        setBadgeCount(data.requests.length);
                        const isRequest = data.requests.includes(myId);

                        setRequest(isRequest);
                        setReqLoading(false);

                        setInviteCount(data.invites.length);
                        setInvitesData(data.invites);
                    }
                },
                error => {
                    Toast.show({
                        type: 'error',
                        text1: 'Requests loading error!',
                        text2: error.message,
                    });
                    setReqLoading(false);
                },
            );

        return () => unsubscribe();
    }, []);

    const renderInvites = ({item, index}) => {
        let num = index + 1;
        const isFull = item.teamIds.length === item.size;
        const isStarted = item.start_date.toDate() <= currentDate;

        return (
            <View style={styles.tourInvitesView}>
                <TouchableOpacity
                    style={styles.tourNameBtn}
                    onPress={() => gotoViewTournament(item.id)}>
                    <Text style={styles.title}>{item.name}</Text>
                </TouchableOpacity>
                <View style={styles.tourInvitesBtnView}>
                    <IconButton
                        icon={'close-thick'}
                        iconColor="red"
                        size={25}
                        onPress={() => handleRemoveInvite(item)}
                    />
                    <Text
                        style={{
                            fontSize: 28,
                            fontWeight: '200',
                            bottom: 3,
                            color: 'grey',
                        }}>
                        |
                    </Text>
                    <IconButton
                        icon={'check-bold'}
                        iconColor="#26a65b"
                        size={25}
                        onPress={() =>
                            handleTournamentInvite(item, isFull, isStarted)
                        }
                    />
                    {renderTourInviteAlert(isFull)}
                </View>
            </View>
        );
    };

    const renderTournaments = ({item, index}) => {
        return (
            <TouchableOpacity
                onPress={() => gotoViewTournament(item.id, sportName)}>
                <Card style={styles.card1}>
                    <Card.Content>
                        <View style={{flexWrap: 'wrap'}}>
                            <Text style={styles.title}>{item.name}</Text>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 10,
                                    alignItems: 'center',
                                    width: '100%',
                                    justifyContent: 'space-between',
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                    <Image
                                        style={styles.locIcon}
                                        source={require('../Assets/Icons/location.png')}
                                    />
                                    <Text style={styles.cityText}>
                                        {item.city}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                    <Image
                                        style={styles.winIcon}
                                        source={require('../Assets/Icons/medal.png')}
                                    />
                                    <Text style={styles.winText}>
                                        {item.city}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    const renderRequests = ({item, index}) => {
        let num = index + 1;
        return (
            <View style={styles.userReqView}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={() => gotoViewProfile(item)}>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}>
                            <Text style={styles.playerLabel}>
                                {`${num})  ${item.firstName} ${item.lastName}`}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <IconButton
                            icon={'close-thick'}
                            iconColor="red"
                            size={28}
                            onPress={() => handleRemoveRequest(item.id)}
                        />
                        <Text style={{fontSize: 25, top: -1}}>|</Text>
                        <IconButton
                            icon={'check-bold'}
                            iconColor="#26a65b"
                            size={28}
                            onPress={() => handleAcceptRequest(item.id)}
                        />
                    </View>
                </View>
            </View>
        );
    };

    const renderItem = ({item, index}) => {
        const num = index + 1;

        return (
            <TouchableOpacity onPress={() => gotoViewProfile(item)}>
                <View style={styles.playersContainer}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <Text style={styles.playerLabel}>
                                {`${num})  ${item.firstName} ${item.lastName}`}
                            </Text>
                            {item.id === team.captainId ? (
                                <Image
                                    source={require('../Assets/Icons/captain.png')}
                                    style={{
                                        width: 22,
                                        height: 22,
                                        marginLeft: 10,
                                    }}
                                />
                            ) : (
                                <></>
                            )}
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 2,
                                marginEnd: 10,
                            }}>
                            <Image
                                style={styles.icon}
                                source={require('../Assets/Icons/level.png')}
                            />
                            <Text style={styles.playerText}>
                                {item.skillLevel}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{alignItems: 'center'}}
                style={{width: '100%'}}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image
                        source={{uri: team.teamPic}}
                        style={styles.mainImage}
                        resizeMode="stretch"
                    />
                </TouchableOpacity>
                <Modal visible={modalVisible} transparent={true}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(!modalVisible)}
                            style={styles.closeTouchable}>
                            <Text style={styles.closeText}>X</Text>
                        </TouchableOpacity>
                        <Image
                            source={{uri: team.teamPic}}
                            style={{width: '100%', height: 400}}
                            resizeMode="contain"
                        />
                    </View>
                </Modal>

                <AlertPro
                    ref={ref => (inviteAlertRef.current = ref)}
                    title={'Team is full!'}
                    message={'You cannot accept the invite right now!'}
                    onConfirm={() => inviteAlertRef.current.close()}
                    showCancel={false}
                    textConfirm="Ok"
                    customStyles={{
                        buttonConfirm: {backgroundColor: '#4a5a96'},
                        container: {
                            borderWidth: 2,
                            borderColor: 'grey',
                            borderRadius: 10,
                        },
                        message: {fontSize: 16},
                    }}
                />

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
                <AlertPro
                    ref={ref => (leaveAlertRef.current = ref)}
                    title={isCaptain ? 'Captain restriction!' : 'Leave Team!'}
                    message={
                        isCaptain
                            ? 'You cannot leave team without assigning some other captain. Change captain in edit team!'
                            : 'Are you sure you want to leave this team?'
                    }
                    onCancel={() => leaveAlertRef.current.close()}
                    textCancel={isCaptain ? 'Ok' : 'No'}
                    showConfirm={isCaptain ? false : true}
                    onConfirm={() => handleLeaveTeam()}
                    textConfirm="Yes"
                    customStyles={{
                        buttonConfirm: {backgroundColor: 'red'},
                        buttonCancel: {backgroundColor: '#64bbde'},
                        container: {borderWidth: 2, borderColor: 'lightgrey'},
                    }}
                />
                <AlertPro
                    ref={ref => (alertRefs.current = ref)}
                    title={'Team is full!'}
                    message={
                        isCaptain
                            ? 'You cannot add more players.'
                            : 'You cannot join this team right now.'
                    }
                    onConfirm={() => alertRefs.current.close()}
                    showCancel={false}
                    textConfirm="Ok"
                    customStyles={{
                        buttonConfirm: {backgroundColor: '#4a5a96'},
                        container: {borderWidth: 2, borderColor: 'lightgrey'},
                    }}
                />
                <AlertPro
                    ref={ref => (joinAlertRef.current = ref)}
                    title=""
                    message={`You are already in a ${sportName} Team! Join some other sports team of your interest.`}
                    onConfirm={() => joinAlertRef.current.close()}
                    showCancel={false}
                    textConfirm="Ok"
                    customStyles={{
                        buttonConfirm: {backgroundColor: '#4a5a96'},
                        container: {borderWidth: 2, borderColor: 'lightgrey'},
                        message: {
                            color: 'black',
                            marginTop: -30,
                            marginBottom: 10,
                        },
                    }}
                />

                <Text style={styles.teamTitle}>{team.name}</Text>
                {isCaptain ? (
                    <IconButton
                        icon="square-edit-outline"
                        iconColor={'black'}
                        size={35}
                        style={styles.editIcon}
                        onPress={() => gotoEditTeam()}
                    />
                ) : (
                    <></>
                )}

                <Divider style={styles.divider} width={1.5} color="grey" />
                <Paragraph style={styles.bio}>{team.description}</Paragraph>

                {isCaptain ? (
                    <View
                        style={{
                            alignSelf: 'center',
                            flexDirection: 'row-reverse',
                            marginTop: 10,
                        }}>
                        <TouchableOpacity
                            style={styles.invitesBtn}
                            onPress={() => fetchInvitedTournaments()}>
                            <Text
                                style={{
                                    fontSize: 17,
                                    color: 'white',
                                    fontWeight: '600',
                                }}>
                                Invites
                            </Text>
                        </TouchableOpacity>
                        {inviteCount > 0 && (
                            <Badge
                                status="error"
                                value={inviteCount}
                                containerStyle={{
                                    position: 'absolute',
                                }}
                            />
                        )}
                    </View>
                ) : (
                    <></>
                )}

                <View style={styles.detailView}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <View style={styles.subView1}>
                            <Text style={styles.detailLabel}>Based in:</Text>
                            <Text
                                style={
                                    styles.detailText
                                }>{`${team.city}`}</Text>
                        </View>

                        <View style={styles.subView1}>
                            <Text style={styles.detailLabel}>Sport:</Text>
                            <Text style={styles.detailText}>{sportName}</Text>
                        </View>
                    </View>
                    <View style={styles.subView2}>
                        <Text style={styles.detailLabel}>Rank:</Text>
                        <Text style={styles.detailText}>{team.rank}</Text>
                    </View>
                </View>

                <View style={styles.cardView}>
                    <Card style={styles.card}>
                        <Card.Content style={{marginTop: -5}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.detailLabel}>Players:</Text>
                                <Text style={styles.detailText}>
                                    {`${playerCount}/${team.size}`}
                                </Text>
                            </View>
                            <View style={{marginTop: 15}}>
                                <Text style={styles.detailLabel}>Captain:</Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: 'black',
                                        top: 5,
                                    }}>
                                    {capName}
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={{flexDirection: 'row', marginTop: -5}}>
                                <Text style={styles.detailLabel}>
                                    Total Matches:
                                </Text>
                                <Text style={styles.detailText}>
                                    {totalMatch}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 5}}>
                                <Text style={styles.detailLabel}>Won:</Text>
                                <Text style={styles.detailText}>
                                    {team.wins}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 5}}>
                                <Text style={styles.detailLabel}>Lost:</Text>
                                <Text style={styles.detailText}>
                                    {team.loses}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 5}}>
                                <Text style={styles.detailLabel}>Draws:</Text>
                                <Text style={styles.detailText}>
                                    {team.draws}
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>
                </View>

                <Modal
                    transparent={true}
                    animationType={'slide'}
                    visible={inviteModal}
                    onRequestClose={() => setInviteModal(false)}>
                    <View style={styles.reqModalView}>
                        <View style={styles.reqModalInnerView}>
                            <View style={styles.modelHeaderView}>
                                <Text style={styles.modelTitle}>Invites</Text>
                                <IconButton
                                    icon="close"
                                    size={30}
                                    style={{alignSelf: 'flex-end'}}
                                    onPress={() => setInviteModal(false)}
                                />
                            </View>
                            <Divider
                                style={styles.divider2}
                                width={1.5}
                                color="grey"
                            />

                            {inviteLoading ? (
                                <View
                                    style={{
                                        height: 450,
                                        justifyContent: 'center',
                                    }}>
                                    <ActivityIndicator size={40} />
                                </View>
                            ) : (
                                <FlatList
                                    data={inviteTournaments}
                                    keyExtractor={item => item.id}
                                    renderItem={renderInvites}
                                    ListEmptyComponent={() => (
                                        <Text style={styles.emptyList}>
                                            No invites yet!
                                        </Text>
                                    )}
                                />
                            )}
                        </View>
                    </View>
                </Modal>

                <Modal
                    transparent={true}
                    animationType={'slide'}
                    visible={tourModal}
                    onRequestClose={() => setTourModal(false)}>
                    <View style={styles.reqModalView}>
                        <View style={styles.reqModalInnerView}>
                            <View style={styles.modelHeaderView}>
                                <Text style={styles.modelTitle}>
                                    Tournaments Played
                                </Text>
                                <IconButton
                                    icon="close"
                                    size={30}
                                    style={{alignSelf: 'flex-end'}}
                                    onPress={() => setTourModal(false)}
                                />
                            </View>
                            <Divider
                                style={styles.divider2}
                                width={1.5}
                                color="grey"
                            />

                            {tourLoading ? (
                                <View
                                    style={{
                                        height: 450,
                                        justifyContent: 'center',
                                    }}>
                                    <ActivityIndicator size={40} />
                                </View>
                            ) : (
                                <FlatList
                                    data={playedTournaments}
                                    keyExtractor={item => item.id}
                                    renderItem={renderTournaments}
                                    ListEmptyComponent={() => (
                                        <Text style={styles.emptyList}>
                                            No tournament played by your team
                                            yet!
                                        </Text>
                                    )}
                                />
                            )}
                        </View>
                    </View>
                </Modal>

                <Modal
                    transparent={true}
                    animationType={'slide'}
                    visible={reqModal}
                    onRequestClose={() => setReqModal(false)}>
                    <View style={styles.reqModalView}>
                        <View style={styles.reqModalInnerView}>
                            <View style={styles.modelHeaderView}>
                                <Text style={styles.modelTitle}>Requests</Text>
                                <IconButton
                                    icon="close"
                                    size={30}
                                    style={{alignSelf: 'flex-end'}}
                                    onPress={() => setReqModal(false)}
                                />
                            </View>
                            <Divider
                                style={styles.divider2}
                                width={1.5}
                                color="grey"
                            />

                            {reqLoading ? (
                                <View
                                    style={{
                                        height: 450,
                                        justifyContent: 'center',
                                    }}>
                                    <ActivityIndicator size={40} />
                                </View>
                            ) : (
                                <FlatList
                                    data={reqUsers}
                                    keyExtractor={item => item.id}
                                    renderItem={renderRequests}
                                    ListEmptyComponent={() => (
                                        <Text style={styles.emptyList}>
                                            No requests yet!
                                        </Text>
                                    )}
                                />
                            )}
                        </View>
                    </View>
                </Modal>

                {isPlayer ? (
                    <View style={styles.teamInfoBtnView}>
                        <TouchableOpacity
                            style={styles.tournamentBtn}
                            onPress={() => fetchTournaments()}>
                            <Text style={styles.tournamentBtnText}>
                                Previous Tournaments
                            </Text>
                        </TouchableOpacity>

                        {isCaptain ? (
                            <TouchableOpacity
                                style={styles.teamReqBtn}
                                onPress={() => setReqModal(true)}>
                                <Text style={styles.teamReqText}>
                                    Team requests
                                </Text>
                                {badgeCount > 0 && (
                                    <Badge
                                        status="error"
                                        value={badgeCount}
                                        containerStyle={styles.badge}
                                    />
                                )}
                            </TouchableOpacity>
                        ) : (
                            <></>
                        )}
                    </View>
                ) : (
                    <></>
                )}
                <Divider style={styles.divider3} width={1.5} color="grey" />
                <View style={styles.playersView}>
                    <Text style={styles.playerTitle}>Players:</Text>

                    {isInvited ? (
                        <Button
                            title={'Accept invite'}
                            icon={() =>
                                acceptLoading ? (
                                    <ActivityIndicator
                                        size={'small'}
                                        color={'white'}
                                        style={{marginLeft: 5}}
                                    />
                                ) : (
                                    <Icon
                                        name="check"
                                        color={'white'}
                                        size={18}
                                        style={{marginLeft: 5}}
                                    />
                                )
                            }
                            iconRight={true}
                            titleStyle={{fontSize: 16}}
                            color={'#52adeb'}
                            containerStyle={styles.acceptBtn}
                            onPress={() => handleTeamInvite()}
                        />
                    ) : isJoined ? (
                        <Button
                            title={'Leave'}
                            icon={() => (
                                <Icon
                                    name="logout"
                                    color={'white'}
                                    size={18}
                                    style={{marginLeft: 5}}
                                />
                            )}
                            iconRight={true}
                            titleStyle={{fontSize: 16, letterSpacing: 0.5}}
                            color={'red'}
                            containerStyle={styles.leaveButton}
                            onPress={() => leaveAlertRef.current.open()}
                        />
                    ) : (
                        <Button
                            title={request ? 'Requested' : 'Join'}
                            icon={() =>
                                request ? (
                                    <Icon
                                        name="check-circle"
                                        type="Feather"
                                        color={'white'}
                                        size={18}
                                        style={{marginLeft: 5}}
                                    />
                                ) : (
                                    <></>
                                )
                            }
                            iconRight={true}
                            titleStyle={{fontSize: 16}}
                            color={request ? 'warning' : '#28b57a'}
                            containerStyle={
                                request
                                    ? styles.requestSentButton
                                    : styles.joinButton
                            }
                            onPress={() => handleJoinTeam()}
                        />
                    )}
                </View>

                <View style={styles.listView}>
                    <FlatList
                        data={playersData}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ViewTeam;
