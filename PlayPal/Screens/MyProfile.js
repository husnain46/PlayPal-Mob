import React, {useState, useRef, useEffect} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Image,
    Modal,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import {
    Text,
    Avatar,
    Button,
    Card,
    Divider,
    List,
    IconButton,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import getAge from '../Functions/getAge';
import getSportsByIds from '../Functions/getSportsByIds';
import {CommonActions} from '@react-navigation/native';
import {Badge, Icon} from '@rneui/themed';
import AlertPro from 'react-native-alert-pro';
import Toast from 'react-native-toast-message';
import firestore from '@react-native-firebase/firestore';

const MyProfile = ({navigation, route}) => {
    const {user} = route.params;

    const myAge = getAge(user.DOB);
    const sports = getSportsByIds(user.preferredSports);
    const [loading, setLoading] = useState(false);
    const [badgeCount, setBadgeCount] = useState(0);
    const [reqModal, setReqModal] = useState(false);
    const [inviteLoading, setInviteLoading] = useState(false);
    const [teamInvites, setTeamInvites] = useState(user.teamReq);
    const [teamsData, setTeamsData] = useState(false);
    const [sportMatched, setSportMatched] = useState(false);

    const alertRef = useRef();

    const showLogoutAlert = () => {
        alertRef.current.open();
    };

    const gotoViewTeam = (team, sportName) => {
        setReqModal(false);
        navigation.navigate('ViewTeam', {team, sportName});
    };

    const inviteAlertRef = useRef();

    const renderAlert = sportName => {
        return (
            <AlertPro
                ref={ref => (inviteAlertRef.current = ref)}
                title={sportMatched ? '' : 'Team is full!'}
                message={
                    sportMatched
                        ? `You are already in a ${sportName} Team! You cannot join another team of same sport.`
                        : 'You cannot accept the invite right now!'
                }
                onConfirm={() => inviteAlertRef.current.close()}
                showCancel={false}
                textConfirm="Ok"
                customStyles={{
                    buttonConfirm: {backgroundColor: '#4a5a96'},
                    container: {borderWidth: 2, borderColor: 'lightgrey'},
                }}
            />
        );
    };

    const handleAcceptInvite = async (tId, tName, isFull, tSport) => {
        try {
            if (isFull) {
                setSportMatched(false);
                inviteAlertRef.current.open();
            } else {
                setInviteLoading(true);

                const myTeamRef = await firestore()
                    .collection('teams')
                    .where('playersId', 'array-contains', user.id)
                    .where('sportId', '==', tSport)
                    .get();

                if (!myTeamRef.empty) {
                    setSportMatched(true);
                    inviteAlertRef.current.open();
                } else {
                    setSportMatched(false);
                }

                setTeamsData(prevTeams =>
                    prevTeams.filter(team => team.teamId !== tId),
                );

                const teamRef = firestore().collection('teams').doc(tId);

                const userRef = firestore().collection('users').doc(user.id);

                await teamRef.update({
                    playersId: firestore.FieldValue.arrayUnion(user.id),
                });

                await userRef.update({
                    teamReq: firestore.FieldValue.arrayRemove(tId),
                });

                const notifyRef = await firestore()
                    .collection('notifications')
                    .where('receiverId', '==', user.id)
                    .where('teamId', '==', tId)
                    .where('type', '==', 'team_invite')
                    .get();

                await notifyRef.docs[0].ref.delete();

                Toast.show({
                    type: 'success',
                    text1: 'Team invite accepted!',
                    text2: `You have joined ${tName}.`,
                });

                setInviteLoading(false);
            }
        } catch (error) {
            setInviteLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
        }
    };

    const handleRemoveInvite = async tId => {
        try {
            setInviteLoading(true);

            setTeamsData(prevTeams =>
                prevTeams.filter(team => team.teamId !== tId),
            );

            await firestore()
                .collection('users')
                .doc(user.id)
                .update({teamReq: firestore.FieldValue.arrayRemove(tId)});

            const notifyRef = await firestore()
                .collection('notifications')
                .where('receiverId', '==', user.id)
                .where('teamId', '==', tId)
                .where('type', '==', 'team_invite')
                .get();

            await notifyRef.docs[0].ref.delete();

            setInviteLoading(false);
        } catch (error) {
            setInviteLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
        }
    };

    const confirmLogout = async () => {
        alertRef.current.close();
        setLoading(true);

        try {
            await auth().signOut();

            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'GettingStarted',
                        },
                    ],
                }),
            );
        } catch (error) {
            Alert.alert('Could not logout!', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchInvitesData = async () => {
            try {
                setInviteLoading(true);

                const teamPromises = teamInvites.map(async tId => {
                    const teamDoc = await firestore()
                        .collection('teams')
                        .doc(tId)
                        .get();
                    if (teamDoc.exists) {
                        const tData = teamDoc.data();
                        tData.teamId = tId;

                        return tData;
                    } else {
                        return null;
                    }
                });
                const inviteData = await Promise.all(teamPromises);
                setTeamsData(inviteData);

                setInviteLoading(false);
            } catch (error) {
                setInviteLoading(false);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.message,
                });
            }
        };
        fetchInvitesData();
    }, [teamInvites]);

    useEffect(() => {
        const fetchTeamReq = firestore()
            .collection('users')
            .doc(user.id)
            .onSnapshot(snapshot => {
                if (snapshot.exists) {
                    const myData = snapshot.data();
                    setTeamInvites(myData.teamReq);
                    setBadgeCount(myData.teamReq.length);
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Invites loading error!',
                    });
                }

                setInviteLoading(false);
            });

        return () => fetchTeamReq();
    }, [reqModal]);

    const renderInvites = ({item, index}) => {
        let num = index + 1;
        let sportName = getSportsByIds([item.sportId]);
        let isFull = item.size === item.playersId.length;
        return (
            <View style={styles.teamInvitesView}>
                <TouchableOpacity
                    onPress={() => gotoViewTeam(item, sportName)}
                    style={{width: '70%'}}>
                    <Text style={styles.teamLabel}>
                        {`${num})  ${item.name}`}
                    </Text>
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '30%',
                        justifyContent: 'space-evenly',
                    }}>
                    <IconButton
                        icon={'window-close'}
                        iconColor="red"
                        size={22}
                        onPress={() => handleRemoveInvite(item.teamId)}
                    />
                    <Text
                        style={{
                            fontSize: 25,
                            color: 'darkgrey',
                            top: -2,
                            marginHorizontal: 8,
                        }}>
                        |
                    </Text>
                    <IconButton
                        icon={'check'}
                        iconColor="#26a65b"
                        size={22}
                        onPress={() =>
                            handleAcceptInvite(
                                item.teamId,
                                item.name,
                                isFull,
                                item.sportId,
                            )
                        }
                    />
                    {renderAlert(sportName)}
                </View>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <AlertPro
                ref={alertRef}
                onConfirm={confirmLogout}
                onCancel={() => alertRef.current.close()}
                title="Logout confirmation"
                message="Are you sure you want to logout from your account?"
                textCancel="No"
                textConfirm="Yes"
                customStyles={{
                    mask: {
                        backgroundColor: 'transparent',
                    },
                    container: {
                        borderWidth: 2,
                        borderColor: 'grey',
                        borderRadius: 15,
                        shadowColor: '#000000',
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        marginTop: 10,
                        elevation: 30,
                    },
                    buttonCancel: {
                        backgroundColor: '#10c479',
                    },
                    buttonConfirm: {
                        backgroundColor: 'red',
                    },
                }}
            />

            <Card style={styles.card} mode="elevated">
                <Card.Content>
                    <Avatar.Image
                        size={170}
                        source={{uri: user.profilePic}}
                        style={styles.avatar}
                    />
                    <Text
                        style={
                            styles.fullName
                        }>{`${user.firstName} ${user.lastName}`}</Text>
                    <Text style={styles.username}>@{user.username}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Image
                            source={require('../Assets/Icons/level.png')}
                            style={{
                                width: 20,
                                height: 20,
                                top: 5,
                                marginRight: 10,
                            }}
                        />
                        <Text style={styles.level}>{user.skillLevel}</Text>
                    </View>
                </Card.Content>
            </Card>

            <View style={styles.topBtnView}>
                <View style={styles.inviteBtnView}>
                    <Button
                        mode="contained"
                        icon="mail"
                        labelStyle={{fontSize: 20}}
                        style={styles.invitesBtn}
                        onPress={() => setReqModal(true)}>
                        <Text
                            style={{
                                fontSize: 17,
                                color: 'white',
                                fontWeight: '700',
                            }}>
                            Invites
                        </Text>
                    </Button>
                    {badgeCount > 0 && (
                        <Badge
                            status="error"
                            value={badgeCount}
                            containerStyle={{position: 'absolute'}}
                        />
                    )}
                </View>
                <Button
                    mode="contained"
                    icon="account-edit"
                    labelStyle={{fontSize: 20}}
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditProfile', {user})}>
                    <Text style={styles.editBtnText}>Edit Profile</Text>
                </Button>
            </View>

            <Modal
                transparent={true}
                animationType={'none'}
                visible={loading}
                onRequestClose={() => {}}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator
                            size="large"
                            color="#0000ff"
                            animating={loading}
                        />
                    </View>
                </View>
            </Modal>

            <View style={styles.detailsContainer1}>
                <Text style={styles.sectionTitle}>Bio and Interests</Text>
                <Text style={styles.bio}>{user.bio}</Text>
                <Divider style={styles.divider} />
                <Text style={styles.sectionTitle}>Preferred Sports</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 5,
                        flexWrap: 'wrap',
                        marginLeft: 2,
                    }}>
                    {sports.map((sport, index) => (
                        <Text
                            key={index}
                            style={{fontSize: 18, marginRight: 40, width: 125}}>
                            {`●  ${sport}`}
                        </Text>
                    ))}
                </View>
            </View>

            <Modal
                transparent={true}
                animationType={'slide'}
                visible={reqModal}
                onRequestClose={() => setReqModal(false)}>
                <View style={styles.reqModalView}>
                    <View style={styles.reqModalInnerView}>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <Text
                                style={{
                                    fontSize: 24,
                                    flex: 1,
                                    left: 25,
                                    textAlign: 'center',
                                    color: '#4a5a96',
                                    fontWeight: '700',
                                }}>
                                Invites
                            </Text>
                            <IconButton
                                icon="close"
                                size={30}
                                style={{alignSelf: 'flex-end'}}
                                onPress={() => setReqModal(false)}
                            />
                        </View>
                        <Divider
                            style={styles.divider2}
                            width={1.5}
                            color="grey"
                        />

                        {inviteLoading ? (
                            <View
                                style={{
                                    height: 450,
                                    justifyContent: 'center',
                                }}>
                                <ActivityIndicator size={40} style={{}} />
                            </View>
                        ) : (
                            <FlatList
                                data={teamsData}
                                keyExtractor={item => item.teamId}
                                renderItem={renderInvites}
                                ListEmptyComponent={() => (
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            textAlign: 'center',
                                            marginTop: 40,
                                            color: 'darkgrey',
                                        }}>
                                        No invites yet!
                                    </Text>
                                )}
                            />
                        )}
                    </View>
                </View>
            </Modal>

            <View style={styles.detailsContainer2}>
                <List.Item
                    titleStyle={{fontSize: 17}}
                    title={`${user.gender} - ${myAge} years old`}
                    style={{marginBottom: -5}}
                    left={() => (
                        <List.Icon icon="account" style={styles.iconStyle} />
                    )}
                />
                <List.Item
                    titleStyle={{fontSize: 17}}
                    title={`${user.email}`}
                    style={{marginVertical: -5}}
                    left={() => (
                        <List.Icon icon="email" style={styles.iconStyle} />
                    )}
                />
                <List.Item
                    titleStyle={{fontSize: 17}}
                    title={`${user.phone}`}
                    style={{marginVertical: -5}}
                    left={() => (
                        <List.Icon icon="phone" style={styles.iconStyle} />
                    )}
                />
                <List.Item
                    titleStyle={{fontSize: 17}}
                    title={`${user.area}, ${user.city}`}
                    left={() => (
                        <List.Icon icon="map-marker" style={styles.iconStyle} />
                    )}
                    style={{marginTop: -5}}
                />
            </View>

            <Button
                mode="contained"
                icon="lock-reset"
                labelStyle={{fontSize: 20}}
                style={styles.changePassBtn}
                buttonColor="#FFA400"
                onPress={() => navigation.navigate('ChangePassword')}>
                <Text style={styles.changePassTxt}>Change Password</Text>
            </Button>

            <Button
                mode="outlined"
                icon="logout"
                labelStyle={{fontSize: 20, color: 'red'}}
                style={styles.logoutBtn}
                onPress={() => showLogoutAlert()}>
                <Text style={styles.logoutText}>Logout</Text>
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    card: {
        margin: 16,
        backgroundColor: 'white',
        elevation: 10,
    },
    avatar: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    fullName: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    username: {
        fontSize: 18,
        marginTop: 5,
        textAlign: 'center',
    },
    level: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    reqModalView: {
        flex: 1,
        justifyContent: 'center',
    },
    reqModalInnerView: {
        width: '92%',
        height: 600,
        borderRadius: 15,
        borderWidth: 2,
        backgroundColor: 'white',
        alignSelf: 'center',
        elevation: 20,
    },
    teamLabel: {
        marginLeft: 5,
        fontSize: 17,
        fontWeight: '700',
        color: 'black',
    },
    teamInvitesView: {
        width: '85%',
        alignSelf: 'center',
        height: 50,
        marginTop: 20,
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: 'grey',
        borderRadius: 10,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    topBtnView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '92%',
        alignSelf: 'center',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    inviteBtnView: {
        width: '42%',
        alignSelf: 'center',
        flexDirection: 'row-reverse',
    },
    invitesBtn: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#28b57a',
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        width: '42%',
        alignSelf: 'center',
        marginVertical: 20,
        borderRadius: 10,
    },
    editBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white',
    },
    detailsContainer1: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        width: '92%',
        alignSelf: 'center',
        borderRadius: 10,
        borderWidth: 1,
    },
    divider2: {
        alignSelf: 'center',
        width: '90%',
        marginBottom: 20,
    },
    detailsContainer2: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        width: '92%',
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 20,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    bio: {
        fontSize: 16,
        marginBottom: 8,
    },
    skillLevel: {
        fontSize: 16,
        marginBottom: 8,
    },
    divider: {
        marginTop: 10,
        marginBottom: 15,
        height: 1,
        backgroundColor: 'grey',
    },
    changePassBtn: {
        width: '92%',
        alignSelf: 'center',
        marginVertical: 20,
        borderRadius: 10,
    },
    changePassTxt: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white',
    },
    logoutBtn: {
        width: '92%',
        alignSelf: 'center',
        marginBottom: 20,
        borderRadius: 10,
        borderColor: 'red',
        borderWidth: 1.5,
    },
    logoutText: {
        fontSize: 18,
        fontWeight: '700',
        color: 'red',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconStyle: {
        fontSize: 15,
    },
});

export default MyProfile;
