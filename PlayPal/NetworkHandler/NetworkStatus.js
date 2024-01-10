import React, {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {View, Text, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const NetworkStatus = ({children}) => {
    const [isConnected, setIsConnected] = useState(true);
    const [firestoreError, setFirestoreError] = useState(false);

    const checkFirestoreConnectivity = async () => {
        try {
            const docRef = firestore().collection('ping').doc('connection');
            // Attempting to fetch data from Firestore
            await docRef.get();
            setIsConnected(true);
            setFirestoreError(false); // Reset Firestore error if successful
        } catch (error) {
            setIsConnected(false);
            setFirestoreError(true);
        }
    };

    useEffect(() => {
        const unsubscribeNetInfo = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                // If the device is connected, also check Firestore connectivity
                checkFirestoreConnectivity();
            }
        });

        checkFirestoreConnectivity(); // Initial check

        return () => {
            unsubscribeNetInfo();
        };
    }, []);

    if (!isConnected) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Image
                    source={require('../Assets/Icons/no-internet.png')}
                    resizeMode="contain"
                    style={{width: 100, height: 100, marginBottom: 30}}
                />
                <Text>No internet connection</Text>
                {/* Customize this message/UI based on your app */}
            </View>
        );
    }

    if (firestoreError) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Image
                    source={require('../Assets/Icons/server.png')}
                    resizeMode="contain"
                    style={{width: 100, height: 100, marginBottom: 30}}
                />
                <Text
                    style={{
                        textAlign: 'center',
                        width: '90%',
                    }}>{`Error connecting to server!\nTry reloading the app or open the app after sometime.`}</Text>
                {/* Customize this message/UI based on your app */}
            </View>
        );
    }

    return children;
};

export default NetworkStatus;
