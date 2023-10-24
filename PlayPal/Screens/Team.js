import React, {useCallback, useState} from 'react';
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
    Alert,
} from 'react-native';
import {Divider, Title} from 'react-native-paper';
import getSportsByIds from '../Functions/getSportsByIds';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';

const Team = ({navigation}) => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    const gotoCreateTeam = () => {
        if (teams.length > 0) {
            Alert.alert(
                'You are already in a team!',
                'You cannot create a team if you have joined another team.',
            );
        } else {
            navigation.navigate('CreateTeam');
        }
    };

    const gotoViewTeam = (team, sportName) => {
        navigation.navigate('ViewTeam', {team, sportName});
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

                    const querySnapshot = await firestore()
                        .collection('teams')
                        .where('playersId', 'array-contains', playerId)
                        .get();

                    if (querySnapshot.empty) {
                        // No team found with the given playerId
                        setLoading(false);
                        return null;
                    }

                    // Extract team data from the query result
                    querySnapshot.forEach(doc => {
                        const team = {
                            teamId: doc.id,
                            ...doc.data(),
                        };
                        fetchedTeams.push(team);
                    });
                    setTeams(fetchedTeams);

                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    alert('Error getting teams', error.message);
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
                        <View style={styles.cardSubView}>
                            <View style={styles.cardDetailView}>
                                <Text style={styles.cardText}>{item.rank}</Text>
                            </View>
                            <View style={styles.cardDetailView}>
                                <Text style={styles.cardText}>
                                    {item.ageCategory}
                                </Text>
                            </View>
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
                    <Text style={styles.text1}>My team</Text>
                    <Divider style={styles.divider} />
                    <View style={styles.listView}>
                        {loading ? (
                            <ActivityIndicator
                                style={styles.loader}
                                size="large"
                                color="#4A5B96"
                            />
                        ) : teams.length === 0 ? (
                            <Text style={styles.text2}>
                                You are not in a team yet
                            </Text>
                        ) : (
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={teams}
                                renderItem={renderItem}
                                keyExtractor={item => item.teamId}
                                contentContainerStyle={{paddingBottom: 10}}
                                scrollEnabled={false}
                            />
                        )}
                    </View>
                    <Divider style={styles.divider} />
                </View>
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
        fontSize: 22,
        fontWeight: '700',
        color: '#4A5B96',
    },
    text2: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 40,
    },
    divider: {
        marginTop: 10,
        width: '100%',
        height: 1.5,
        backgroundColor: 'grey',
    },
    listView: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    loader: {
        marginTop: 20,
        marginBottom: 10,
    },
    card: {
        borderRadius: 10,
        elevation: 3,
        width: 310,
        margin: 9,
        borderWidth: 2,
        borderColor: 'lightgrey',
        marginTop: 30,
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
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: 'black',
        marginEnd: 10,
    },
    cardText: {
        fontSize: 16,
        fontWeight: '700',
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
        borderWidth: 2,
        borderColor: 'lightgrey',
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
    },
    button: {
        backgroundColor: '#4A5B96',
        borderRadius: 8,
    },
});

export default Team;
