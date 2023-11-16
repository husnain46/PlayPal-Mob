import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, AppState} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Button} from '@rneui/themed';
import {BackHandler} from 'react-native';
import Toast from 'react-native-toast-message';

const VerifyMail = ({navigation}) => {
    const [reloadKey, setReloadKey] = useState(0);

    const disableBackButton = () => {
        return true; // Returning true will prevent the default back button behavior
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', disableBackButton);

        return () => {
            // Remove the listener when the component unmounts
            BackHandler.removeEventListener(
                'hardwareBackPress',
                disableBackButton,
            );
        };
    }, []);

    useEffect(() => {
        const subscribe = auth().onAuthStateChanged(async newUser => {
            if (newUser) {
                await newUser.reload();
                newUser.getIdToken(true);
                const isEmailVerified = auth().currentUser.emailVerified;
                if (!isEmailVerified) {
                    Toast.show({
                        type: 'info',
                        text1: 'Email verification has been sent. Please check your email and verify!',
                    });
                }
            }
        });

        return subscribe;
    }, []);

    useEffect(() => {
        const handleAppStateChange = async nextAppState => {
            if (nextAppState === 'active') {
                // The app is back in the foreground, trigger a screen reload
                const newUser = auth().currentUser;

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
        await user.sendEmailVerification();
        Toast.show({
            type: 'success',
            text1: 'Email verification sent. Please check your email and verify!',
        });
    };

    const gotoLogin = async () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container} key={reloadKey}>
            <Text style={styles.title}>Email Verification</Text>
            {auth().currentUser.emailVerified ? (
                <>
                    <Text style={styles.message2}>
                        Your email is verified!{'\n'}You can login to your
                        account now.
                    </Text>
                    <Button
                        title={'Login'}
                        titleStyle={{fontSize: 18}}
                        containerStyle={{width: 100, borderRadius: 10}}
                        color={'primary'}
                        onPress={gotoLogin}
                    />
                </>
            ) : (
                <>
                    <Text style={styles.message1}>
                        Check your email and verify to activate your account.
                    </Text>
                    <Button
                        title={'Resend Verification'}
                        titleStyle={{fontSize: 18}}
                        containerStyle={{width: 200, borderRadius: 10}}
                        color={'warning'}
                        onPress={handleResendVerification}
                    />
                </>
            )}
        </View>
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
        fontSize: 24,
        fontWeight: 'bold',
        bottom: 40,
        color: 'black',
    },
    message1: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 30,
        color: 'red',
        width: 330,
    },
    message2: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 30,
        color: 'green',
        width: 330,
    },
    resendButton: {
        fontSize: 18,
        color: 'blue',
        textDecorationLine: 'underline',
        marginBottom: 20,
    },
});

export default VerifyMail;
