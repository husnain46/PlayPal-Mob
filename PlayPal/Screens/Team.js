import {Button, Card} from '@rneui/themed';
import React from 'react';
import {ScrollView} from 'react-native';
import {SafeAreaView, View, StyleSheet, Text, Image} from 'react-native';
import {Divider} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const Team = ({navigation}) => {
    const gotoCreateTeam = () => {
        navigation.navigate('CreateTeam');
    };

    const gotoJoinTeam = () => {
        navigation.navigate('JoinTeam');
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
                    <Text style={styles.text1}>Your teams</Text>
                    <Divider style={{marginTop: 5, width: '100%', height: 3}} />
                    <Text style={styles.text2}>You are not in a team yet</Text>
                </View>

                <Card containerStyle={styles.card}>
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

                <Card containerStyle={styles.card}>
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
    card: {
        marginTop: 30,
        borderRadius: 10,
        elevation: 5,
        width: '80%',
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
