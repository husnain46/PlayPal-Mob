import React, {useState, useRef} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Image,
    Modal,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import {Text, Avatar, Button, Card, Divider, List} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import getAge from '../Functions/getAge';
import getSportsByIds from '../Functions/getSportsByIds';
import {CommonActions} from '@react-navigation/native';
import {Icon} from '@rneui/themed';
import AlertPro from 'react-native-alert-pro';

const MyProfile = ({navigation, route}) => {
    const {userData} = route.params;

    const {
        firstName,
        lastName,
        gender,
        DOB,
        phone,
        username,
        email,
        area,
        bio,
        city,
        preferredSports,
        profilePic,
        skillLevel,
    } = userData;

    const myAge = getAge(DOB);
    const sports = getSportsByIds(preferredSports);
    const [loading, setLoading] = useState(false);

    const alertRef = useRef();

    const showLogoutAlert = () => {
        alertRef.current.open();
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
                        borderWidth: 1,
                        borderColor: '#9900cc',
                        borderRadius: 15,
                        shadowColor: '#000000',
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        marginTop: 10,
                        elevation: 30,
                    },
                    buttonCancel: {
                        backgroundColor: '#ffa31a',
                    },
                    buttonConfirm: {
                        backgroundColor: 'red',
                    },
                }}
            />

            <Card style={styles.card} mode="elevated">
                <Card.Content>
                    <Avatar.Image
                        size={150}
                        source={{uri: profilePic}}
                        style={styles.avatar}
                    />
                    <Text
                        style={
                            styles.fullName
                        }>{`${firstName} ${lastName}`}</Text>
                    <Text style={styles.username}>@{username}</Text>
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
                        <Text style={styles.level}>{skillLevel}</Text>
                    </View>
                </Card.Content>
            </Card>

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
                <Text style={styles.bio}>{bio}</Text>
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

            <View style={styles.detailsContainer2}>
                <List.Item
                    titleStyle={{fontSize: 17}}
                    title={`${gender} - ${myAge} years old`}
                    style={{marginBottom: -5}}
                    left={() => (
                        <List.Icon icon="account" style={styles.iconStyle} />
                    )}
                />
                <List.Item
                    titleStyle={{fontSize: 17}}
                    title={`${email}`}
                    style={{marginVertical: -5}}
                    left={() => (
                        <List.Icon icon="email" style={styles.iconStyle} />
                    )}
                />
                <List.Item
                    titleStyle={{fontSize: 17}}
                    title={`${phone}`}
                    style={{marginVertical: -5}}
                    left={() => (
                        <List.Icon icon="phone" style={styles.iconStyle} />
                    )}
                />
                <List.Item
                    titleStyle={{fontSize: 17}}
                    title={`${area}, ${city}`}
                    left={() => (
                        <List.Icon icon="map-marker" style={styles.iconStyle} />
                    )}
                    style={{marginTop: -5}}
                />
            </View>

            <Button
                mode="contained"
                icon="account-edit"
                labelStyle={{fontSize: 17}}
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProfile', {userData})}>
                Edit Profile
            </Button>

            <TouchableOpacity
                style={{
                    width: '92%',
                    height: 40,
                    alignSelf: 'center',
                    marginBottom: 30,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: 'red',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onPress={() => showLogoutAlert()}>
                <Icon
                    name="logout"
                    style={{marginRight: 10}}
                    type="Feather"
                    size={23}
                    color={'red'}
                />
                <Text
                    style={{
                        fontSize: 18,
                        color: 'red',
                        fontWeight: '700',
                    }}>
                    Logout
                </Text>
            </TouchableOpacity>
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
    detailsContainer1: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        width: '92%',
        alignSelf: 'center',
        borderRadius: 10,
        borderWidth: 1,
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
    editButton: {
        width: '92%',
        height: 40,
        alignSelf: 'center',
        marginVertical: 20,
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
