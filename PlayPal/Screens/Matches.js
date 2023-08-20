import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Button, Card, Divider, Icon} from '@rneui/themed';
import getTeamData from '../Functions/getTeamData';

const Matches = ({navigation, route}) => {
    const {data} = route.params;
    const matches = data.matches;

    const gotoAddMatch = () => {
        navigation.navigate('AddMatch', {data});
    };

    const gotoEditMatch = match => {
        navigation.navigate('EditMatch', {
            match,
            teamIds: data.teamIds,
        });
    };

    const gotoStartMatch = () => {};

    const renderItem = ({item, index}) => {
        const team1 = getTeamData(item.teams.team1);
        const team2 = getTeamData(item.teams.team2);
        let matchNum = index + 1;
        return (
            <View style={{marginTop: 35}}>
                <View style={styles.matchHeader}>
                    <Text style={styles.matchText}>Match {matchNum}:</Text>
                    <Icon
                        name="edit"
                        color={'#4a5a96'}
                        size={25}
                        type="Icons"
                        containerStyle={{
                            borderWidth: 1,
                            top: 2,
                        }}
                        onPress={() => gotoEditMatch(item)}
                    />
                </View>
                <Card containerStyle={styles.cardContainer}>
                    <View style={styles.teamsContainer}>
                        <View style={styles.team1View}>
                            <Image
                                source={{uri: team1.teamPic}}
                                style={styles.teamImage}
                            />
                            <Text style={styles.teamName}>{team1.name}</Text>
                        </View>
                        <View style={styles.scoreView}>
                            <Text style={styles.scoreText}>
                                {item.result.scoreTeam1}
                            </Text>
                        </View>
                        <Text style={styles.vsText}>Vs</Text>
                        <View style={styles.scoreView}>
                            <Text style={styles.scoreText}>
                                {item.result.scoreTeam2}
                            </Text>
                        </View>
                        <View style={styles.team1View}>
                            <Image
                                source={{uri: team2.teamPic}}
                                style={styles.teamImage}
                            />
                            <Text style={styles.teamName}>{team2.name}</Text>
                        </View>
                    </View>
                    <Divider style={styles.cardDivider} width={1} />
                    {!item.title ? (
                        <View style={{marginVertical: 5}}></View>
                    ) : (
                        <View style={styles.matchTitleView}>
                            <Text style={styles.matchTitle}>{item.title}</Text>
                        </View>
                    )}
                    <View style={styles.matchDetails}>
                        <Text style={styles.detailText}>Date: {item.date}</Text>
                        <Text style={styles.detailText}>Time: {item.time}</Text>
                    </View>
                    <View style={styles.matchDetails}>
                        <Text style={styles.detailText2}>
                            Venue: {item.venue}
                        </Text>
                        <TouchableOpacity
                            style={styles.startBtn}
                            onPress={() => gotoStartMatch()}>
                            <Text style={styles.startText}>Start</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>
        );
    };
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Matches</Text>
            <Divider style={styles.divider} width={3} color="lightgrey" />
            <Button
                onPress={() => gotoAddMatch()}
                containerStyle={styles.matchBtn}
                color={'#23a889'}
                title={'Add match'}
                titleStyle={styles.btnText}
            />

            <FlatList
                contentContainerStyle={{paddingBottom: 30}}
                data={matches}
                keyExtractor={item => item.matchId}
                renderItem={renderItem}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 26,
        color: '#4a5a96',
        fontWeight: '700',
        marginTop: 30,
    },
    divider: {
        width: '90%',
        marginTop: 10,
    },

    matchBtn: {
        marginTop: 15,
        borderRadius: 10,
        width: 120,
        marginHorizontal: 10,
    },
    btnText: {
        fontSize: 16,
        color: 'white',
    },
    matchHeader: {
        flexDirection: 'row',
        width: 380,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    matchText: {
        fontSize: 20,
        fontWeight: '700',
        paddingHorizontal: 20,
        color: 'black',
    },
    cardContainer: {
        borderRadius: 10,
        elevation: 5,
        marginTop: 15,
        alignSelf: 'center',
        width: '92%',
        backgroundColor: 'white',
    },
    teamsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
    },
    team1View: {
        width: 80,
        alignItems: 'center',
    },
    teamImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    scoreView: {
        width: 80,
        height: 80,
        justifyContent: 'center',
    },
    scoreText: {
        fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'center',
    },
    teamName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
    vsText: {
        fontSize: 14,
        textAlign: 'center',
    },
    cardDivider: {
        marginTop: 10,
        backgroundColor: 'lightgrey',
    },
    matchTitleView: {
        marginVertical: 10,
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    matchTitle: {
        fontSize: 17,
        color: 'darkblue',
        fontWeight: '500',
    },
    matchDetails: {
        marginVertical: 5,
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailText: {
        fontSize: 15,
    },
    detailText2: {
        fontSize: 15,
        width: 230,
    },
    startBtn: {
        width: 80,
        height: 30,
        backgroundColor: '#0d9bb8',
        justifyContent: 'center',
        borderRadius: 5,
    },
    startText: {
        fontSize: 14,
        textAlign: 'center',
        color: 'white',
        letterSpacing: 1,
        bottom: 1,
        fontWeight: '600',
    },
});
export default Matches;
