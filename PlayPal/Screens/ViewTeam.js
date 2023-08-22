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
import {Divider, Icon} from '@rneui/themed';
import {Card, IconButton, Paragraph} from 'react-native-paper';
import userData from '../Assets/userData.json';

const ViewTeam = ({navigation, route}) => {
    const {team, sportName} = route.params;
    const playerCount = team.playersId.length;
    const captainName = `${userData[team.captainId].firstName} ${
        userData[team.captainId].lastName
    }`;

    const gotoViewProfile = user => {
        navigation.navigate('ViewProfile', {user});
    };

    const gotoEditTeam = () => {
        navigation.navigate('EditTeam', {myTeam: team});
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
                        {item === team.captainId ? (
                            <Image
                                source={require('../Assets/Icons/captain.png')}
                                style={{
                                    width: 25,
                                    height: 25,
                                    right: 55,
                                }}
                            />
                        ) : (
                            <></>
                        )}

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
            <ScrollView contentContainerStyle={{alignItems: 'center'}}>
                <View style={styles.imgView}>
                    <Image
                        source={{uri: team.teamPic}}
                        style={styles.mainImage}
                        resizeMode="stretch"
                    />
                </View>

                <Text style={styles.teamTitle}>{team.name}</Text>

                <IconButton
                    icon="square-edit-outline"
                    iconColor={'black'}
                    size={35}
                    style={styles.editIcon}
                    onPress={() => gotoEditTeam()}
                />
                <Divider style={styles.divider} width={1.5} color="grey" />

                <Paragraph style={styles.bio}>{team.description}</Paragraph>
                <View style={styles.detailView}>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>Sport:</Text>
                        <Text style={styles.detailText}>{sportName}</Text>
                    </View>
                    <View style={styles.subView}>
                        <Text style={styles.detailLabel}>Rank:</Text>
                        <Text style={styles.detailText}>{team.rank}</Text>
                    </View>
                </View>
                <View style={styles.cardView}>
                    <Card style={styles.card}>
                        <Card.Content style={{marginTop: -5}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.detailLabel}>Players:</Text>
                                <Text style={styles.detailText}>
                                    {`${playerCount}/${team.size}`}
                                </Text>
                            </View>
                            <View style={{marginTop: 15}}>
                                <Text style={styles.detailLabel}>Captain:</Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: 'black',
                                        top: 5,
                                    }}>
                                    {captainName}
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>
                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={{flexDirection: 'row', marginTop: -5}}>
                                <Text style={styles.detailLabel}>
                                    Total Matches:
                                </Text>
                                <Text style={styles.detailText}>
                                    {team.totalMatch}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 5}}>
                                <Text style={styles.detailLabel}>Won:</Text>
                                <Text style={styles.detailText}>
                                    {team.wins}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 5}}>
                                <Text style={styles.detailLabel}>Lost:</Text>
                                <Text style={styles.detailText}>
                                    {team.loses}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 5}}>
                                <Text style={styles.detailLabel}>Draws:</Text>
                                <Text style={styles.detailText}>
                                    {team.draws}
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
                <Text style={styles.playerTitle}>Team players</Text>
                <View style={styles.listView}>
                    <FlatList
                        data={team.playersId}
                        renderItem={renderItem}
                        keyExtractor={item => item}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainImage: {
        width: Dimensions.get('window').width,
        height: 250,
        top: -2,
    },
    teamTitle: {
        fontSize: 24,
        color: '#4a5a96',
        fontWeight: '900',
        textAlign: 'center',
        marginTop: 10,
        width: 250,
    },
    editIcon: {
        width: 40,
        alignSelf: 'flex-end',
        marginTop: -40,
        marginBottom: -10,
        right: 10,
    },
    bio: {
        fontSize: 16.5,
        textAlign: 'center',
        marginTop: 15,
        width: 350,
    },
    divider: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 10,
    },

    detailView: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    detailLabel: {
        fontSize: 17,
        color: 'black',
        fontWeight: '700',
        marginRight: 10,
    },
    detailText: {
        fontSize: 16,
        color: 'black',
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
        height: 130,
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

export default ViewTeam;
