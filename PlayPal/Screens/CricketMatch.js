import {
    ActivityIndicator,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Divider, Icon} from '@rneui/themed';
import {Button, Surface, TextInput} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import {Dropdown} from 'react-native-element-dropdown';
import AlertPro from 'react-native-alert-pro';

const CricketMatch = ({navigation, route}) => {
    const {match, team1, team2, matchNum, tournamentId} = route.params;
    const [endLoading, setEndLoading] = useState(false);
    const [scoreT1, setScoreT1] = useState(match.result.scoreTeam1);
    const [scoreT2, setScoreT2] = useState(match.result.scoreTeam2);
    const pattern = /^\d+$/;
    const [error1, setError1] = useState('');
    const [error2, setError2] = useState('');
    const [t1Wickets, setT1Wickets] = useState(0);
    const [t2Wickets, setT2Wickets] = useState(0);
    const [selectedWinner, setSelectedWinner] = useState('');
    const [tieModal, setTieModal] = useState(false);
    const [winnerError, setWinnerError] = useState('');
    const [finishLoading, setFinishLoading] = useState(false);

    const alertRefs = useRef([]);

    const teamsList = [
        {
            label: team1.name,
            value: team1.name,
        },
        {
            label: team2.name,
            value: team2.name,
        },
    ];

    const addWicket = (outs, setWickets) => {
        setWickets(outs + 1);
    };

    const removeWicket = (outs, setWickets) => {
        if (outs > 0) {
            setWickets(outs - 1);
        }
    };

    const updateScoreInFirestore = async (team, newScore, teamNum, outs) => {
        if (pattern.test(newScore)) {
            try {
                const tournamentRef = firestore()
                    .collection('tournaments')
                    .doc(tournamentId);
                const tournamentDoc = await tournamentRef.get();

                if (tournamentDoc.exists) {
                    const tournamentData = tournamentDoc.data();

                    const updatedMatches = tournamentData.matches.map(item => {
                        if (
                            item.title === match.title &&
                            item.date.isEqual(match.date) &&
                            item.time.isEqual(match.time)
                        ) {
                            const updatedResult = {
                                scoreTeam1: item.result.scoreTeam1,
                                wicketsT1: item.result.wicketsT1,
                                scoreTeam2: item.result.scoreTeam2,
                                wicketsT2: item.result.wicketsT2,
                            };

                            if (team === item.teams.team1) {
                                updatedResult.scoreTeam1 = newScore;
                                updatedResult.wicketsT1 = outs;
                            } else if (team === item.teams.team2) {
                                updatedResult.scoreTeam2 = newScore;
                                updatedResult.wicketsT2 = outs;
                            }

                            return {
                                title: item.title,
                                date: item.date,
                                time: item.time,
                                teams: {
                                    team1: item.teams.team1,
                                    team2: item.teams.team2,
                                },
                                result: updatedResult,
                                status: item.status,
                            };
                        } else {
                            return item;
                        }
                    });

                    await tournamentRef.update({matches: updatedMatches});
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text2: error.message,
                });
            }
        } else {
            if (teamNum === 1) {
                setError1(`Invalid score! Type numbers only.`);
            } else {
                setError2('Invalid score! Type numbers only.');
            }
        }
    };

    const updateTeamData = async isFinal => {
        try {
            const team1Doc = await firestore()
                .collection('teams')
                .doc(team1.id)
                .get();

            const team2Doc = await firestore()
                .collection('teams')
                .doc(team2.id)
                .get();

            if (team1Doc.exists && team2Doc.exists) {
                let winsT1 = team1Doc.data().wins || 0;
                let drawsT1 = team1Doc.data().draws || 0;
                let lostT1 = team1Doc.data().loses || 0;

                let winsT2 = team2Doc.data().wins || 0;
                let drawsT2 = team2Doc.data().draws || 0;
                let lostT2 = team2Doc.data().loses || 0;

                if (scoreT1 > scoreT2) {
                    winsT1++;
                    lostT2++;
                } else if (scoreT2 > scoreT1) {
                    winsT2++;
                    lostT1++;
                } else if (scoreT1 === scoreT2) {
                    drawsT1++;
                    drawsT2++;
                }

                const batch = firestore().batch();

                batch.update(firestore().collection('teams').doc(team1.id), {
                    wins: winsT1,
                    draws: drawsT1,
                    loses: lostT1,
                });
                batch.update(firestore().collection('teams').doc(team2.id), {
                    wins: winsT2,
                    draws: drawsT2,
                    loses: lostT2,
                });

                let newPoint = 1;
                isFinal ? (newPoint = 5) : (newPoint = 1);

                const updateUsersPoints = async playerIds => {
                    for (const playerId of playerIds) {
                        const userRef = await firestore()
                            .collection('users')
                            .doc(playerId)
                            .get();
                        if (userRef.exists) {
                            const userData = userRef.data();
                            const updatedPoints = userData.points + newPoint;
                            batch.update(userRef.ref, {points: updatedPoints});
                        }
                    }
                };

                const playersIdTeam1 = team1Doc.data().playersId || [];
                const playersIdTeam2 = team2Doc.data().playersId || [];

                await updateUsersPoints(playersIdTeam1);
                await updateUsersPoints(playersIdTeam2);

                await batch.commit();
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'An error occurred!',
            });
        }
    };

    const handleEndMatch = async () => {
        try {
            setEndLoading(true);

            const tournamentRef = firestore()
                .collection('tournaments')
                .doc(tournamentId);

            if (match.title === 'Final') {
                setTieModal(true);

                setEndLoading(false);

                return;
            } else {
                const tournamentDoc = await tournamentRef.get();
                const matchesArray = tournamentDoc.data().matches;

                const updatedStatus = matchesArray.map(item => {
                    if (
                        item.title === match.title &&
                        item.date.isEqual(match.date) &&
                        item.time.isEqual(match.time)
                    ) {
                        let matchStatus;

                        if (scoreT1 > scoreT2) {
                            console.log('1');
                            matchStatus = `${team1.name} won!`;
                        } else if (scoreT2 > scoreT1) {
                            console.log('2');
                            matchStatus = `${team2.name} won!`;
                        } else if (scoreT1 === scoreT2) {
                            matchStatus = `Match drawn!`;
                        }

                        const updatedResult = {
                            scoreTeam1: scoreT1,
                            wicketsT1: t1Wickets,
                            scoreTeam2: scoreT2,
                            wicketsT2: t2Wickets,
                        };

                        return {
                            title: item.title,
                            date: item.date,
                            time: item.time,
                            teams: {
                                team1: item.teams.team1,
                                team2: item.teams.team2,
                            },
                            result: updatedResult,
                            status: matchStatus,
                        };
                    } else {
                        return item;
                    }
                });

                await tournamentRef.update({matches: updatedStatus});
                let isFinal = false;
                await updateTeamData(isFinal);
            }

            setEndLoading(false);
            navigation.goBack();

            Toast.show({
                type: 'success',
                text1: 'Match ended!',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
        }
    };

    const handleFinalWinner = async () => {
        try {
            if (selectedWinner === '') {
                setWinnerError('Please select a winner.');
            } else {
                setFinishLoading(true);

                const tournamentRef = firestore()
                    .collection('tournaments')
                    .doc(tournamentId);

                const tournamentDoc = await tournamentRef.get();
                const matchesArray = tournamentDoc.data().matches;

                const updatedStatus = matchesArray.map(item => {
                    if (
                        item.title === match.title &&
                        item.date.isEqual(match.date) &&
                        item.time.isEqual(match.time)
                    ) {
                        let matchStatus;
                        if (scoreT1 > scoreT2) {
                            matchStatus = `${team1.name} won!`;
                        } else if (scoreT2 > scoreT1) {
                            matchStatus = `${team2.name} won!`;
                        } else if (scoreT1 === scoreT2) {
                            matchStatus = `Scores are level but ${selectedWinner} won on decided rules.`;
                        }

                        const updatedResult = {
                            scoreTeam1: scoreT1,
                            wicketsT1: t1Wickets,
                            scoreTeam2: scoreT2,
                            wicketsT2: t2Wickets,
                        };

                        return {
                            title: item.title,
                            date: item.date,
                            time: item.time,
                            teams: {
                                team1: item.teams.team1,
                                team2: item.teams.team2,
                            },
                            result: updatedResult,
                            status: matchStatus,
                        };
                    } else {
                        return item;
                    }
                });
                let isFinal = true;
                await updateTeamData(isFinal);

                await tournamentRef.update({matches: updatedStatus});
                setFinishLoading(false);

                if (scoreT1 > scoreT2) {
                    await tournamentRef.update({winner: team1.id});
                } else if (scoreT2 > scoreT1) {
                    await tournamentRef.update({winner: team2.id});
                } else if (scoreT1 === scoreT2) {
                    await tournamentRef.update({winner: selectedWinner});
                }

                setTieModal(false);

                navigation.goBack();
            }
        } catch (error) {
            setTieModal(false);

            Toast.show({
                type: 'error',
                text2: 'An error occurred!',
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={{width: '100%'}}
                contentContainerStyle={{alignItems: 'center'}}>
                <Text style={styles.titleScreen}>{`Match ${matchNum}`}</Text>
                <Divider style={styles.divider} width={2} color="grey" />

                <View style={styles.teamView}>
                    <Text style={styles.teamLabel}>{team1.name}:</Text>

                    <View style={styles.scoreView}>
                        <Text style={styles.scoreLabel}>Score:</Text>
                        <View style={styles.subView}>
                            <TextInput
                                value={scoreT1.toString()}
                                selectTextOnFocus={true}
                                onChangeText={text => {
                                    if (text.trim() !== '') {
                                        setScoreT1(parseInt(text.trim()));
                                        setError1('');
                                    } else {
                                        setScoreT1(0);
                                    }
                                }}
                                mode="outlined"
                                style={styles.inputField}
                                inputMode="numeric"
                            />
                        </View>
                    </View>
                    {error1 ? (
                        <Text style={styles.errorText}>{error1}</Text>
                    ) : (
                        <></>
                    )}

                    <View style={styles.wicketsView}>
                        <Text style={styles.wicketLabel}>Wickets:</Text>

                        <View style={styles.counterView}>
                            <Icon
                                name="remove-circle"
                                color={'#c22115'}
                                size={30}
                                type="Icons"
                                onPress={() =>
                                    removeWicket(t1Wickets, setT1Wickets)
                                }
                            />
                            <Surface style={styles.surface} elevation={4}>
                                <Text style={styles.scoreText}>
                                    {t1Wickets}
                                </Text>
                            </Surface>
                            <Icon
                                name="add-circle"
                                color={'royalblue'}
                                size={30}
                                type="Icons"
                                onPress={() =>
                                    addWicket(t1Wickets, setT1Wickets)
                                }
                            />
                        </View>
                    </View>

                    <Button
                        style={styles.updateBtn}
                        contentStyle={{
                            flexDirection: 'row-reverse',
                        }}
                        labelStyle={styles.updateLabel}
                        icon={() => (
                            <Icon
                                name="upload"
                                size={22}
                                color="white"
                                type="Feather"
                            />
                        )}
                        buttonColor="#33b07b"
                        textColor="white"
                        onPress={() =>
                            updateScoreInFirestore(
                                team1.id,
                                scoreT1,
                                1,
                                t1Wickets,
                            )
                        }>
                        Update
                    </Button>
                </View>

                <Modal
                    transparent={true}
                    animationType={'slide'}
                    visible={tieModal}>
                    <View style={styles.reqModalView}>
                        <View style={styles.reqModalInnerView}>
                            <Text style={styles.modelTitle}>
                                Choose a winner
                            </Text>

                            <Divider
                                style={styles.divider}
                                width={1.5}
                                color="grey"
                            />

                            <View style={styles.dropView}>
                                <Text style={styles.dropLabel}>
                                    Select winner team:
                                </Text>
                                <Dropdown
                                    style={styles.dropdown}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    containerStyle={styles.dropContainer}
                                    iconStyle={styles.iconStyle}
                                    data={teamsList}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={'Select team 1'}
                                    value={selectedWinner}
                                    onChange={item =>
                                        setSelectedWinner(item.value)
                                    }
                                />
                                {winnerError !== '' ? (
                                    <Text style={{color: 'red', top: 5}}>
                                        {winnerError}
                                    </Text>
                                ) : (
                                    <></>
                                )}
                            </View>

                            <Button
                                style={styles.finishBtn}
                                mode="contained"
                                buttonColor="red"
                                onPress={() => handleFinalWinner()}>
                                {finishLoading ? (
                                    <ActivityIndicator
                                        color={'white'}
                                        size={'small'}
                                        style={{alignSelf: 'center'}}
                                    />
                                ) : (
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: 'white',
                                            fontWeight: '600',
                                        }}>
                                        Finish
                                    </Text>
                                )}
                            </Button>
                        </View>
                    </View>
                </Modal>

                <AlertPro
                    ref={ref => (alertRefs.current = ref)}
                    title={'End match?'}
                    message={'Are you sure you want to end the match now?'}
                    onCancel={() => alertRefs.current.close()}
                    textCancel={'No'}
                    onConfirm={() => handleEndMatch()}
                    textConfirm={'Yes'}
                    customStyles={{
                        buttonCancel: {backgroundColor: '#00acef'},
                        buttonConfirm: {backgroundColor: '#f53d3d'},
                        container: {borderWidth: 2, borderColor: 'lightgrey'},
                    }}
                />

                <View style={styles.teamView}>
                    <Text style={styles.teamLabel}>{team2.name}:</Text>
                    <View style={styles.scoreView}>
                        <Text style={styles.scoreLabel}>Score:</Text>
                        <View style={styles.subView}>
                            <TextInput
                                value={scoreT2.toString()}
                                selectTextOnFocus={true}
                                onChangeText={text => {
                                    if (text.trim() !== '') {
                                        setScoreT2(parseInt(text.trim()));
                                        setError2('');
                                    } else {
                                        setScoreT2(0);
                                    }
                                }}
                                mode="outlined"
                                style={styles.inputField}
                                inputMode="numeric"
                            />
                        </View>
                    </View>
                    {error2 ? (
                        <Text style={styles.errorText}>{error2}</Text>
                    ) : (
                        <></>
                    )}

                    <View style={styles.wicketsView}>
                        <Text style={styles.wicketLabel}>Wickets:</Text>

                        <View style={styles.counterView}>
                            <Icon
                                name="remove-circle"
                                color={'#c22115'}
                                size={30}
                                type="Icons"
                                onPress={() =>
                                    removeWicket(t2Wickets, setT2Wickets)
                                }
                            />
                            <Surface style={styles.surface} elevation={4}>
                                <Text style={styles.scoreText}>
                                    {t2Wickets}
                                </Text>
                            </Surface>
                            <Icon
                                name="add-circle"
                                color={'royalblue'}
                                size={30}
                                type="Icons"
                                onPress={() =>
                                    addWicket(t2Wickets, setT2Wickets)
                                }
                            />
                        </View>
                    </View>

                    <Button
                        style={styles.updateBtn}
                        contentStyle={{
                            flexDirection: 'row-reverse',
                        }}
                        labelStyle={styles.updateLabel}
                        icon={() => (
                            <Icon
                                name="upload"
                                size={22}
                                color="white"
                                type="Feather"
                            />
                        )}
                        buttonColor="#33b07b"
                        textColor="white"
                        onPress={() =>
                            updateScoreInFirestore(
                                team2.id,
                                scoreT2,
                                2,
                                t2Wickets,
                            )
                        }>
                        Update
                    </Button>
                </View>

                <View
                    style={{
                        marginTop: 30,
                        marginBottom: 30,
                        width: '100%',
                        alignItems: 'center',
                    }}>
                    {endLoading ? (
                        <ActivityIndicator
                            size={'large'}
                            style={{alignSelf: 'center'}}
                        />
                    ) : (
                        <Button
                            mode="contained"
                            buttonColor="red"
                            style={{borderRadius: 12, width: '90%'}}
                            onPress={() => alertRefs.current.open()}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: 'white',
                                    paddingTop: 1,
                                }}>
                                End Match
                            </Text>
                        </Button>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
export default CricketMatch;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    titleScreen: {
        fontSize: 26,
        color: '#4a5a96',
        fontWeight: '700',
        marginTop: 30,
    },
    divider: {
        width: '90%',
        marginTop: 10,
    },
    finishBtn: {
        borderRadius: 12,
        marginTop: 100,
        width: '75%',
        backgroundColor: 'red',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    teamLabel: {
        fontSize: 20,
        fontWeight: '500',
        color: 'black',
    },
    teamView: {
        width: '90%',
        marginTop: 30,
        marginBottom: 10,
    },
    scoreView: {
        marginTop: 30,
        width: '65%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputField: {
        width: 150,
        textAlign: 'center',
        fontSize: 18,
    },
    errorText: {
        fontSize: 14,
        color: 'red',
        textAlign: 'right',
        right: 10,
        top: 8,
    },
    scoreLabel: {
        fontSize: 18,
        fontWeight: '500',
        color: '#03206e',
        top: 2,
    },
    subView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 30,
    },
    wicketsView: {
        marginTop: 30,
        marginBottom: 30,
        flexDirection: 'row',
        alignItems: 'center',
        width: '65%',
        alignSelf: 'center',
        justifyContent: 'space-between',
    },
    wicketLabel: {
        fontSize: 18,
        fontWeight: '500',
        color: '#03206e',
    },
    counterView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
    },
    surface: {
        padding: 8,
        width: 70,
        height: 45,
        borderWidth: 1.5,
        borderColor: 'darkgrey',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        marginHorizontal: 15,
    },
    scoreText: {
        fontSize: 18,
        color: 'black',
    },
    updateBtn: {
        borderRadius: 12,
        width: '50%',
        alignSelf: 'center',
        marginTop: 5,
    },
    updateLabel: {
        fontWeight: '600',
        fontSize: 18,
    },
});
