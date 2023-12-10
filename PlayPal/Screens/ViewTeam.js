import {
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    Image,
    FlatList,
    Dimensions,
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

    const currentDate = new Date();

    const gotoViewProfile = user => {
        let myId = auth().currentUser.uid;
        setReqModal(false);
        const {id, ...newUser} = user;
        user.id === myId
            ? navigation.navigate('MyProfile', {user})
            : navigation.navigate('ViewProfile', {user});
    };

    const gotoViewTournament = (tournamentId, sportName) => {
        setTourModal(false);
        navigation.navigate('ViewTournament', {
            tournamentId,
            sportName,
        });
    };

    const gotoEditTeam = () => {
        navigation.navigate('EditTeam', {
            myTeam: team,
            playersList: playersData,
        });
    };

    const leaveAlertRef = useRef([]);

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
                        type: 'info',
                        text1: 'Cannot add players during ongoing tournament',
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
            }
        } catch (error) {
            setTourLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Error loading tournaments!',
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
                    } else {
                        return null;
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
                        const req = snapshot.data();
                        setTeamRequests(req.requests);
                        setBadgeCount(req.requests.length);
                        const isRequest = req.requests.includes(myId);

                        setRequest(isRequest);
                        setReqLoading(false);
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
                                    {team.totalMatch}
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
                    {isJoined ? (
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
                            titleStyle={{fontSize: 16, letterSpacing: 1}}
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
                                        size={20}
                                        style={{marginLeft: 5}}
                                    />
                                ) : (
                                    <></>
                                )
                            }
                            iconRight={true}
                            titleStyle={{fontSize: 18, letterSpacing: 1}}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    activityIndicatorWrapper: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    mainImage: {
        width: Dimensions.get('window').width,
        height: 250,
        top: -2,
    },
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeTouchable: {
        position: 'absolute',
        alignItems: 'center',
        top: 30,
        right: 10,
        width: 40,
        height: 30,
    },
    closeText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    teamTitle: {
        fontSize: 24,
        color: '#4a5a96',
        fontWeight: '900',
        textAlign: 'center',
        marginTop: 10,
        width: 250,
    },
    editIcon: {
        width: 40,
        alignSelf: 'flex-end',
        marginTop: -40,
        marginBottom: -10,
        right: 10,
    },
    bio: {
        fontSize: 16.5,
        textAlign: 'center',
        marginTop: 15,
        width: '90%',
    },
    divider: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 10,
    },
    divider2: {
        alignSelf: 'center',
        width: '89%',
        marginBottom: 20,
    },
    divider3: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 15,
    },
    detailView: {
        width: '90%',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
    },
    subView1: {
        flexDirection: 'row',
        padding: 15,
    },
    subView2: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    detailLabel: {
        fontSize: 17,
        color: 'black',
        fontWeight: '700',
        marginRight: 5,
    },
    detailText: {
        fontSize: 17,
        color: 'black',
    },
    cardView: {
        marginTop: 20,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: 'white',
        width: '49%',
    },
    reqModalView: {
        flex: 1,
        justifyContent: 'center',
    },
    reqModalInnerView: {
        width: '90%',
        height: 600,
        borderRadius: 15,
        borderWidth: 1,
        backgroundColor: 'white',
        alignSelf: 'center',
        elevation: 20,
    },
    modelHeaderView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    modelTitle: {
        fontSize: 22,
        flex: 1,
        left: 25,
        textAlign: 'center',
        color: '#4a5a96',
        fontWeight: '700',
    },
    emptyList: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
        paddingHorizontal: 40,
        color: 'grey',
    },
    teamInfoBtnView: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
        width: '100%',
    },
    tournamentBtn: {
        backgroundColor: '#eba421',
        borderRadius: 12,
        height: 40,
        justifyContent: 'center',
    },
    tournamentBtnText: {
        fontSize: 15,
        fontWeight: '500',
        color: 'white',
        paddingHorizontal: 10,
    },
    teamReqBtn: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#4a5a96',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderRadius: 12,
    },
    teamReqText: {
        fontSize: 15,
        color: 'white',
        fontWeight: '600',
        paddingHorizontal: 10,
    },
    badge: {
        marginRight: -30,
        right: 10,
        marginBottom: 40,
    },
    playersView: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
    },
    playerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: 'black',
        textDecorationLine: 'underline',
        letterSpacing: 1,
    },
    leaveButton: {
        borderRadius: 15,
        width: 110,
    },
    joinButton: {
        borderRadius: 15,
        width: 90,
    },
    requestSentButton: {
        borderRadius: 15,
        width: 150,
        backgroundColor: '#ccc',
    },
    listView: {
        width: '100%',
        paddingBottom: 30,
    },
    playerLabel: {
        marginLeft: 5,
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
    },
    playerText: {
        fontSize: 16,
        color: 'grey',
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    playersContainer: {
        width: '92%',
        alignSelf: 'center',
        height: 50,
        marginTop: 20,
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'grey',
        borderRadius: 10,
        padding: 5,
    },
    userReqView: {
        width: '80%',
        alignSelf: 'center',
        height: 50,
        marginTop: 20,
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'grey',
        borderRadius: 10,
        padding: 5,
    },
    card1: {
        marginVertical: 10,
        borderRadius: 15,
        elevation: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'darkgrey',
        width: '85%',
        alignSelf: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        marginLeft: 2,
        color: 'black',
    },
    subtitle: {
        fontSize: 17,
    },
    locIcon: {
        width: 18,
        height: 18,
        marginRight: 10,
    },
    winIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    cityText: {
        fontSize: 16,
        color: 'darkblue',
    },
    winText: {
        fontSize: 16,
        color: '#098f60',
    },
});

export default ViewTeam;
