import React, {useState} from 'react';
import {Button} from '@rneui/themed';
import {
    SafeAreaView,
    View,
    ScrollView,
    StyleSheet,
    Text,
    Image,
    FlatList,
} from 'react-native';
import {Divider, Card, Title} from 'react-native-paper';
import getMyTeams from '../Functions/getMyTeams';
import getMyTournament from '../Functions/getMyTournament';
import getSportsByIds from '../Functions/getSportsByIds';
import {TouchableOpacity} from 'react-native';

const Tournament = ({navigation}) => {
    const myTeams = getMyTeams('user4');

    const myTournaments = Object.values(getMyTournament(myTeams));

    const gotoViewTournament = (data, sportName, startDate, endDate) => {
        navigation.navigate('ViewTournament', {
            data,
            sportName,
            startDate,
            endDate,
        });
    };

    const getTournamentDates = tournament => {
        const matches = tournament.matches;
        if (matches.length === 0) {
            return {startDate: null, lastDate: null};
        }

        const sortedMatches = matches.sort((a, b) => {
            return a.date.localeCompare(b.date);
        });

        const startDate = sortedMatches[0].date;
        const lastDate = sortedMatches[sortedMatches.length - 1].date;

        return {
            startDate: startDate,
            endDate: lastDate,
        };
    };

    const sportIcons = {
        Cricket: require('../Assets/Icons/cricket.png'),
        Football: require('../Assets/Icons/football.png'),
        Hockey: require('../Assets/Icons/hockey.png'),
        Basketball: require('../Assets/Icons/basketball.png'),
        Volleyball: require('../Assets/Icons/volleyball.png'),
        Badminton: require('../Assets/Icons/badminton.png'),
        Tennis: require('../Assets/Icons/tennis.png'),
        'Table Tennis': require('../Assets/Icons/tableTennis.png'),
        default: require('../Assets/Icons/no image.png'),
    };

    const gotoOrganizeTournament = () => {
        navigation.navigate('OrganizeTournament');
    };

    const gotoExploreTournament = () => {
        navigation.navigate('ExploreTournament');
    };

    const renderItem = ({item}) => {
        const {startDate, endDate} = getTournamentDates(item);
        const sportName = getSportsByIds([item.sport]);
        const iconPath = sportIcons[sportName] || sportIcons.default;
        return (
            <TouchableOpacity
                onPress={() =>
                    gotoViewTournament(item, sportName, startDate, endDate)
                }>
                <Card style={styles.card1}>
                    <Card.Content style={styles.cardContent}>
                        <View style={{flexWrap: 'wrap'}}>
                            <Title style={styles.title}>{item.name}</Title>
                            <Text style={styles.subtitle}> {sportName} </Text>
                            <Divider style={styles.divider} />

                            <View style={{flexDirection: 'row'}}>
                                <Image
                                    style={styles.locIcon}
                                    source={require('../Assets/Icons/location.png')}
                                />
                                <Text style={styles.cityText}>{item.city}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    paddingVertical: 10,
                                }}>
                                <Text style={styles.dateText}>
                                    Start date:{' '}
                                </Text>
                                <Text style={styles.info1}>{startDate} </Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text>End date: </Text>
                                <Text style={styles.info2}>{endDate} </Text>
                            </View>
                        </View>
                        <View style={styles.sportIconView}>
                            <Image
                                style={styles.sportsIcon}
                                source={iconPath}
                            />
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{
                    alignItems: 'center',
                    paddingBottom: 110,
                }}
                style={{width: '100%'}}>
                <View style={styles.yourTeamView}>
                    <Text style={styles.text1}>My tournaments</Text>
                    <Divider
                        style={{marginTop: 10, width: '100%', height: 3}}
                    />
                    <View style={styles.listView}>
                        {myTournaments == '' ? (
                            <Text style={styles.emptyText}>
                                No tournament yet!
                            </Text>
                        ) : (
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={myTournaments}
                                renderItem={renderItem}
                                keyExtractor={myTournaments.tournamentId}
                                scrollEnabled={false}
                            />
                        )}
                    </View>
                    <Divider
                        style={{marginTop: 25, width: '100%', height: 3}}
                    />
                </View>
                <View style={styles.cardView2}>
                    <Card style={styles.card2}>
                        <Card.Content>
                            <View style={styles.header}>
                                <Image
                                    style={styles.icon}
                                    source={require('../Assets/Icons/tournament.png')}
                                />
                            </View>
                            <Text style={styles.detailText}>
                                Organize a tournament if you are captain of a
                                team!
                            </Text>
                            <Button
                                title="Organize Tournament"
                                buttonStyle={styles.button}
                                onPress={() => gotoOrganizeTournament()}
                            />
                        </Card.Content>
                    </Card>

                    <Card style={styles.card2}>
                        <Card.Content>
                            <View style={styles.header}>
                                <Image
                                    style={styles.icon}
                                    source={require('../Assets/Icons/search.png')}
                                />
                            </View>
                            <Text style={styles.detailText}>
                                Explore upcoming and ongoing tournaments!
                            </Text>
                            <Button
                                title="Explore Tournaments"
                                buttonStyle={styles.button}
                                onPress={() => gotoExploreTournament()}
                            />
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    yourTeamView: {
        alignItems: 'center',
        width: '90%',
        marginTop: 20,
    },
    text1: {
        fontSize: 22,
        fontWeight: '700',
        color: '#4A5B96',
    },
    text2: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 40,
    },
    listView: {
        width: '90%',
        marginTop: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    cardView1: {
        alignItems: 'center',
    },
    card1: {
        marginVertical: 10,
        borderRadius: 15,
        elevation: 10,
        backgroundColor: 'white',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 2,
    },
    subtitle: {
        fontSize: 17,
    },
    divider: {
        marginTop: 10,
        width: '101%',
        height: 3,
        marginBottom: 10,
    },
    dateText: {
        fontSize: 14,
    },
    info1: {
        fontSize: 14,
        color: 'green',
    },
    info2: {
        fontSize: 14,
        color: '#fc3003',
    },
    locIcon: {
        width: 20,
        height: 20,
        marginRight: 15,
    },
    cityText: {
        fontSize: 16,
    },
    sportIconView: {
        justifyContent: 'center',
        marginEnd: 10,
    },
    sportsIcon: {
        width: 60,
        height: 60,
    },
    cardView2: {
        flexDirection: 'row',
        marginTop: 30,
    },
    card2: {
        borderRadius: 10,
        elevation: 5,
        width: '44%',
        marginHorizontal: 8,
        backgroundColor: 'white',
    },
    header: {
        alignItems: 'center',
    },
    detailText: {
        fontSize: 15,
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    icon: {
        marginTop: 10,
        height: 40,
        width: 40,
    },
    button: {
        backgroundColor: '#4A5B96',
        borderRadius: 8,
    },
});

export default Tournament;
