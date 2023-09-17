import React from 'react';
import {View, ScrollView, StyleSheet, Image} from 'react-native';
import {Text, Avatar, Button, Card, Divider, List} from 'react-native-paper';

import getAge from '../Functions/getAge';
import getSportsByIds from '../Functions/getSportsByIds';

const MyProfile = ({navigation, route}) => {
    const userData = route.params.userData;

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
    return (
        <ScrollView style={styles.container}>
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
