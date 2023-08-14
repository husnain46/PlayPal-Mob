import {
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    Image,
    FlatList,
    Dimensions,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Divider} from '@rneui/themed';
import {Button, Card, Paragraph} from 'react-native-paper';
import userData from '../Assets/userData.json';
import teamsData from '../Assets/teamsData.json';
const ViewTournament = ({navigation, route}) => {
    const {data, sportName, startDate, endDate} = route.params;
    const organizer = teamsData[data.organizer];

    const gotoViewProfile = user => {
        navigation.navigate('ViewProfile', {user});
    };

    const gotoMatches = () => {
        navigation.navigate('Matches', {matches: data.matches});
    };

    const gotoViewTeam = () => {
        navigation.navigate('ViewTeam', {organizer, sportName});
    };
    const renderItem = ({item, index}) => {
        const playerInfo = userData[item];
        const num = index + 1;
        return (
            <TouchableOpacity onPress={() => gotoViewProfile(playerInfo)}>
                <View style={styles.playersContainer}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <Text style={styles.playerLabel}>
                            {`${num})  ${playerInfo.firstName} ${playerInfo.lastName}`}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 2,
                                marginEnd: 10,
                            }}>
                            <Image
                                style={styles.icon}
                                source={require('../Assets/Icons/level.png')}
                            />
                            <Text style={styles.playerText}>
                                {playerInfo.skillLevel}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

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
                </View>

                <View style={styles.detailView}>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>Start:</Text>
                        <Text style={styles.detailText}>{startDate}</Text>
                    </View>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>End:</Text>
                        <Text style={styles.detailText}>{endDate}</Text>
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
                                    {organizer.name}
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

                <View style={{marginTop: 30}}>
                    <Button mode="contained" onPress={() => gotoMatches()}>
                        <Text style={{fontSize: 16, color: 'white'}}>
                            See all matches
                        </Text>
                    </Button>
                </View>

                <Text style={styles.playerTitle}>Team Standings</Text>

                <View style={styles.detailView}>
                    <View style={styles.subView2}>
                        <Text style={styles.detailLabel}>Teams</Text>
                    </View>
                    <View style={styles.subView3}>
                        <Text style={styles.detailLabel}>W</Text>
                    </View>

                    <View style={styles.subView3}>
                        <Text style={styles.detailLabel}>L</Text>
                    </View>

                    <View style={styles.subView3}>
                        <Text style={styles.detailLabel}>D</Text>
                    </View>

                    <View style={styles.subView3}>
                        <Text style={styles.detailLabel}>Points</Text>
                    </View>
                </View>

                <View style={styles.teamCard}>
                    <View style={styles.cardSubView}>
                        <Text style={styles.teamName}>team name</Text>
                    </View>
                    <View style={styles.cardSubView2}>
                        <Text style={styles.pointsText}>1</Text>
                    </View>

                    <View style={styles.cardSubView2}>
                        <Text style={styles.pointsText}>0</Text>
                    </View>

                    <View style={styles.cardSubView2}>
                        <Text style={styles.pointsText}>1</Text>
                    </View>

                    <View style={styles.cardSubView3}>
                        <Text style={styles.pointsText}>4</Text>
                    </View>
                </View>

                <View style={styles.listView}>
                    {/* <FlatList
                        data={team.playersId} // Correct the data here
                        renderItem={renderItem}
                        keyExtractor={item => item}
                        scrollEnabled={false}
                    /> */}
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

    titleView: {
        marginTop: 15,
        paddingHorizontal: 25,
    },
    teamTitle: {
        fontSize: 24,
        color: '#4a5a96',
        fontWeight: '900',
        textAlign: 'center',
        marginTop: 10,
    },
    bio: {
        fontSize: 17,
        textAlign: 'justify',
        marginTop: 25,
    },
    divider: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 10,
    },

    detailView: {
        width: '90%',
        justifyContent: 'space-between',
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
    },
    subView: {
        flexDirection: 'row',
        margin: 12,
        marginHorizontal: 15,
    },
    subView2: {
        width: 150,
        margin: 12,
        left: 20,
    },
    subView3: {
        margin: 12,
        marginLeft: 9,
    },
    teamCard: {
        width: '90%',
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
    },
    cardSubView: {
        width: 155,
        margin: 12,
    },
    cardSubView2: {
        width: 29,
        margin: 12,
        marginLeft: 5,
    },

    cardSubView3: {
        margin: 12,
        width: 20,
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
    detailLabel: {
        fontSize: 17,
        color: 'black',
        fontWeight: '700',
        marginRight: 10,
    },
    detailText: {
        fontSize: 17,
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
        marginTop: 20,
        color: '#4a5a96',
        textDecorationLine: 'underline',
        fontWeight: '500',
        textAlign: 'center',
    },

    totalMatch: {
        fontSize: 24,
        marginTop: 17,
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
    },
    teamImg: {
        width: 40,
        height: 40,
    },
    playerTitle: {
        marginTop: 30,
        fontSize: 20,
        fontWeight: '700',
        color: 'black',
        textDecorationLine: 'underline',
    },
    listView: {
        marginTop: 10,
        alignItems: 'center',
        paddingBottom: 30,
    },
    playerLabel: {
        marginLeft: 5,
        marginTop: 2,
        fontSize: 17,
        fontWeight: '700',
        color: 'black',
    },
    playerText: {
        fontSize: 16,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    playersContainer: {
        width: 370,
        height: 50,
        marginTop: 20,
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'grey',
        borderRadius: 10,
        padding: 5,
    },
});

export default ViewTournament;
