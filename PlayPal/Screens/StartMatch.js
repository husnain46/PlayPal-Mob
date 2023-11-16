import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Divider, Icon} from '@rneui/themed';
import {Button, Surface} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

const StartMatch = ({navigation, route}) => {
    const {match, team1, team2, matchNum, tournamentId} = route.params;

    const [scoreT1, setScoreT1] = useState(match.result.scoreTeam1);
    const [scoreT2, setScoreT2] = useState(match.result.scoreTeam2);

    const increaseScore = (team, score, setScore) => {
        setScore(score + 1);
        updateScoreInFirestore(team, score + 1);
    };

    const decreaseScore = (team, score, setScore) => {
        if (score > 0) {
            setScore(score - 1);
            updateScoreInFirestore(team, score - 1);
        }
    };

    const updateScoreInFirestore = async (team, newScore) => {
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
                            scoreTeam2: item.result.scoreTeam2,
                        };

                        if (team === item.teams.team1) {
                            updatedResult.scoreTeam1 = newScore;
                        } else if (team === item.teams.team2) {
                            updatedResult.scoreTeam2 = newScore;
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
    };

    const handleEndMatch = async () => {
        try {
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
                        matchStatus = `Match drawn!`;
                    }
                    return {
                        title: item.title,
                        date: item.date,
                        time: item.time,
                        teams: {
                            team1: item.teams.team1,
                            team2: item.teams.team2,
                        },
                        result: item.result,
                        status: matchStatus,
                    };
                } else {
                    return item;
                }
            });

            await tournamentRef.update({matches: updatedStatus});
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

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleScreen}>{`Match ${matchNum}`}</Text>
            <Divider style={styles.divider} width={2} color="grey" />

            <View style={styles.teamView}>
                <Text style={styles.teamLabel}>{team1.name}:</Text>
                <View style={styles.scoreView}>
                    <Text style={styles.scoreLabel}>Score:</Text>
                    <View style={styles.subView}>
                        <Icon
                            name="remove-circle"
                            color={'#B95252'}
                            size={30}
                            type="Icons"
                            onPress={() =>
                                decreaseScore(team1.id, scoreT1, setScoreT1)
                            }
                        />
                        <Surface style={styles.surface} elevation={4}>
                            <Text style={styles.scoreText}>{scoreT1}</Text>
                        </Surface>
                        <Icon
                            name="add-circle"
                            color={'royalblue'}
                            size={30}
                            type="Icons"
                            onPress={() =>
                                increaseScore(team1.id, scoreT1, setScoreT1)
                            }
                        />
                    </View>
                </View>
            </View>

            <View style={styles.teamView}>
                <Text style={styles.teamLabel}>{team2.name}:</Text>
                <View style={styles.scoreView}>
                    <Text style={styles.scoreLabel}>Score:</Text>
                    <View style={styles.subView}>
                        <Icon
                            name="remove-circle"
                            color={'#B95252'}
                            size={30}
                            type="Icons"
                            onPress={() =>
                                decreaseScore(team2.id, scoreT2, setScoreT2)
                            }
                        />
                        <Surface style={styles.surface} elevation={4}>
                            <Text style={styles.scoreText}>{scoreT2}</Text>
                        </Surface>
                        <Icon
                            name="add-circle"
                            color={'royalblue'}
                            size={30}
                            type="Icons"
                            onPress={() =>
                                increaseScore(team2.id, scoreT2, setScoreT2)
                            }
                        />
                    </View>
                </View>
            </View>

            <View
                style={{
                    marginTop: 100,
                }}>
                <Button
                    mode="contained"
                    buttonColor="#B95252"
                    onPress={() => handleEndMatch()}>
                    <Text
                        style={{
                            fontSize: 18,
                            color: 'white',
                            paddingTop: 1,
                        }}>
                        End Match
                    </Text>
                </Button>
            </View>
        </SafeAreaView>
    );
};
export default StartMatch;

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
    teamLabel: {
        fontSize: 20,
        fontWeight: '500',
        color: 'black',
    },
    teamView: {
        width: '90%',
        height: 130,
        marginTop: 30,
    },
    scoreView: {
        marginTop: 30,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreLabel: {
        fontSize: 18,
        fontWeight: '500',
        color: '#03206e',
    },
    subView: {
        flexDirection: 'row',
        marginLeft: 50,
        alignItems: 'center',
    },
    surface: {
        padding: 8,
        width: 70,
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
});
