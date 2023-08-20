import {
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    FlatList,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {Divider} from '@rneui/themed';
import {Button, Card, Paragraph} from 'react-native-paper';
import teamsData from '../Assets/teamsData.json';
import getTeamData from '../Functions/getTeamData';

const ViewTournament = ({navigation, route}) => {
    const {data, sportName, startDate, endDate} = route.params;
    const organizer = teamsData[data.organizer];
    const isCaptain = true;

    const gotoEditTournament = () => {
        navigation.navigate('EditTournament', {data});
    };

    const gotoMatches = () => {
        navigation.navigate('Matches', {data});
    };

    const gotoViewTeam = () => {
        navigation.navigate('ViewTeam', {organizer, sportName});
    };
    const renderItem = ({item, index}) => {
        const team = getTeamData(item);
        const num = index + 1;
        return (
            <View style={styles.teamCard}>
                <View style={styles.cardSubView}>
                    <Text style={styles.numText}>{`${num})`}</Text>
                    <Text style={styles.teamName}>{team.name}</Text>
                </View>
                <View style={styles.cardSubView2}>
                    <Text style={styles.pointsText}>1</Text>
                </View>

                <View style={styles.cardSubView2}>
                    <Text style={styles.pointsText}>02</Text>
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

                <View
                    style={{
                        width: '100%',
                        marginVertical: 25,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                    }}>
                    {!isCaptain ? (
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
                    data={data.teamIds}
                    renderItem={renderItem}
                    keyExtractor={item => item}
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
        margin: 12,
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
        width: 150,
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
        width: 25,
        marginLeft: 5,
        marginRight: 7,
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
