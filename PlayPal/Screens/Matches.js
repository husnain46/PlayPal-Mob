import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {Button, Divider, Icon} from '@rneui/themed';
import {useFocusEffect} from '@react-navigation/native';
import {IconButton, Card} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import AlertPro from 'react-native-alert-pro';
import Toast from 'react-native-toast-message';

const Matches = ({navigation, route}) => {
    const {data, teamsData, isOrganizer, isCricket, isEnded} = route.params;
    const [matches, setMatches] = useState(data.matches);

    const alertRefs = useRef([]);
    const noTeamAlertRef = useRef([]);

    useFocusEffect(
        useCallback(() => {
            const tournamentRef = firestore()
                .collection('tournaments')
                .doc(data.id);

            const unsubscribe = tournamentRef.onSnapshot(
                snapshot => {
                    if (snapshot.exists) {
                        const matchesData = snapshot.data().matches;

                        setMatches(matchesData);
                    } else {
                        setMatches([]);
                    }
                },
                error => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: error.message,
                    });
                },
            );

            return () => {
                unsubscribe();
            };
        }, [navigation]),
    );

    const gotoAddMatch = () => {
        if (data.teamIds.length < 2) {
            noTeamAlertRef.current.open();
        } else {
            navigation.navigate('AddMatch', {
                data,
                teamsData,
                isCricket,
            });
        }
    };

    const gotoEditMatch = match => {
        navigation.navigate('EditMatch', {
            tournamentId: data.id,
            match,
            teamsData,
        });
    };

    const gotoStartMatch = async (match, matchIndex, team1, team2) => {
        if (match.status === 'Upcoming') {
            alertRefs.current.close();

            const tournamentRef = firestore()
                .collection('tournaments')
                .doc(data.id);

            const tournamentDoc = await tournamentRef.get();
            const matchesArray = tournamentDoc.data().matches;

            matchesArray[matchIndex].status = 'Started';

            await tournamentRef.update({
                matches: matchesArray,
            });

            Toast.show({
                type: 'info',
                text1: 'Match has been started!',
            });
        }

        const matchNum = matchIndex + 1;

        isCricket
            ? navigation.navigate('CricketMatch', {
                  match,
                  team1,
                  team2,
                  matchNum,
                  tournamentId: data.id,
              })
            : navigation.navigate('StartMatch', {
                  match,
                  team1,
                  team2,
                  matchNum,
                  tournamentId: data.id,
              });
    };

    const renderAlert = (item, index, team1, team2) => {
        return (
            <AlertPro
                ref={ref => (alertRefs.current = ref)}
                title={'Start match?'}
                message={'Are you sure you want to start the match now?'}
                onCancel={() => alertRefs.current.close()}
                textCancel={'No'}
                onConfirm={() => gotoStartMatch(item, index, team1, team2)}
                textConfirm={'Yes'}
                customStyles={{
                    buttonConfirm: {backgroundColor: '#2bad8b'},
                    container: {borderWidth: 2, borderColor: 'lightgrey'},
                }}
            />
        );
    };

    const renderItem = ({item, index}) => {
        const t1 = item.teams.team1;
        const t2 = item.teams.team2;

        const team1 = teamsData.find(team => team.teamId === t1);
        const team2 = teamsData.find(team => team.teamId === t2);

        const currentTime = new Date().getTime();
        const matchTime = item.time.toDate().getTime();
        const timeDifference = (matchTime - currentTime) / (1000 * 60);

        let matchNum = index + 1;
        return (
            <View
                style={{
                    marginBottom: 10,
                    width: '90%',
                    alignSelf: 'center',
                }}>
                <View style={styles.headerView}>
                    <Text
                        style={{
                            fontSize: 20,
                            color: 'black',
                            fontWeight: '500',
                        }}>
                        {`Match ${matchNum}:`}
                    </Text>
                    {(isOrganizer && item.status.includes('Upcoming')) ||
                    item.status.includes('Started') ? (
                        <IconButton
                            icon={'square-edit-outline'}
                            size={35}
                            disabled={isEnded}
                            onPress={() => gotoEditMatch(item)}
                            style={{left: 10}}
                        />
                    ) : (
                        <></>
                    )}
                </View>

                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.teamView}>
                            <View style={styles.teamContainer}>
                                <Image
                                    source={{uri: team1.teamPic}}
                                    style={styles.teamImage}
                                />
                                <Text style={styles.teamName}>
                                    {team1.name}
                                </Text>
                            </View>
                            <View style={styles.scoreContainer}>
                                <Text style={styles.scoreText}>
                                    {item.status === 'Upcoming'
                                        ? '-'
                                        : isCricket
                                        ? `${item.result.scoreTeam1}-${item.result.wicketsT1}`
                                        : item.result.scoreTeam1}
                                </Text>
                                <Text style={styles.vsText}>VS</Text>
                                <Text style={styles.scoreText}>
                                    {item.status === 'Upcoming'
                                        ? '-'
                                        : isCricket
                                        ? `${item.result.scoreTeam2}-${item.result.wicketsT2}`
                                        : item.result.scoreTeam2}
                                </Text>
                            </View>
                            <View style={styles.teamContainer}>
                                <Image
                                    source={{uri: team2.teamPic}}
                                    style={styles.teamImage}
                                />
                                <Text style={styles.teamName}>
                                    {team2.name}
                                </Text>
                            </View>
                        </View>

                        <Divider
                            style={styles.cardDivider}
                            width={1}
                            color="grey"
                        />

                        <View style={{alignSelf: 'center', marginBottom: 12}}>
                            <Text style={styles.matchTitle}>
                                ({item.title})
                            </Text>
                        </View>
                        <View style={styles.detailsContainer1}>
                            <Text style={styles.detailText}>
                                Date:{' '}
                                {item.date.toDate().toLocaleDateString('en-GB')}
                            </Text>
                            <Text style={styles.detailText}>
                                Time:{' '}
                                {item.time.toDate().toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                        </View>

                        <View
                            style={[
                                item.status === 'Upcoming' ||
                                item.status === 'Started'
                                    ? styles.detailsContainer2
                                    : styles.detailsContainer3,
                            ]}>
                            <Text
                                style={[
                                    item.status === 'Upcoming' ||
                                    item.status === 'Started'
                                        ? styles.detailText
                                        : styles.resultText,
                                ]}>
                                {item.status}
                            </Text>

                            {isOrganizer && timeDifference <= 10 ? (
                                item.status === 'Upcoming' ||
                                item.status === 'Started' ? (
                                    <Button
                                        disabled={isEnded}
                                        containerStyle={styles.startButton}
                                        mode="contained"
                                        onPress={() => {
                                            item.status.includes('Upcoming')
                                                ? alertRefs.current.open()
                                                : gotoStartMatch(
                                                      item,
                                                      index,
                                                      team1,
                                                      team2,
                                                  );
                                        }}
                                        color="#28b581"
                                        title={
                                            item.status === 'Upcoming'
                                                ? 'Start'
                                                : 'Update'
                                        }
                                        titleStyle={{
                                            fontSize: 17,
                                            margin: -2,
                                        }}
                                    />
                                ) : (
                                    <></>
                                )
                            ) : (
                                <></>
                            )}
                            {renderAlert(item, index, team1, team2)}
                        </View>
                    </Card.Content>
                </Card>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Matches</Text>
            <Divider style={styles.divider} width={1} color="grey" />

            {data.winner !== '' ? (
                <></>
            ) : isOrganizer ? (
                <Button
                    disabled={isEnded}
                    onPress={() => gotoAddMatch()}
                    containerStyle={styles.matchBtn}
                    color={'#3c5885'}
                    title={'Add match'}
                    titleStyle={styles.btnText}
                />
            ) : (
                <></>
            )}

            <AlertPro
                ref={ref => (noTeamAlertRef.current = ref)}
                title={'Not enough teams!'}
                message={'Invite teams to add a new match.'}
                showCancel={false}
                textConfirm="Ok"
                onConfirm={() => noTeamAlertRef.current.close()}
                customStyles={{
                    buttonConfirm: {backgroundColor: '#4a5a96'},
                    container: {borderWidth: 2, borderColor: 'grey'},
                    message: {fontSize: 16},
                }}
            />

            <View style={{width: '100%', marginTop: 10}}>
                <FlatList
                    contentContainerStyle={{paddingBottom: 100}}
                    data={matches}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={() => (
                        <View style={{marginTop: 40}}>
                            <Text style={styles.emptyText}>
                                No match scheduled yet!
                            </Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 24,
        color: '#4a5a96',
        fontWeight: '600',
        marginTop: 20,
    },
    divider: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 5,
        marginBottom: 10,
    },
    matchBtn: {
        marginVertical: 5,
        borderRadius: 10,
        width: 120,
        marginHorizontal: 10,
    },
    btnText: {
        fontSize: 16,
        color: 'white',
    },
    headerView: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    card: {
        width: '100%',
        alignSelf: 'center',
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 12,
        backgroundColor: 'white',
    },
    teamView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
    },
    teamContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        width: '28%',
    },
    teamImage: {
        width: 70,
        height: 70,
        borderRadius: 40,
    },
    teamName: {
        fontSize: 15,
        width: 100,
        textAlign: 'center',
        marginTop: 10,
        color: 'black',
    },
    scoreContainer: {
        flexDirection: 'row',
        width: '48%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: 16,
    },
    scoreText: {
        fontSize: 17,
        fontWeight: '500',
        marginHorizontal: 25,
        color: '#31b571',
    },
    vsText: {
        fontSize: 12,
        color: 'grey',
    },
    cardDivider: {
        alignSelf: 'center',
        width: '100%',
        marginBottom: 10,
    },
    matchTitle: {
        fontSize: 16,
        color: '#154075',
    },
    detailsContainer1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    detailText: {
        fontSize: 15,
        color: 'black',
    },
    resultText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'royalblue',
        textAlign: 'center',
    },
    startButton: {
        width: 80,
        borderRadius: 8,
    },
    detailsContainer2: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailsContainer3: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: 'grey',
        textAlign: 'center',
    },
});

export default Matches;
