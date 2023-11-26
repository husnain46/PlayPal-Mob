import {
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    FlatList,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {Badge, Divider} from '@rneui/themed';
import {Button, Card, IconButton, Paragraph} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {useRef} from 'react';
import AlertPro from 'react-native-alert-pro';

const ViewTournament = ({navigation, route}) => {
    const {tournamentId, sportName} = route.params;
    const [data, setData] = useState([]);
    const [teamsData, setTeamsData] = useState([]);
    const [organizer, setOrganizer] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const myId = auth().currentUser.uid;
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [isRequested, setIsRequested] = useState(false);
    const [reqLoading, setReqLoading] = useState(false);
    const [requests, setRequests] = useState([]);
    const [reqModal, setReqModal] = useState(false);
    const [reqTeams, setReqTeams] = useState([]);
    const [teamsCount, setTeamsCount] = useState();
    const [myTeamId, setMyTeamId] = useState(null);
    const [hasJoined, setHasJoined] = useState(false);
    const [isCricket, setIsCricket] = useState(false);
    const [badgeCount, setBadgeCount] = useState(0);
    const [myPlayers, setMyPlayers] = useState([]);
    const [isClash, setIsClash] = useState(false);

    const alertRefs = useRef([]);
    const noTeamAlertRef = useRef([]);

    const gotoEditTournament = () => {
        navigation.navigate('EditTournament', {data, teamsData});
    };

    const gotoMatches = () => {
        navigation.navigate('Matches', {
            data,
            teamsData,
            isOrganizer,
            isCricket,
        });
    };

    const gotoViewTeam = () => {
        navigation.navigate('ViewTeam', {team: organizer, sportName});
    };

    useEffect(() => {
        const tournamentRef = firestore()
            .collection('tournaments')
            .doc(tournamentId);

        const unsubscribe = tournamentRef.onSnapshot(
            snapshot => {
                if (snapshot.exists) {
                    const tData = snapshot.data();
                    tData.id = snapshot.id;
                    const sport = tData.sport === 'sport2';

                    setIsCricket(sport);
                    setData(tData);
                    setTeamsCount(tData.teamIds.length);

                    const fetchTeamsData = async () => {
                        try {
                            const teamRef = firestore().collection('teams');

                            const teamDoc = await teamRef
                                .doc(tData.organizer)
                                .get();

                            const orgTeam = teamDoc.data();
                            const isCaptain = myId === teamDoc.data().captainId;
                            setIsOrganizer(isCaptain);
                            setOrganizer(orgTeam);

                            // requests fetching
                            setBadgeCount(tData.requests.length);

                            setRequests(tData.requests);

                            if (!isCaptain) {
                                const myTeamDoc = await teamRef
                                    .where('captainId', '==', myId)
                                    .get();

                                if (!myTeamDoc.empty) {
                                    const myTeam = myTeamDoc.docs[0].id;
                                    const myTeamPlayers =
                                        myTeamDoc.docs[0].data().playersId;

                                    setMyPlayers(myTeamPlayers);
                                    setMyTeamId(myTeam);

                                    // if requested already by my team
                                    const isRequest =
                                        tData.requests.includes(myTeam);

                                    setIsRequested(isRequest);
                                } else {
                                    setMyTeamId(null);
                                }
                            }

                            let joined = false;

                            const promises = tData.teamIds.map(async tId => {
                                const docSnapshot = await firestore()
                                    .collection('teams')
                                    .doc(tId)
                                    .get();

                                if (docSnapshot.exists) {
                                    const newTeamData = docSnapshot.data();
                                    newTeamData.id = tId;

                                    // getting my team players clashes
                                    const hasCommonId =
                                        newTeamData.playersId.some(id =>
                                            myPlayers.includes(id),
                                        );
                                    setIsClash(hasCommonId);

                                    if (!joined) {
                                        joined =
                                            newTeamData.playersId.includes(
                                                myId,
                                            );
                                        setHasJoined(joined);
                                    }

                                    return newTeamData;
                                } else {
                                    return null;
                                }
                            });

                            const teamDataArray = await Promise.all(promises);
                            const teamInfo = teamDataArray.filter(
                                tData => tData !== null,
                            );
                            setTeamsData(teamInfo);
                            setIsLoading(false); // Move it here
                        } catch (error) {
                            setIsLoading(false);
                            navigation.goBack();
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: error.message,
                            });
                        }
                    };

                    fetchTeamsData();
                } else {
                    setData([]);
                }
            },
            error => {
                setIsLoading(false);

                Toast.show({
                    type: 'error',
                    text1: 'Error fetching data!',
                    text2: error.message,
                });
            },
        );

        return () => {
            unsubscribe();
        };
    }, [tournamentId, navigation]);

    useEffect(() => {
        const fetchReqTeamsData = async () => {
            try {
                setReqLoading(true);
                const teamPromises = requests.map(async teamId => {
                    const teamDoc = await firestore()
                        .collection('teams')
                        .doc(teamId)
                        .get();

                    if (teamDoc.exists) {
                        const tData = teamDoc.data();
                        tData.id = teamId;
                        return tData;
                    } else {
                        return null;
                    }
                });
                const teamsData = await Promise.all(teamPromises);
                setReqTeams(teamsData);

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
        fetchReqTeamsData();
    }, [requests]);

    const handleAcceptRequest = async tId => {
        if (teamsCount === data.size) {
            alertRefs.current.open();
        } else {
            try {
                setReqLoading(true);

                setReqTeams(prevTeams =>
                    prevTeams.filter(team => team.id !== tId),
                );

                const tournamentRef = firestore()
                    .collection('tournaments')
                    .doc(tournamentId);

                await tournamentRef.update({
                    teamIds: firestore.FieldValue.arrayUnion(tId),
                });

                await tournamentRef.update({
                    requests: firestore.FieldValue.arrayRemove(tId),
                });

                setReqLoading(false);

                Toast.show({
                    type: 'success',
                    text1: 'The team is added to your tournament!',
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

    const handleRemoveRequest = async tId => {
        try {
            setReqLoading(true);

            setReqTeams(prevTeams => prevTeams.filter(team => team.id !== tId));

            await firestore()
                .collection('tournaments')
                .doc(tournamentId)
                .update({requests: firestore.FieldValue.arrayRemove(tId)});

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

    const handleJoinRequest = async () => {
        if (!isRequested) {
            if (teamsCount === data.size) {
                alertRefs.current.open();
            } else if (myTeamId === null) {
                noTeamAlertRef.current.open();
            } else if (isClash) {
                // alert for having clash of players in team to avoid joining
                noTeamAlertRef.current.open();
            } else {
                try {
                    const teamReq = {
                        requests: firestore.FieldValue.arrayUnion(myTeamId),
                    };
                    await firestore()
                        .collection('tournaments')
                        .doc(tournamentId)
                        .update(teamReq);

                    setIsRequested(true);

                    Toast.show({
                        type: 'info',
                        text1: 'Request sent!',
                    });
                } catch (error) {
                    Toast.show({
                        type: 'error',
                        text1: 'An error occurred!',
                        text2: error.message,
                    });
                }
            }
        } else {
            try {
                await firestore()
                    .collection('tournaments')
                    .doc(tournamentId)
                    .update({
                        requests: firestore.FieldValue.arrayRemove(myTeamId),
                    });

                setIsRequested(false);

                Toast.show({
                    type: 'info',
                    text1: 'Request deleted!',
                });
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'An error occurred!',
                    text2: error.message,
                });
            }
        }
    };

    const renderRequests = ({item, index}) => {
        let num = index + 1;
        return (
            <View style={styles.teamReqView}>
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
                                {`${num})  ${item.name}`}
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
            <View style={styles.teamCard}>
                <View style={styles.cardSubView}>
                    <Text style={styles.numText}>{`${num})`}</Text>
                    <Text style={styles.teamName}>{item.name}</Text>
                </View>
                <View style={styles.cardSubView2}>
                    <Text style={styles.pointsText}>4</Text>
                </View>

                <View style={styles.cardSubView2}>
                    <Text style={styles.pointsText}>0</Text>
                </View>

                <View style={styles.cardSubView2}>
                    <Text style={styles.pointsText}>1</Text>
                </View>

                <View style={styles.cardSubView3}>
                    <Text style={styles.pointsText2}>4</Text>
                </View>
            </View>
        );
    };

    if (!data || teamsData.length === 0 || isLoading) {
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
            <ScrollView
                contentContainerStyle={{alignItems: 'center'}}
                style={{width: '100%'}}>
                <View style={styles.titleView}>
                    <Text style={styles.teamTitle}>{data.name}</Text>
                    <Paragraph style={styles.bio}>{data.detail}</Paragraph>
                </View>

                <Divider style={styles.divider} width={2} color="grey" />

                {isOrganizer ? (
                    <Button
                        mode="elevated"
                        style={{
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#374c62',
                        }}
                        onPress={() => gotoEditTournament()}>
                        <Text style={{fontSize: 16, color: '#374c62'}}>
                            Edit Tournament
                        </Text>
                    </Button>
                ) : hasJoined ? (
                    <></>
                ) : (
                    <Button
                        icon={isRequested ? 'check-circle' : ''}
                        mode="contained"
                        style={{
                            borderRadius: 12,
                            marginLeft: 15,
                            marginTop: 5,
                        }}
                        buttonColor={isRequested ? '#faad15' : '#28b57a'}
                        onPress={() => handleJoinRequest()}>
                        <Text style={{fontSize: 16, color: 'white'}}>
                            {!isRequested ? 'Join Tournament' : 'Requested'}
                        </Text>
                    </Button>
                )}
                <View style={styles.detailView}>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>Sport:</Text>
                        <Text style={styles.detailText}>{sportName}</Text>
                    </View>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>City:</Text>
                        <Text style={styles.detailText}>{data.city}</Text>
                    </View>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>Venue:</Text>
                        <Text style={styles.detailText}>{data.venue}</Text>
                    </View>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>Location:</Text>
                        <Text style={styles.detailText}>{data.address}</Text>
                    </View>
                </View>

                <View style={styles.detailView}>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>Start:</Text>
                        <Text style={styles.detailText}>
                            {data.start_date
                                .toDate()
                                .toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                        </Text>
                    </View>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>End:</Text>
                        <Text style={styles.detailText}>
                            {data.end_date
                                .toDate()
                                .toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                        </Text>
                    </View>
                </View>

                <AlertPro
                    ref={ref => (alertRefs.current = ref)}
                    title={'Tournament is full!'}
                    message={
                        isOrganizer
                            ? 'You cannot add more Teams.'
                            : 'You cannot join this tournament right now.'
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
                    ref={ref => (noTeamAlertRef.current = ref)}
                    title={isClash ? 'Players Clash!' : 'Not a Captain!'}
                    message={
                        isClash
                            ? 'Some of your team players may have joined this tournament with other teams.'
                            : 'You cannot join any tournament, because you are not captain of any team.'
                    }
                    onConfirm={() => noTeamAlertRef.current.close()}
                    showCancel={false}
                    textConfirm="Ok"
                    customStyles={{
                        buttonConfirm: {backgroundColor: '#4a5a96'},
                        container: {borderWidth: 2, borderColor: 'lightgrey'},
                    }}
                />

                <View style={styles.cardView}>
                    <Card style={styles.card}>
                        <Card.Content style={{marginTop: -5}}>
                            <Text style={styles.organizerLabel}>Organizer</Text>
                            <Divider
                                style={styles.divider2}
                                width={2}
                                color="darkgrey"
                            />

                            <TouchableOpacity onPress={() => gotoViewTeam()}>
                                <Text style={styles.organizer}>
                                    {organizer.name}
                                </Text>
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                    <Card style={styles.card}>
                        <Card.Content style={{marginTop: -5}}>
                            <Text style={styles.organizerLabel}>
                                Total Matches
                            </Text>
                            <Divider
                                style={styles.divider2}
                                width={2}
                                color="darkgrey"
                            />
                            <Text style={styles.totalMatch}>
                                {data.matches.length}
                            </Text>
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
                                    <ActivityIndicator size={40} style={{}} />
                                </View>
                            ) : (
                                <FlatList
                                    data={reqTeams}
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

                <View
                    style={{
                        width: '100%',
                        marginVertical: 25,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                    }}>
                    {isOrganizer ? (
                        <>
                            <Button
                                mode="contained"
                                style={{
                                    borderRadius: 12,
                                    width: 150,
                                    marginRight: 30,
                                }}
                                icon={'android-messages'}
                                textColor="#374c62"
                                buttonColor="#bdd0d9"
                                onPress={() => setReqModal(true)}>
                                <Text style={{fontSize: 16, color: '#374c62'}}>
                                    Requests
                                </Text>
                            </Button>

                            {badgeCount > 0 && (
                                <Badge
                                    status="error"
                                    value={badgeCount}
                                    containerStyle={{
                                        position: 'absolute',
                                        flexDirection: 'row-reverse',
                                    }}
                                />
                            )}
                        </>
                    ) : (
                        <></>
                    )}
                    <Button
                        mode="contained"
                        style={{borderRadius: 12}}
                        buttonColor="#247091"
                        onPress={() => gotoMatches()}>
                        <Text style={{fontSize: 16, color: 'white'}}>
                            View matches
                        </Text>
                    </Button>
                </View>

                <Text style={styles.tableTitle}>Team Standings</Text>

                <View style={styles.tableHeader}>
                    <View style={styles.headerView1}>
                        <Text style={styles.headerText}>Teams</Text>
                    </View>
                    <View style={styles.headerView2}>
                        <Text style={styles.headerText}>W</Text>
                    </View>

                    <View style={styles.headerView2}>
                        <Text style={styles.headerText}>L</Text>
                    </View>

                    <View style={styles.headerView2}>
                        <Text style={styles.headerText}>D</Text>
                    </View>

                    <View>
                        <Text style={styles.headerText}>Points</Text>
                    </View>
                </View>

                <FlatList
                    data={teamsData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    contentContainerStyle={{paddingBottom: 20}}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
    titleView: {
        marginTop: 15,
    },
    teamTitle: {
        fontSize: 24,
        color: '#4a5a96',
        fontWeight: '900',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 25,
    },
    bio: {
        fontSize: 17,
        textAlign: 'center',
        marginTop: 25,
        paddingHorizontal: 20,
    },
    divider: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 10,
        marginBottom: 10,
    },
    detailView: {
        width: '90%',
        justifyContent: 'space-between',
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        borderWidth: 1.5,
        borderColor: 'darkgrey',
        flexWrap: 'wrap',
    },
    subView: {
        flexDirection: 'row',
        margin: 10,
        marginHorizontal: 15,
        flexWrap: 'wrap',
    },
    detailLabel: {
        fontSize: 17,
        color: 'black',
        fontWeight: '700',
        marginRight: 10,
    },
    detailText: {
        fontSize: 16.5,
        color: 'black',
    },
    organizerLabel: {
        fontSize: 18,
        color: 'black',
        fontWeight: '600',
        textAlign: 'center',
    },
    divider2: {
        alignSelf: 'center',
        width: '100%',
        marginTop: 5,
    },
    organizer: {
        fontSize: 18,
        paddingVertical: 15,
        color: '#4a5a96',
        textDecorationLine: 'underline',
        fontWeight: '500',
        textAlign: 'center',
    },
    totalMatch: {
        fontSize: 24,
        paddingVertical: 15,
        color: '#4a5a96',
        fontWeight: '500',
        textAlign: 'center',
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
        height: 110,
        borderWidth: 1.5,
        borderColor: 'darkgrey',
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
    playerLabel: {
        marginLeft: 5,
        fontSize: 17,
        fontWeight: '700',
        color: 'black',
    },
    teamReqView: {
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
    tableTitle: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: '700',
        color: 'black',
        textDecorationLine: 'underline',
        letterSpacing: 0.5,
    },
    tableHeader: {
        width: '90%',
        height: 50,
        justifyContent: 'space-between',
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#567595',
        elevation: 5,
    },
    headerView1: {
        width: '40%',
        left: 30,
    },
    headerView2: {
        right: -4,
    },
    headerText: {
        fontSize: 17,
        color: 'white',
        fontWeight: '700',
        marginRight: 10,
    },
    teamCard: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'lightgrey',
        marginBottom: 10,
        height: 55,
        alignSelf: 'center',
        alignItems: 'center',
        width: '94%',
        justifyContent: 'space-around',
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
    },
    cardSubView: {
        flexDirection: 'row',
        width: 155,
        marginRight: 10,
    },
    cardSubView2: {
        width: '7%',
        marginRight: 20,
        alignItems: 'center',
    },
    cardSubView3: {
        width: 25,
        marginLeft: 15,
        marginRight: 17,
    },
    numText: {
        fontSize: 17,
        color: 'black',
        left: 5,
    },
    teamName: {
        fontSize: 17,
        color: 'black',
        paddingHorizontal: 15,
    },
    pointsText: {
        fontSize: 17,
        color: 'green',
    },
    pointsText2: {
        fontSize: 17,
        color: 'blue',
    },
});

export default ViewTournament;
