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

const ViewTeam = ({navigation, route}) => {
    const {team, sportName} = route.params;
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

    const gotoViewProfile = user => {
        let myId = auth().currentUser.uid;
        setReqModal(false);
        const {id, ...newUser} = user;
        user.id === myId
            ? navigation.navigate('MyProfile', {userData: newUser})
            : navigation.navigate('ViewProfile', {user});
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

                await firestore().collection('notifications').add(notification);

                setReqLoading(false);
                team.playersId.push(uid);

                Toast.show({
                    type: 'success',
                    text1: 'The player is added to your team!',
                });
            } catch (error) {
                setReqLoading(false);
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
                text1: 'Error',
                text2: error.message,
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
                    text1: 'Request deleted!',
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
        const fetchRequests = async () => {
            try {
                setReqLoading(true);
                const reqQuery = await firestore()
                    .collection('teams')
                    .doc(team.teamId)
                    .get();

                if (reqQuery.exists) {
                    const req = reqQuery.data();
                    setTeamRequests(req.requests);
                    setBadgeCount(req.requests.length);
                    const isRequest = req.requests.includes(myId);

                    setRequest(isRequest);
                }
                setReqLoading(false);
            } catch (error) {
                setReqLoading(false);
                Toast.show({
                    type: 'error',
                    text1: 'Requests loading error!',
                    text2: error.message,
                });
            }
        };
        fetchRequests();
    }, [reqModal]);

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
                            }}>
                            <Text style={styles.playerLabel}>
                                {`${num})  ${item.firstName} ${item.lastName}`}
                            </Text>
                            {item.id === team.captainId ? (
                                <Image
                                    source={require('../Assets/Icons/captain.png')}
                                    style={{
                                        width: 25,
                                        height: 25,
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
            <ScrollView contentContainerStyle={{alignItems: 'center'}}>
                <View style={styles.imgView}>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Image
                            source={{uri: team.teamPic}}
                            style={styles.mainImage}
                            resizeMode="stretch"
                        />
                    </TouchableOpacity>
                </View>

                <Modal visible={modalVisible} transparent={true}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(!modalVisible)}
                            style={styles.closeTouchable}>
                            <Text style={styles.closeText}>X</Text>
                        </TouchableOpacity>
                        <Image
                            source={{uri: team.teamPic}}
                            style={{width: '100%', height: 300}}
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
                    visible={reqModal}
                    onRequestClose={() => setReqModal(false)}>
                    <View style={styles.reqModalView}>
                        <View style={styles.reqModalInnerView}>
                            <View
                                style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 24,
                                        flex: 1,
                                        left: 25,
                                        textAlign: 'center',
                                        color: '#4a5a96',
                                        fontWeight: '700',
                                    }}>
                                    Requests
                                </Text>
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
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                textAlign: 'center',
                                                marginTop: 40,
                                            }}>
                                            No requests yet!
                                        </Text>
                                    )}
                                />
                            )}
                        </View>
                    </View>
                </Modal>

                {isCaptain ? (
                    <>
                        <TouchableOpacity
                            style={styles.teamReqBtn}
                            onPress={() => setReqModal(true)}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: 'white',
                                    fontWeight: '600',
                                }}>
                                Team requests
                            </Text>
                            {badgeCount > 0 && (
                                <Badge
                                    status="error"
                                    value={badgeCount}
                                    containerStyle={{
                                        marginRight: -30,
                                        right: 10,
                                        marginBottom: 40,
                                    }}
                                />
                            )}
                        </TouchableOpacity>

                        <Divider
                            style={styles.divider}
                            width={1.5}
                            color="grey"
                        />
                    </>
                ) : (
                    <></>
                )}

                <View style={styles.playersView}>
                    <Text style={styles.playerTitle}>Players:</Text>
                    {isJoined ? (
                        <Button
                            title={'Leave'}
                            icon={() => (
                                <Icon
                                    name="logout"
                                    color={'white'}
                                    size={20}
                                    style={{marginLeft: 5}}
                                />
                            )}
                            iconRight={true}
                            titleStyle={{fontSize: 18, letterSpacing: 1}}
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
        width: '90%',
        marginBottom: 20,
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
        marginRight: 10,
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
        width: 180,
        height: 130,
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
    teamReqBtn: {
        width: 150,
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#4a5a96',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 5,
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
        backgroundColor: '#ccc', // Color for Request Sent button
    },
    listView: {
        alignItems: 'center',
        paddingBottom: 30,
    },
    playerLabel: {
        marginLeft: 5,
        fontSize: 17,
        fontWeight: '700',
        color: 'black',
    },
    playerText: {
        fontSize: 16,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    playersContainer: {
        width: 370,
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
});

export default ViewTeam;
