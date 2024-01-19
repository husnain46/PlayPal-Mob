import React, {useState, useCallback, useEffect, useRef} from 'react';
import {Button} from '@rneui/themed';
import {
    SafeAreaView,
    View,
    ScrollView,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    SectionList,
    ActivityIndicator,
} from 'react-native';
import {Divider, Card, Title} from 'react-native-paper';
import getSportsByIds from '../Functions/getSportsByIds';
import {useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import AlertPro from 'react-native-alert-pro';

const Tournament = ({navigation}) => {
    const myId = auth().currentUser.uid;
    const [loading, setLoading] = useState(true);
    const [myTeam, setMyTeam] = useState(null);
    const alertRefs = useRef([]);

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
                            .where('teamIds', 'array-contains', team.id)
                            .where('status', '!=', 'Ended');

                        const tournamentSnapshot = await tournamentRef.get();
                        const tournaments = [];

                        tournamentSnapshot.forEach(async doc => {
                            const tournamentData = doc.data();
                            const startDate =
                                tournamentData.start_date.toDate();
                            const endDate = tournamentData.end_date.toDate();
                            const currentDate = new Date();

                            // Get the next day by adding 1 day to the currentDate
                            const endDate_next = new Date(endDate);
                            endDate_next.setDate(endDate_next.getDate() + 1);

                            if (
                                endDate >= currentDate &&
                                tournamentData.status !== 'Abandoned'
                            ) {
                                tournaments.push({
                                    id: doc.id,
                                    ...tournamentData,
                                });
                            }

                            if (
                                startDate <= currentDate &&
                                endDate >= currentDate &&
                                tournamentData.status === 'Upcoming'
                            ) {
                                // Update the status to 'Ongoing' if start_date is passed
                                //  and end_date is ahead
                                await firestore()
                                    .collection('tournaments')
                                    .doc(doc.id)
                                    .update({status: 'Ongoing'});
                            } else if (
                                endDate < currentDate &&
                                tournamentData.status !== 'Ended' &&
                                tournamentData.winner !== ''
                            ) {
                                // Update the status to 'Ended' if end_date has passed
                                await firestore()
                                    .collection('tournaments')
                                    .doc(doc.id)
                                    .update({status: 'Ended'});
                            } else if (
                                endDate_next < currentDate &&
                                tournamentData.status !== 'Ended' &&
                                tournamentData.winner === ''
                            ) {
                                await firestore()
                                    .collection('tournaments')
                                    .doc(doc.id)
                                    .update({status: 'Abandoned'});
                            }
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
                    console.log(error);

                    Toast.show({
                        type: 'error',
                        text1: 'An error occurred!',
                        text2: error.message,
                    });
                }
            };

            fetchTeamTournaments();

            return () => {};
        }, []),
    );

    useEffect(() => {
        const fetchMyTeam = async () => {
            const teamRef = firestore().collection('teams');

            const myTeamDoc = await teamRef
                .where('captainId', '==', myId)
                .get();

            if (!myTeamDoc.empty) {
                const teamDoc = myTeamDoc.docs[0].data();
                const name = teamDoc.name;
                const id = myTeamDoc.docs[0].id;
                const mySportId = teamDoc.sportId;
                setMyTeam({id, name, mySportId});
            } else {
                setMyTeam(null);
            }
        };

        fetchMyTeam();
    }, []);

    const sportIcons = {
        Cricket: require('../Assets/Icons/cricket.png'),
        Football: require('../Assets/Icons/football.png'),
        Hockey: require('../Assets/Icons/hockey.png'),
        Basketball: require('../Assets/Icons/basketball.png'),
        Volleyball: require('../Assets/Icons/volleyball.png'),
        Badminton: require('../Assets/Icons/badminton.png'),
        Tennis: require('../Assets/Icons/tennis.png'),
        'Table Tennis': require('../Assets/Icons/tableTennis.png'),
        default: require('../Assets/Icons/no-image.png'),
    };

    const gotoViewTournament = (tournamentId, sportName) => {
        navigation.navigate('ViewTournament', {
            tournamentId,
            sportName,
        });
    };

    const gotoOrganizeTournament = () => {
        if (myTeam === null) {
            alertRefs.current.open();
        } else {
            navigation.navigate('OrganizeTournament', {myTeam});
        }
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
                            <Text style={styles.subtitle}>({sportName}) </Text>
                            <Divider style={styles.divider} />

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
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
                                <Text style={styles.dateText}>End date:</Text>
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
                    <Text style={styles.text1}>My Tournaments</Text>
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
                                            fontSize: 16,
                                            color: 'grey',
                                            textAlign: 'center',
                                        }}>
                                        You are not in a tournament yet!
                                    </Text>
                                )}
                            />
                        )}
                    </View>
                    <Divider style={styles.divider2} />
                </View>

                <AlertPro
                    ref={ref => (alertRefs.current = ref)}
                    title={'Captain Restriction!'}
                    message={
                        'You are not captain of a team, so you cannot organize a tournament!'
                    }
                    onConfirm={() => alertRefs.current.close()}
                    showCancel={false}
                    textConfirm={'Ok'}
                    customStyles={{
                        buttonConfirm: {backgroundColor: '#2bad8b'},
                        container: {
                            borderWidth: 2,
                            borderColor: 'grey',
                            borderRadius: 10,
                        },
                        message: {fontSize: 16},
                    }}
                />

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
                                Organize a tournament as captain of a team!
                            </Text>
                            <Button
                                title="Organize Tournament"
                                titleStyle={{fontSize: 14}}
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
                                titleStyle={{fontSize: 14}}
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
        marginTop: 15,
    },
    text1: {
        fontSize: 20,
        fontWeight: '600',
        color: '#4A5B96',
        fontStyle: 'italic',
    },
    text2: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 40,
    },
    divider2: {
        marginTop: 5,
        width: '100%',
        height: 1,
        backgroundColor: 'grey',
    },
    listView: {
        width: '100%',
        marginTop: 20,
        marginBottom: 10,
    },
    sectionHeaderContainer: {
        marginBottom: 5,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '400',
        color: '#0071bf',
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    cardView1: {
        alignItems: 'center',
    },
    card1: {
        width: '95%',
        alignSelf: 'center',
        marginVertical: 10,
        borderRadius: 15,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'darkgrey',
    },
    cardContent: {
        flexDirection: 'row',
        paddingTop: 7,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 15,
        color: 'grey',
    },
    divider: {
        marginTop: 10,
        width: '100%',
        height: 1,
        backgroundColor: 'grey',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 14,
        color: 'black',
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
        width: 16,
        height: 16,
        marginRight: 15,
    },
    cityText: {
        fontSize: 15,
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
        width: '100%',
        justifyContent: 'center',
    },
    card2: {
        borderRadius: 10,
        elevation: 5,
        width: '45%',
        marginHorizontal: 5,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'darkgrey',
    },
    header: {
        alignItems: 'center',
    },
    detailText: {
        fontSize: 15,
        marginTop: 20,
        marginBottom: 20,
        width: '100%',
        textAlign: 'center',
        color: 'grey',
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
