import React, {useCallback, useRef, useState} from 'react';
import {Button, Card} from '@rneui/themed';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import {Divider, Title} from 'react-native-paper';
import getSportsByIds from '../Functions/getSportsByIds';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';
import AlertPro from 'react-native-alert-pro';
import Toast from 'react-native-toast-message';

const Team = ({navigation}) => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myTeamSports, setMyTeamSports] = useState([]);
    const myId = auth().currentUser.uid;
    const alertRefs = useRef([]);

    const gotoCreateTeam = () => {
        const isCaptain = teams.some(team => team.captainId === myId);

        if (isCaptain) {
            alertRefs.current.open();
        } else {
            navigation.navigate('CreateTeam', {myTeamSports});
        }
    };

    const gotoViewTeam = (team, sportName) => {
        navigation.navigate('ViewTeam', {team});
    };

    const gotoJoinTeam = () => {
        navigation.navigate('JoinTeam');
    };

    useFocusEffect(
        useCallback(() => {
            const fetchMyTeams = async () => {
                try {
                    let playerId = auth().currentUser.uid;
                    const fetchedTeams = [];
                    const mySportsIds = [];

                    const querySnapshot = await firestore()
                        .collection('teams')
                        .where('playersId', 'array-contains', playerId)
                        .get();

                    if (querySnapshot.empty) {
                        // No team found with the given playerId
                        setLoading(false);
                        setTeams([]);
                    } else {
                        // Extract team data from the query result
                        querySnapshot.forEach(async doc => {
                            let newRank = 'Freshies'; // Initialize rank

                            const wins = doc.data().wins;

                            if (wins >= 10 && wins < 20) {
                                newRank = 'Emerging';
                            } else if (wins >= 20) {
                                newRank = 'Champions';
                            }

                            if (newRank !== 'Freshies') {
                                const team = {
                                    teamId: doc.id,
                                    ...doc.data(),
                                    rank: newRank,
                                };

                                // Update rank in Firestore document
                                await firestore()
                                    .collection('teams')
                                    .doc(doc.id)
                                    .update({rank: newRank});

                                mySportsIds.push(doc.data().sportId);
                                fetchedTeams.push(team);
                            } else {
                                const team = {
                                    teamId: doc.id,
                                    ...doc.data(),
                                };

                                mySportsIds.push(doc.data().sportId);
                                fetchedTeams.push(team);
                            }
                        });

                        setTeams(fetchedTeams);
                        setMyTeamSports(mySportsIds);
                        setLoading(false);
                    }
                } catch (error) {
                    setLoading(false);
                    Toast.show({
                        type: 'error',
                        text2: 'Error loading teams!',
                    });
                }
            };
            fetchMyTeams();
        }, []),
    );

    const renderItem = ({item}) => {
        const sportName = getSportsByIds([item.sportId]);

        const playerCount = item.playersId.length;

        return (
            <TouchableOpacity onPress={() => gotoViewTeam(item, sportName)}>
                <Card containerStyle={styles.card}>
                    <Card.Image
                        style={styles.cardImage}
                        source={{uri: item.teamPic}}
                        resizeMode="stretch"
                    />
                    <View style={styles.content}>
                        <Title style={styles.cardTitle}>{item.name}</Title>
                        <Divider style={{height: 1, backgroundColor: 'grey'}} />
                        <View style={styles.cardSubView}>
                            <View style={styles.cardDetailView}>
                                <Text style={styles.cardLabel}>Sport:</Text>
                                <Text style={styles.cardText}>{sportName}</Text>
                            </View>
                            <View style={styles.cardDetailView}>
                                <Text style={styles.cardLabel}>Players:</Text>
                                <Text style={styles.cardText}>
                                    {`${playerCount}/${item.size}`}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.cardDetailView}>
                            <Text style={styles.rankText}>({item.rank})</Text>
                        </View>
                    </View>
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
                    <Text style={styles.text1}>My Teams</Text>
                    <Divider style={styles.divider} />
                    <View style={styles.listView}>
                        {loading ? (
                            <ActivityIndicator
                                style={styles.loader}
                                size="large"
                                color="#4A5B96"
                            />
                        ) : (
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={teams}
                                renderItem={renderItem}
                                keyExtractor={item => item.teamId}
                                contentContainerStyle={{paddingBottom: 10}}
                                scrollEnabled={false}
                                ListEmptyComponent={() => (
                                    <Text style={styles.text2}>
                                        You are not in a team yet!
                                    </Text>
                                )}
                            />
                        )}
                    </View>
                    <Divider style={styles.divider} />
                </View>

                <AlertPro
                    ref={ref => (alertRefs.current = ref)}
                    title={'Captain Restriction!'}
                    message={
                        'You cannot create another team if you are captain of a team already.'
                    }
                    onConfirm={() => alertRefs.current.close()}
                    showCancel={false}
                    textConfirm={'Ok'}
                    customStyles={{
                        buttonConfirm: {backgroundColor: '#2bad8b'},
                        container: {borderWidth: 2, borderColor: 'lightgrey'},
                    }}
                />

                <Card containerStyle={styles.card2}>
                    <View style={styles.header}>
                        <Text style={styles.text1}>Create team</Text>

                        <Image
                            style={{marginTop: 10}}
                            source={require('../Assets/Icons/jersey.png')}
                        />
                    </View>
                    <Text style={styles.detailText}>
                        Create your own team and invite players and friends!
                    </Text>
                    <Button
                        title="Create Team"
                        buttonStyle={styles.button}
                        onPress={() => gotoCreateTeam()}
                    />
                </Card>

                <Card containerStyle={styles.card2}>
                    <View style={styles.header}>
                        <Text style={styles.text1}>Join a team</Text>

                        <Image
                            style={{marginTop: 10}}
                            source={require('../Assets/Icons/joinTeam.png')}
                        />
                    </View>
                    <Text style={styles.detailText}>
                        Explore and join existing teams!
                    </Text>
                    <Button
                        title="Join Team"
                        buttonStyle={styles.button}
                        onPress={() => gotoJoinTeam()}
                    />
                </Card>
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
        fontSize: 20,
        fontWeight: '500',
        color: '#4A5B96',
    },
    text2: {
        fontSize: 16,
        marginTop: 30,
        color: 'grey',
        textAlign: 'center',
    },
    divider: {
        marginTop: 10,
        width: '100%',
        height: 1.5,
        backgroundColor: 'grey',
    },
    listView: {
        width: '100%',
        marginBottom: 10,
    },
    loader: {
        marginTop: 20,
        marginBottom: 10,
    },
    card: {
        borderRadius: 10,
        width: '90%',
        margin: 9,
        marginTop: 25,
        alignSelf: 'center',
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    cardSubView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardDetailView: {
        flexDirection: 'row',
        marginTop: 10,
        alignSelf: 'center',
        alignItems: 'center',
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
        marginEnd: 5,
    },
    cardText: {
        fontSize: 16,
        fontWeight: '400',
        color: 'grey',
    },
    rankText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'darkblue',
    },
    content: {
        marginTop: 20,
    },
    cardTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: -5,
        color: '#4a5a96',
        textAlign: 'center',
    },
    card2: {
        marginTop: 30,
        borderRadius: 10,
        elevation: 5,
        width: '80%',
        borderWidth: 1,
        borderColor: 'darkgrey',
        marginTop: 30,
    },
    header: {
        alignItems: 'center',
    },
    detailText: {
        fontSize: 15,
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 30,
        color: 'grey',
    },
    button: {
        backgroundColor: '#4A5B96',
        borderRadius: 8,
    },
});

export default Team;
