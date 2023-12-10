import styles from '../Styles/viewTournamentStyles';
import {
    SafeAreaView,
    Text,
    View,
    FlatList,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Dimensions,
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
import LottieView from 'lottie-react-native';
import getSportsByIds from '../Functions/getSportsByIds';

const ViewTournament = ({navigation, route}) => {
    const {tournamentId} = route.params;
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
    const [clashTourName, setClashTourName] = useState(false);
    const sportName = getSportsByIds([data.sport]);

    const [isVisible, setIsVisible] = useState(false);
    const alertRefs = useRef([]);
    const noTeamAlertRef = useRef([]);
    const clashAlertRef = useRef([]);

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
        navigation.navigate('ViewTeam', {team: organizer});
    };

    useFocusEffect(
        useCallback(() => {
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

                        if (
                            tData.winner !== '' &&
                            tData.matches.some(match => match.title === 'Final')
                        ) {
                            setIsVisible(true);
                        }

                        const fetchTeamsData = async () => {
                            try {
                                const teamRef = firestore().collection('teams');

                                const teamDoc = await teamRef
                                    .doc(tData.organizer)
                                    .get();

                                const orgTeam = teamDoc.data();
                                const isCaptain =
                                    myId === teamDoc.data().captainId;
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

                                const promises = tData.teamIds.map(
                                    async tId => {
                                        const docSnapshot = await firestore()
                                            .collection('teams')
                                            .doc(tId)
                                            .get();

                                        if (docSnapshot.exists) {
                                            const newTeamData =
                                                docSnapshot.data();
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
                                    },
                                );

                                const teamDataArray = await Promise.all(
                                    promises,
                                );
                                const teamInfo = teamDataArray.filter(
                                    tData => tData !== null,
                                );

                                // Sort teams by points in descending order
                                const teamsWithPoints = teamInfo.map(team => {
                                    const {wins, losses, draws} =
                                        countMatchesOutcome(
                                            tData.matches,
                                            team.id,
                                        );
                                    const points =
                                        wins * 2 + draws - losses * 2;
                                    return {...team, points};
                                });

                                teamsWithPoints.sort(
                                    (a, b) => b.points - a.points,
                                );

                                // Extract only the sorted teams' data
                                const sortedTeamsData = teamsWithPoints.map(
                                    ({points, ...rest}) => rest,
                                );

                                setTeamsData(sortedTeamsData);
                                setIsLoading(false);
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
        }, [tournamentId]),
    );

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
                    const tournament_ref = await firestore()
                        .collection('tournaments')
                        .where('teamIds', 'array-contains', myTeamId)
                        .get();

                    let hasClash;

                    tournament_ref.docs.forEach(doc => {
                        const startDate = doc.data().start_date.toDate();
                        const endDate = doc.data().end_date.toDate();

                        if (
                            (startDate <= data.start_date.toDate() &&
                                endDate >= data.start_date.toDate()) ||
                            (startDate <= data.end_date.toDate() &&
                                endDate >= data.end_date.toDate()) ||
                            (startDate >= data.start_date.toDate() &&
                                endDate <= data.end_date.toDate())
                        ) {
                            // Clash detected
                            hasClash = true;
                            setClashTourName(doc.data().name);
                            return;
                        }
                    });

                    if (hasClash) {
                        clashAlertRef.current.open();
                    } else {
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
                    }
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

    const countMatchesOutcome = (matches, teamId) => {
        let wins = 0;
        let losses = 0;
        let draws = 0;

        matches.forEach(match => {
            if (match.status !== 'Upcoming' && match.status !== 'Started') {
                const team1 = match.teams.team1;
                const team2 = match.teams.team2;

                if (
                    (team1 === teamId &&
                        match.result.scoreTeam1 > match.result.scoreTeam2) ||
                    (team2 === teamId &&
                        match.result.scoreTeam2 > match.result.scoreTeam1)
                ) {
                    wins++;
                } else if (
                    (team1 === teamId &&
                        match.result.scoreTeam1 < match.result.scoreTeam2) ||
                    (team2 === teamId &&
                        match.result.scoreTeam2 < match.result.scoreTeam1)
                ) {
                    losses++;
                } else if (
                    (team1 === teamId &&
                        match.result.scoreTeam1 === match.result.scoreTeam2) ||
                    (team2 === teamId &&
                        match.result.scoreTeam1 === match.result.scoreTeam2)
                ) {
                    draws++;
                }
            }
        });

        return {wins, losses, draws};
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

        const {wins, losses, draws} = countMatchesOutcome(
            data.matches,
            item.id,
        );

        const points = wins * 2 + draws;

        return (
            <View style={styles.teamCard}>
                <View style={styles.cardSubView}>
                    <Text style={styles.numText}>{`${num})`}</Text>
                    <Text style={styles.teamName}>{item.name}</Text>
                </View>
                <View style={styles.cardSubView2}>
                    <Text style={styles.pointsText}>{wins}</Text>
                </View>

                <View style={styles.cardSubView2}>
                    <Text style={styles.pointsText}>{losses}</Text>
                </View>

                <View style={styles.cardSubView2}>
                    <Text style={styles.pointsText}>{draws}</Text>
                </View>

                <View style={styles.cardSubView3}>
                    <Text style={styles.pointsText2}>{points}</Text>
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

                {data.winner !== '' ? (
                    <></>
                ) : isOrganizer ? (
                    <Button
                        mode="elevated"
                        style={styles.editBtn}
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

                <View style={styles.dateView}>
                    <View style={styles.subView2}>
                        <Text style={styles.dateLabel}>Start:</Text>
                        <Text style={styles.sDateText}>
                            {data.start_date
                                .toDate()
                                .toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                        </Text>
                    </View>
                    <View style={styles.subView2}>
                        <Text style={styles.dateLabel}>End:</Text>
                        <Text style={styles.eDateText}>
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

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isVisible}
                    onRequestClose={() => setIsVisible(false)}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <LottieView
                            source={require('../Assets/Animations/confetti4.json')}
                            autoPlay
                            loop={false}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                            }}
                        />
                        <View
                            style={{
                                backgroundColor: 'white',
                                padding: 10,
                                borderRadius: 10,
                                alignItems: 'center',
                                borderWidth: 1,
                                elevation: 100,
                                width: '65%',
                            }}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: '600',
                                    color: 'darkblue',
                                }}>
                                Winner
                            </Text>

                            <Divider
                                style={{
                                    alignSelf: 'center',
                                    width: '95%',
                                    marginBottom: 20,
                                }}
                                width={1}
                                color="grey"
                            />

                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    marginBottom: 10,
                                    color: '#088d9c',
                                }}>
                                {data.winner}
                            </Text>

                            <Button
                                style={{marginTop: 10}}
                                labelStyle={{textDecorationLine: 'underline'}}
                                onPress={() => setIsVisible(false)}>
                                close
                            </Button>
                        </View>
                    </View>
                </Modal>

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

                <AlertPro
                    ref={ref => (clashAlertRef.current = ref)}
                    title={'Tournament clash!'}
                    message={`There is a clash with ${clashTourName}. You cannot join this tournament right now.`}
                    onConfirm={() => clashAlertRef.current.close()}
                    showCancel={false}
                    textConfirm="Ok"
                    customStyles={{
                        buttonConfirm: {backgroundColor: '#4a5a96'},
                        container: {borderWidth: 2, borderColor: 'lightgrey'},
                    }}
                />

                <View style={styles.cardView}>
                    <Card style={styles.card} mode="contained">
                        <Card.Content style={{marginTop: -5}}>
                            <Text style={styles.organizerLabel}>Organizer</Text>
                            <Divider
                                style={styles.divider2}
                                width={1}
                                color="lightgrey"
                            />

                            <TouchableOpacity onPress={() => gotoViewTeam()}>
                                <Text style={styles.organizer}>
                                    {organizer.name}
                                </Text>
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                    <Card style={styles.card} mode="contained">
                        <Card.Content style={{marginTop: -5}}>
                            <Text style={styles.organizerLabel}>
                                Total Matches
                            </Text>
                            <Divider
                                style={styles.divider2}
                                width={1}
                                color="lightgrey"
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
                                        fontSize: 22,
                                        flex: 1,
                                        left: 25,
                                        textAlign: 'center',
                                        color: '#4a5a96',
                                        fontWeight: '500',
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
                                style={styles.divider3}
                                width={1}
                                color="lightgrey"
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
                                        <Text style={styles.emptyText}>
                                            No requests yet!
                                        </Text>
                                    )}
                                />
                            )}
                        </View>
                    </View>
                </Modal>

                <View style={styles.middleBtnView}>
                    {isOrganizer ? (
                        <>
                            <Button
                                mode="contained"
                                style={styles.reqBtn}
                                icon={'android-messages'}
                                textColor="#374c62"
                                buttonColor="#d3e8f2"
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
                        style={{borderRadius: 12, justifyContent: 'center'}}
                        buttonColor="#f2a72e"
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

export default ViewTournament;
