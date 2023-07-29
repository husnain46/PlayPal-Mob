import React from 'react';
import {SafeAreaView, View, StyleSheet, Text} from 'react-native';

const FindPlayers = ({navigation}) => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>find players screen</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
});

export default FindPlayers;
