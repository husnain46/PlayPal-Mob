import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Divider, Icon} from '@rneui/themed';
import getTeamData from '../Functions/getTeamData';
import {Button, Surface, TextInput} from 'react-native-paper';

const StartMatch = ({navigation, route}) => {
    const {match} = route.params;
    const team1 = getTeamData(match.teams.team1);
    const team2 = getTeamData(match.teams.team2);

    const [scoreT1, setScoreT1] = useState(0);
    const [scoreT2, setScoreT2] = useState(0);

    const increaseScore = (score, setScore) => {
        setScore(score + 1);
    };

    const decreaseScore = (score, setScore) => {
        if (score > 0) {
            setScore(score - 1);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleScreen}>Match 1</Text>
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
                            onPress={() => decreaseScore(scoreT1, setScoreT1)}
                        />
                        <Surface style={styles.surface} elevation={4}>
                            <Text style={styles.scoreText}>{scoreT1}</Text>
                        </Surface>
                        <Icon
                            name="add-circle"
                            color={'royalblue'}
                            size={30}
                            type="Icons"
                            onPress={() => increaseScore(scoreT1, setScoreT1)}
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
                            onPress={() => decreaseScore(scoreT2, setScoreT2)}
                        />
                        <Surface style={styles.surface} elevation={4}>
                            <Text style={styles.scoreText}>{scoreT2}</Text>
                        </Surface>
                        <Icon
                            name="add-circle"
                            color={'royalblue'}
                            size={30}
                            type="Icons"
                            onPress={() => increaseScore(scoreT2, setScoreT2)}
                        />
                    </View>
                </View>
            </View>

            <View
                style={{
                    marginTop: 100,
                }}>
                <Button mode="contained" buttonColor="#B95252" onPress={{}}>
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
