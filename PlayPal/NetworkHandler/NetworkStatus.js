import React, {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {View, Text} from 'react-native';

const NetworkStatus = ({children}) => {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    if (!isConnected) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text>No internet connection</Text>
                {/* Customize this message/UI based on your app */}
            </View>
        );
    }

    return children;
};

export default NetworkStatus;
