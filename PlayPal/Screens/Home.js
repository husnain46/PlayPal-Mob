import React from 'react';
import {SafeAreaView, View, StyleSheet, Text} from 'react-native';

const Home = ({navigation}) => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Home Screen</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Home;
