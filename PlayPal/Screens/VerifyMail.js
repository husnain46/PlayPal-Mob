import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, AppState, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Button} from '@rneui/themed';

import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';

const VerifyMail = ({navigation}) => {
    const [reloadKey, setReloadKey] = useState(0);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const subscribe = auth().onAuthStateChanged(async newUser => {
                if (newUser) {
                    await newUser.reload();
                    newUser.getIdToken(true);
                    const isEmailVerified = auth().currentUser.emailVerified;

                    setIsVerified(isEmailVerified);

                    if (!isEmailVerified) {
                        Toast.show({
                            type: 'info',
                            text1: 'Email verification has been sent. Please check your email and verify!',
                        });
                    }
                }
            });

            return subscribe;
        }, []),
    );

    useEffect(() => {
        const handleAppStateChange = async nextAppState => {
            if (nextAppState === 'active') {
                // The app is back in the foreground, trigger a screen reload
                const newUser = auth().currentUser;

                const isEmailVerified = auth().currentUser.emailVerified;

                setIsVerified(isEmailVerified);

                await newUser.reload();
                newUser.getIdToken(true);
                setReloadKey(reloadKey + 1);
            }
        };

        const appStateSubscription = AppState.addEventListener(
            'change',
            handleAppStateChange,
        );
        return () => {
            // Clean up the subscription when the component unmounts
            appStateSubscription.remove();
        };
    }, []);

    const handleResendVerification = async () => {
        setLoading(true);

        await auth().currentUser.sendEmailVerification();

        Toast.show({
            type: 'success',
            text2: 'Email verification sent. Please check your email and verify!',
        });

        setLoading(false);
    };

    const gotoLogin = async () => {
        setLoading(true);

        navigation.navigate('Login');
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.container} key={reloadKey}>
            <Text style={styles.title}>Email Verification</Text>
            {isVerified ? (
                <>
                    <Text style={styles.message2}>
                        Your email is verified!{'\n'}You can login to your
                        account now.
                    </Text>
                    <Button
                        title={'Go to Login'}
                        loading={loading}
                        titleStyle={{fontSize: 16}}
                        containerStyle={{width: '45%', borderRadius: 10}}
                        color={'primary'}
                        onPress={gotoLogin}
                    />
                </>
            ) : (
                <>
                    <Text style={styles.message1}>
                        Check your email and verify to activate your account.
                    </Text>
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10,
                            paddingHorizontal: 10,
                            justifyContent: 'space-between',
                        }}>
                        <Button
                            title={'Go to Login'}
                            titleStyle={{fontSize: 16}}
                            containerStyle={{width: '45%', borderRadius: 10}}
                            color={'primary'}
                            onPress={gotoLogin}
                        />
                        <Button
                            title={'Resend Mail'}
                            loading={loading}
                            titleStyle={{fontSize: 16}}
                            containerStyle={{width: '45%', borderRadius: 10}}
                            color={'warning'}
                            onPress={handleResendVerification}
                        />
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        bottom: 40,
        color: 'black',
        fontStyle: 'italic',
    },
    message1: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: 'red',
        width: 330,
    },
    message2: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: 'green',
        width: 330,
    },
});

export default VerifyMail;
