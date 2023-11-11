import React, {useState, useCallback, useEffect} from 'react';
import {Button} from '@rneui/themed';
import {
    SafeAreaView,
    View,
    ScrollView,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ToastAndroid,
    SectionList,
    ActivityIndicator,
} from 'react-native';
import {Divider, Card, Title} from 'react-native-paper';
import getSportsByIds from '../Functions/getSportsByIds';
import {useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Tournament = ({navigation}) => {
    const myId = auth().currentUser.uid;
    const [loading, setLoading] = useState(true);

    const [myTournaments, setMyTournaments] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const fetchTeamTournaments = async () => {
                try {
                    const teamRef = firestore()
                        .collection('teams')
                        .where('playersId', 'array-contains', myId);
                    const teamSnapshot = await teamRef.get();
                    const teamsData = [];

                    teamSnapshot.forEach(doc => {
                        teamsData.push({id: doc.id, teamName: doc.data().name});
                    });

                    const teamTournaments = [];

                    for (const team of teamsData) {
                        const tournamentRef = firestore()
                            .collection('tournaments')
                            .where('teamIds', 'array-contains', team.id);
                        const tournamentSnapshot = await tournamentRef.get();
                        const tournaments = [];

                        tournamentSnapshot.forEach(doc => {
                            tournaments.push({
                                id: doc.id,
                                ...doc.data(),
                            });
                        });

                        if (tournaments.length > 0) {
                            teamTournaments.push({
                                teamName: team.teamName,
                                data: tournaments,
                            });
                        }
                    }

                    setMyTournaments(teamTournaments);
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    ToastAndroid.show(error.message, ToastAndroid.LONG);
                }
            };

            fetchTeamTournaments();

            return () => {};
        }, []),
    );

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

    const gotoViewTournament = (tournamentId, sportName) => {
        navigation.navigate('ViewTournament', {
            tournamentId,
            sportName,
        });
    };

    const gotoOrganizeTournament = () => {
        navigation.navigate('OrganizeTournament');
    };

    const gotoExploreTournament = () => {
        navigation.navigate('ExploreTournament');
    };

    const renderItem = ({item}) => {
        const startDate = item.start_date.toDate().toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
        const endDate = item.end_date.toDate().toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
        const sportName = getSportsByIds([item.sport]);
        const iconPath = sportIcons[sportName] || sportIcons.default;
        return (
            <TouchableOpacity
                onPress={() => gotoViewTournament(item.id, sportName)}>
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
                                <Text style={styles.dateText}>Start date:</Text>
                                <Text style={styles.info1}>
                                    {` ${startDate}`}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text>End date:</Text>
                                <Text
                                    style={styles.info2}>{` ${endDate}`}</Text>
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
                    <Divider style={styles.divider2} />
                    <View style={styles.listView}>
                        {loading ? (
                            <ActivityIndicator
                                style={styles.loader}
                                size="large"
                                color="#4A5B96"
                            />
                        ) : (
                            <SectionList
                                sections={myTournaments}
                                keyExtractor={(item, index) => item + index}
                                renderItem={renderItem}
                                renderSectionHeader={({
                                    section: {teamName},
                                }) => (
                                    <View style={styles.sectionHeaderContainer}>
                                        <Text style={styles.sectionHeader}>
                                            ({teamName})
                                        </Text>
                                    </View>
                                )}
                                scrollEnabled={false}
                                ListEmptyComponent={() => (
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: 'black',
                                            textAlign: 'center',
                                        }}>
                                        No tournament is joined yet!
                                    </Text>
                                )}
                            />
                        )}
                    </View>
                    <Divider style={styles.divider2} />
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
    divider2: {
        marginTop: 10,
        width: '100%',
        height: 1.5,
        backgroundColor: 'grey',
    },
    listView: {
        width: '90%',
        marginTop: 20,
        marginBottom: 10,
    },
    sectionHeaderContainer: {
        marginBottom: 5,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#164c6b',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    cardView1: {
        alignItems: 'center',
    },
    card1: {
        marginVertical: 10,
        borderRadius: 15,
        elevation: 25,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'lightgrey',
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
        height: 1.5,
        backgroundColor: 'grey',
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
        color: 'darkblue',
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
        borderWidth: 2,
        borderColor: 'lightgrey',
    },
    header: {
        alignItems: 'center',
    },
    detailText: {
        fontSize: 15,
        marginTop: 20,
        marginBottom: 20,
        width: 150,
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
