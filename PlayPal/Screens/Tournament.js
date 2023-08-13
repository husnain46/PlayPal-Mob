import {Button, Card} from '@rneui/themed';
import React from 'react';
import {ScrollView} from 'react-native';
import {SafeAreaView, View, StyleSheet, Text, Image} from 'react-native';
import {Divider} from 'react-native-paper';

const Tournament = ({navigation}) => {
    const gotoOrganizeTournament = () => {
        navigation.navigate('OrganizeTournament');
    };

    const gotoExploreTournament = () => {
        navigation.navigate('ExploreTournament');
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
                    <Text style={styles.text1}>My tournaments</Text>
                    <Divider style={{marginTop: 5, width: '100%', height: 3}} />
                    <Text style={styles.text2}>
                        You are not in a tournament yet!
                    </Text>
                </View>
                <View style={styles.cardView}>
                    <Card containerStyle={styles.card}>
                        <View style={styles.header}>
                            <Image
                                style={styles.icon}
                                source={require('../Assets/Icons/tournament.png')}
                            />
                        </View>
                        <Text style={styles.detailText}>
                            Organize a tournament if you are captain of a team!
                        </Text>
                        <Button
                            title="Organize Tournament"
                            buttonStyle={styles.button}
                            onPress={() => gotoOrganizeTournament()}
                        />
                    </Card>

                    <Card containerStyle={styles.card}>
                        <View style={styles.header}>
                            <Image
                                style={styles.icon}
                                source={require('../Assets/Icons/search.png')}
                            />
                        </View>
                        <Text style={styles.detailText}>
                            Explore upcoming and ongoing tournaments!
                        </Text>
                        <Button
                            title="Explore Tournaments"
                            buttonStyle={styles.button}
                            onPress={() => gotoExploreTournament()}
                        />
                    </Card>
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
    cardView: {
        flexDirection: 'row',
        marginTop: 100,
    },
    card: {
        borderRadius: 10,
        elevation: 5,
        width: '46%',
        marginHorizontal: 5,
    },
    header: {
        alignItems: 'center',
    },
    detailText: {
        fontSize: 15,
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    icon: {
        marginTop: 10,
        height: 40,
        width: 40,
    },
    button: {
        backgroundColor: '#4A5B96',
        borderRadius: 8,
    },
});

export default Tournament;
