import {
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    FlatList,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {Divider} from '@rneui/themed';
import {Button, Card, Paragraph} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';

const ViewTournament = ({navigation, route}) => {
    const {tournamentId, sportName} = route.params;
    const [data, setData] = useState([]);

    const [teamsData, setTeamsData] = useState([]);
    const [organizer, setOrganizer] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const myId = auth().currentUser.uid;
    const [isOrganizer, setIsOrganizer] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const tournamentRef = firestore()
                .collection('tournaments')
                .doc(tournamentId);

            const unsubscribe = tournamentRef.onSnapshot(
                snapshot => {
                    if (snapshot.exists) {
                        const tData = snapshot.data();
                        tData.id = snapshot.id;
                        setData(tData);

                        const fetchTeamsData = async () => {
                            try {
                                const organizerDoc = await firestore()
                                    .collection('teams')
                                    .doc(tData.organizer)
                                    .get();

                                const tName = organizerDoc.data().name;
                                const cap =
                                    myId === organizerDoc.data().captainId;
                                setIsOrganizer(cap);
                                setOrganizer(tName);

                                const promises = tData.teamIds.map(
                                    async tId => {
                                        const docSnapshot = await firestore()
                                            .collection('teams')
                                            .doc(tId)
                                            .get();

                                        if (docSnapshot.exists) {
                                            const tData = docSnapshot.data();
                                            tData.id = tId;
                                            return tData;
                                        } else {
                                            return null;
                                        }
                                    },
                                );

                                const teamDataArray = await Promise.all(
                                    promises,
                                );
                                const teamInfo = teamDataArray.filter(
                                    tData => tData !== null,
                                );
                                setTeamsData(teamInfo);
                                setIsLoading(false);
                            } catch (error) {
                                setIsLoading(false);
                                navigation.goBack();
                                ToastAndroid.show(
                                    error.message,
                                    ToastAndroid.LONG,
                                );
                            }
                        };

                        fetchTeamsData();
                    } else {
                        setData([]);
                        setIsLoading(false);
                    }
                },
                error => {
                    console.error('Error fetching tournament document:', error);
                },
            );

            return () => {
                unsubscribe();
            };
        }, [tournamentId, navigation]),
    );

    const gotoEditTournament = () => {
        navigation.navigate('EditTournament', {data, teamsData});
    };

    const gotoMatches = () => {
        navigation.navigate('Matches', {data, teamsData, isOrganizer});
    };

    const gotoViewTeam = () => {
        navigation.navigate('ViewTeam', {organizer, sportName});
    };
    const renderItem = ({item, index}) => {
        const num = index + 1;
        return (
            <View style={styles.teamCard}>
                <View style={styles.cardSubView}>
                    <Text style={styles.numText}>{`${num})`}</Text>
                    <Text style={styles.teamName}>{item.name}</Text>
                </View>
                <View style={styles.cardSubView2}>
                    <Text style={styles.pointsText}>4</Text>
                </View>

                <View style={styles.cardSubView2}>
                    <Text style={styles.pointsText}>0</Text>
                </View>

                <View style={styles.cardSubView2}>
                    <Text style={styles.pointsText}>1</Text>
                </View>

                <View style={styles.cardSubView3}>
                    <Text style={styles.pointsText2}>4</Text>
                </View>
            </View>
        );
    };

    if (!data || teamsData.length === 0) {
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={isLoading}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator
                            size="large"
                            color="#0000ff"
                            animating={isLoading}
                        />
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{alignItems: 'center'}}
                style={{width: '100%'}}>
                <View style={styles.titleView}>
                    <Text style={styles.teamTitle}>{data.name}</Text>
                    <Paragraph style={styles.bio}>{data.detail}</Paragraph>
                </View>

                <Divider style={styles.divider} width={2} color="grey" />

                <View style={styles.detailView}>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>Sport:</Text>
                        <Text style={styles.detailText}>{sportName}</Text>
                    </View>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>City:</Text>
                        <Text style={styles.detailText}>{data.city}</Text>
                    </View>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>Venue:</Text>
                        <Text style={styles.detailText}>{data.venue}</Text>
                    </View>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>Location:</Text>
                        <Text style={styles.detailText}>{data.address}</Text>
                    </View>
                </View>

                <View style={styles.detailView}>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>Start:</Text>
                        <Text style={styles.detailText}>
                            {data.start_date
                                .toDate()
                                .toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                        </Text>
                    </View>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>End:</Text>
                        <Text style={styles.detailText}>
                            {data.end_date
                                .toDate()
                                .toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardView}>
                    <Card style={styles.card}>
                        <Card.Content style={{marginTop: -5}}>
                            <Text style={styles.organizerLabel}>Organizer</Text>
                            <Divider
                                style={styles.divider2}
                                width={2}
                                color="darkgrey"
                            />

                            <TouchableOpacity onPress={() => gotoViewTeam()}>
                                <Text style={styles.organizer}>
                                    {organizer}
                                </Text>
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                    <Card style={styles.card}>
                        <Card.Content style={{marginTop: -5}}>
                            <Text style={styles.organizerLabel}>
                                Total Matches
                            </Text>
                            <Divider
                                style={styles.divider2}
                                width={2}
                                color="darkgrey"
                            />
                            <Text style={styles.totalMatch}>
                                {data.matches.length}
                            </Text>
                        </Card.Content>
                    </Card>
                </View>

                <View
                    style={{
                        width: '100%',
                        marginVertical: 25,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                    }}>
                    {!isOrganizer ? (
                        <></>
                    ) : (
                        <Button
                            mode="elevated"
                            onPress={() => gotoEditTournament()}
                            buttonColor="#ccdae0">
                            <Text style={{fontSize: 16, color: '#374c62'}}>
                                Edit Tournament
                            </Text>
                        </Button>
                    )}
                    <Button
                        mode="contained"
                        buttonColor="#348883"
                        onPress={() => gotoMatches()}>
                        <Text style={{fontSize: 16, color: 'white'}}>
                            See all matches
                        </Text>
                    </Button>
                </View>

                <Text style={styles.tableTitle}>Team Standings</Text>

                <View style={styles.tableHeader}>
                    <View style={styles.headerView1}>
                        <Text style={styles.headerText}>Teams</Text>
                    </View>
                    <View style={styles.headerView2}>
                        <Text style={styles.headerText}>W</Text>
                    </View>

                    <View style={styles.headerView2}>
                        <Text style={styles.headerText}>L</Text>
                    </View>

                    <View style={styles.headerView2}>
                        <Text style={styles.headerText}>D</Text>
                    </View>

                    <View>
                        <Text style={styles.headerText}>Points</Text>
                    </View>
                </View>

                <FlatList
                    data={teamsData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    contentContainerStyle={{paddingBottom: 20}}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    activityIndicatorWrapper: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    titleView: {
        marginTop: 15,
    },
    teamTitle: {
        fontSize: 24,
        color: '#4a5a96',
        fontWeight: '900',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 25,
    },
    bio: {
        fontSize: 17,
        textAlign: 'center',
        marginTop: 25,
        paddingHorizontal: 20,
    },
    divider: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 10,
        marginBottom: 10,
    },
    detailView: {
        width: '90%',
        justifyContent: 'space-between',
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        borderWidth: 1.5,
        borderColor: 'darkgrey',
        flexWrap: 'wrap',
    },
    subView: {
        flexDirection: 'row',
        margin: 10,
        marginHorizontal: 15,
        flexWrap: 'wrap',
    },
    detailLabel: {
        fontSize: 17,
        color: 'black',
        fontWeight: '700',
        marginRight: 10,
    },
    detailText: {
        fontSize: 16.5,
        color: 'black',
    },
    organizerLabel: {
        fontSize: 18,
        color: 'black',
        fontWeight: '600',
        textAlign: 'center',
    },
    divider2: {
        alignSelf: 'center',
        width: '100%',
        marginTop: 5,
    },
    organizer: {
        fontSize: 18,
        paddingVertical: 15,
        color: '#4a5a96',
        textDecorationLine: 'underline',
        fontWeight: '500',
        textAlign: 'center',
    },
    totalMatch: {
        fontSize: 24,
        paddingVertical: 15,
        color: '#4a5a96',
        fontWeight: '500',
        textAlign: 'center',
    },
    cardView: {
        marginTop: 20,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: 'white',
        width: 180,
        height: 110,
        borderWidth: 1.5,
        borderColor: 'darkgrey',
    },
    tableTitle: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: '700',
        color: 'black',
        textDecorationLine: 'underline',
        letterSpacing: 0.5,
    },
    tableHeader: {
        width: '90%',
        height: 50,
        justifyContent: 'space-between',
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#567595',
        elevation: 5,
    },
    headerView1: {
        width: '40%',
        left: 30,
    },
    headerView2: {
        right: -4,
    },
    headerText: {
        fontSize: 17,
        color: 'white',
        fontWeight: '700',
        marginRight: 10,
    },
    teamCard: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'lightgrey',
        marginBottom: 10,
        height: 55,
        alignSelf: 'center',
        alignItems: 'center',
        width: '94%',
        justifyContent: 'space-around',
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
    },
    cardSubView: {
        flexDirection: 'row',
        width: 155,
        marginRight: 10,
    },
    cardSubView2: {
        width: '7%',
        marginRight: 20,
        alignItems: 'center',
    },
    cardSubView3: {
        width: 25,
        marginLeft: 15,
        marginRight: 17,
    },
    numText: {
        fontSize: 17,
        color: 'black',
        left: 5,
    },
    teamName: {
        fontSize: 17,
        color: 'black',
        paddingHorizontal: 15,
    },
    pointsText: {
        fontSize: 17,
        color: 'green',
    },
    pointsText2: {
        fontSize: 17,
        color: 'blue',
    },
});

export default ViewTournament;
