import React, {useState} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {Avatar, Text, ListItem, Divider, Button} from '@rneui/themed';
import getAge from '../Functions/getAge';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const ViewProfile = ({navigation, route}) => {
    const {user, sportName} = route.params;
    const [requestSent, setRequestSent] = useState(false);
    const [isFriend, setIsFriend] = useState(true);

    const gotoChat = () => {
        navigation.navigate('ChatScreen', {user});
    };

    const handleAddFriend = () => {
        if (isFriend) {
            // Implement logic to remove friend
            setIsFriend(false);
            Alert.alert(`You unfriended ${user.firstName} ${user.lastName}`);
        } else if (requestSent) {
            // Implement logic to cancel the friend request

            setRequestSent(false);
            Alert.alert(`Friend request cancelled`);
        } else {
            // Implement logic to send a friend request
            setRequestSent(true);
            Alert.alert(
                `Friend request sent to ${user.firstName} ${user.lastName}`,
            );
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.topView}>
                <Avatar
                    rounded
                    source={{uri: user.profilePic}}
                    size="xlarge"
                    containerStyle={styles.avatar}
                />
                <Text
                    style={
                        styles.nameText
                    }>{`${user.firstName} ${user.lastName}`}</Text>
                <Text style={styles.ageText}>
                    {`${user.gender} - ${getAge(user.DOB)} years old`}
                </Text>
            </View>

            <View style={styles.detailsContainer}>
                <ListItem containerStyle={styles.listTop}>
                    <ListItem.Content>
                        <ListItem.Title style={styles.detailTitle}>
                            About me:
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.detailText}>
                            {user.bio}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <Divider width={1} />
                <ListItem>
                    <Image
                        style={styles.icon}
                        source={require('../Assets/Icons/location.png')}
                    />
                    <ListItem.Content>
                        <ListItem.Title style={styles.detailTitle}>
                            Lives in:
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.detailText}>
                            {`${user.area}, ${user.city}`}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <Divider width={1} />

                <ListItem>
                    <Image
                        style={styles.icon}
                        source={require('../Assets/Icons/sports.png')}
                    />
                    <ListItem.Content>
                        <ListItem.Title style={styles.detailTitle}>
                            Sports interest:
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.detailText}>
                            {sportName.join(', ')}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <Divider width={1} />

                <ListItem containerStyle={styles.listBottom}>
                    <Image
                        style={styles.icon}
                        source={require('../Assets/Icons/level.png')}
                    />
                    <ListItem.Content>
                        <ListItem.Title style={styles.detailTitle}>
                            Skill Level
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.detailText}>
                            {user.skillLevel}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            </View>

            <View style={styles.requestBtnView}>
                <TouchableOpacity
                    style={[
                        styles.addButton,
                        (requestSent || isFriend) && styles.sentButton,
                        isFriend && styles.unfriendButton,
                    ]}
                    onPress={handleAddFriend}>
                    <Icons
                        name={
                            requestSent
                                ? 'account-check'
                                : isFriend
                                ? 'account-remove'
                                : 'account-plus'
                        }
                        size={25}
                        color="white"
                    />
                    <Text style={styles.addButtonText}>
                        {requestSent
                            ? 'Request Sent'
                            : isFriend
                            ? 'Unfriend'
                            : 'Add Friend'}
                    </Text>
                </TouchableOpacity>

                {isFriend ? (
                    <TouchableOpacity
                        style={styles.chatButton}
                        onPress={() => gotoChat()}>
                        <Icons name="chat" size={25} color={'white'} />
                        <Text style={styles.addButtonText}>Chat</Text>
                    </TouchableOpacity>
                ) : (
                    <></>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEDED',
    },
    avatar: {
        alignSelf: 'center',
        marginVertical: 20,
        borderWidth: 3,
        borderColor: '#143B63',
    },
    detailsContainer: {
        width: 370,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: 'lightgrey',
        borderRadius: 10,
    },
    listTop: {
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
    },
    listBottom: {
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10,
    },
    icon: {
        width: 35,
        height: 35,
        marginRight: 10,
    },
    topView: {
        alignItems: 'center',
        marginBottom: 20,
    },
    nameText: {
        fontSize: 24,
        fontWeight: '700',
    },
    ageText: {
        fontSize: 18,
        color: 'grey',
        fontWeight: '500',
    },
    detailTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    detailText: {
        fontSize: 16,
    },
    requestBtnView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chatButton: {
        width: 120,
        height: 65,
        backgroundColor: '#0084ff',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    addButton: {
        width: 120,
        height: 65,
        backgroundColor: '#0084ff',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    sentButton: {
        backgroundColor: '#39b54a',
    },
    unfriendButton: {
        backgroundColor: 'red',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ViewProfile;
