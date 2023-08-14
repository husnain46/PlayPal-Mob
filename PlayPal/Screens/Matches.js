import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    FlatList,
} from 'react-native';
import React from 'react';
import {Card, Divider} from '@rneui/themed';
import getTeamData from '../Functions/getTeamData';

const Matches = ({route}) => {
    const {matches} = route.params;

    const renderItem = ({item, index}) => {
        const team1 = getTeamData(item.teams.team1);
        const team2 = getTeamData(item.teams.team2);
        let matchNum = index + 1;
        return (
            <View>
                <Text style={styles.matchText}>Match {matchNum}:</Text>
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
                    <View style={styles.matchTitleView}>
                        <Text style={styles.matchTitle}>{item.title}</Text>
                    </View>
                    <View style={styles.matchDetails}>
                        <Text style={styles.detailText}>Date: {item.date}</Text>
                        <Text style={styles.detailText}>Time: {item.time}</Text>
                    </View>
                    <View style={styles.matchDetails}>
                        <Text style={styles.detailText}>
                            Venue: {item.venue}
                        </Text>
                    </View>
                </Card>
            </View>
        );
    };
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleText}>Matches</Text>
            <Divider style={styles.divider} width={3} color="lightgrey" />

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
        fontSize: 28,
        color: '#4a5a96',
        fontWeight: '700',
        marginTop: 30,
    },
    divider: {
        width: '90%',
        marginTop: 10,
    },
    matchText: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'left',
        paddingHorizontal: 20,
        marginTop: 30,
        color: 'black',
    },
    cardContainer: {
        borderRadius: 10,
        elevation: 10,
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
        fontSize: 16,
        textAlign: 'center',
    },
    teamName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
    vsText: {
        fontSize: 15,
        fontWeight: 'bold',
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
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailText: {
        fontSize: 15,
    },
});
export default Matches;
