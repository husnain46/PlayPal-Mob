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
    Modal,
    ActivityIndicator,
    Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Divider, Icon} from '@rneui/themed';
import {Card, IconButton, Paragraph} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ViewTeam = ({navigation, route}) => {
    const {team, sportName} = route.params;
    const playerCount = team.playersId.length;
    const [capName, setCapName] = useState('');
    const [playersData, setPlayersData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [request, setRequest] = useState(false);
    const isCaptain = auth().currentUser.uid === team.captainId;

    const gotoViewProfile = user => {
        let myId = auth().currentUser.uid;
        const {id, ...newUser} = user;
        user.id === myId
            ? navigation.navigate('MyProfile', {userData: newUser})
            : navigation.navigate('ViewProfile', {user});
    };

    const gotoEditTeam = () => {
        navigation.navigate('EditTeam', {
            myTeam: team,
            playersList: playersData,
        });
    };

    const handleJoinTeam = () => {
        setRequest(!request);
    };

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                // Fetch captain data
                const querySnapshot = await firestore()
                    .collection('users')
                    .doc(team.captainId)
                    .get();

                if (!querySnapshot.empty) {
                    const capData = querySnapshot.data();
                    const captainName = `${capData.firstName} ${capData.lastName}`;
                    setCapName(captainName);
                }

                // Fetch player data
                const promises = team.playersId.map(async pid => {
                    const docSnapshot = await firestore()
                        .collection('users')
                        .doc(pid)
                        .get();

                    if (docSnapshot.exists) {
                        const pData = docSnapshot.data();
                        pData.id = pid;
                        return pData;
                    } else {
                        return null;
                    }
                });

                const playerDataArray = await Promise.all(promises);
                const playerInfo = playerDataArray.filter(
                    playerData => playerData !== null,
                );

                setPlayersData(playerInfo);
            } catch (error) {
                Alert.alert('Error fetching team data:', error.message);
                // Handle errors here
            } finally {
                setIsLoading(false); // Set isLoading to false after data is fetched or an error occurs
            }
        };

        fetchTeamData();
    }, []);

    const renderItem = ({item, index}) => {
        const num = index + 1;

        return (
            <TouchableOpacity onPress={() => gotoViewProfile(item)}>
                <View style={styles.playersContainer}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}>
                            <Text style={styles.playerLabel}>
                                {`${num})  ${item.firstName} ${item.lastName}`}
                            </Text>
                            {item.id === team.captainId ? (
                                <Image
                                    source={require('../Assets/Icons/captain.png')}
                                    style={{
                                        width: 25,
                                        height: 25,
                                        marginLeft: 10,
                                    }}
                                />
                            ) : (
                                <></>
                            )}
                        </View>

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
                                {item.skillLevel}
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
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Image
                            source={{uri: team.teamPic}}
                            style={styles.mainImage}
                            resizeMode="stretch"
                        />
                    </TouchableOpacity>
                </View>

                <Modal visible={modalVisible} transparent={true}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(!modalVisible)}
                            style={styles.closeTouchable}>
                            <Text style={styles.closeText}>X</Text>
                        </TouchableOpacity>
                        <Image
                            source={{uri: team.teamPic}}
                            style={{width: '100%', height: 300}}
                            resizeMode="contain"
                        />
                    </View>
                </Modal>

                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={isLoading}
                    onRequestClose={() => {}}>
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

                <Text style={styles.teamTitle}>{team.name}</Text>
                {isCaptain ? (
                    <IconButton
                        icon="square-edit-outline"
                        iconColor={'black'}
                        size={35}
                        style={styles.editIcon}
                        onPress={() => gotoEditTeam()}
                    />
                ) : (
                    <></>
                )}

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
                                    {capName}
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

                <View style={styles.playersView}>
                    <Text style={styles.playerTitle}>Players:</Text>
                    <Button
                        title={request ? 'Requested' : 'Join'}
                        icon={() =>
                            request ? (
                                <Icon
                                    name="check-circle"
                                    type="Feather"
                                    color={'white'}
                                    size={20}
                                    style={{marginLeft: 5}}
                                />
                            ) : (
                                <></>
                            )
                        }
                        iconRight={true}
                        titleStyle={{fontSize: 18, letterSpacing: 1}}
                        color={request ? 'warning' : '#18a37e'}
                        containerStyle={
                            request
                                ? styles.requestSentButton
                                : styles.joinButton
                        }
                        onPress={() => handleJoinTeam()}
                    />
                </View>

                <View style={styles.listView}>
                    <FlatList
                        data={playersData}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
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
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    },
    activityIndicatorWrapper: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    mainImage: {
        width: Dimensions.get('window').width,
        height: 250,
        top: -2,
    },
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeTouchable: {
        position: 'absolute',
        alignItems: 'center',
        top: 30,
        right: 10,
        width: 40,
        height: 30,
    },
    closeText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
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
    playersView: {
        flexDirection: 'row',
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '89%',
    },
    playerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: 'black',
        textDecorationLine: 'underline',
        letterSpacing: 1,
    },
    joinButton: {
        borderRadius: 15,
        width: 90,
        marginHorizontal: 10, // Color for Join button
    },
    requestSentButton: {
        borderRadius: 15,
        width: 150,
        marginHorizontal: 10,
        backgroundColor: '#ccc', // Color for Request Sent button
    },
    listView: {
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
