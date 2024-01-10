import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Button, Divider} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import {TextInput} from 'react-native-paper';
import AlertPro from 'react-native-alert-pro';

const ChangePassword = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passError, setPassError] = useState('');
    const [matchError, setMatchError] = useState('');
    const [currentError, setCurrentError] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMsg, setAlertMsg] = useState('');
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showMatchPass, setShowMatchPass] = useState(false);
    const alertRef = useRef([]);

    const handleChangePassword = async () => {
        // Password validation checks

        if (currentPassword === '') {
            setCurrentError('Please enter your current password.');
            return;
        } else {
            setCurrentError('');
        }

        if (newPassword.length < 6 || newPassword.includes(' ')) {
            setPassError(
                'Please choose a password according to the instructions written in the note.',
            );

            return;
        } else {
            setPassError('');
        }

        setLoading(true);

        const user = auth().currentUser;

        // Reauthenticate the user using their current password
        const credential = auth.EmailAuthProvider.credential(
            user.email,
            currentPassword,
        );

        user.reauthenticateWithCredential(credential)
            .then(() => {
                // If reauthentication is successful, update the password
                user.updatePassword(newPassword)
                    .then(() => {
                        console.log('Password updated successfully!');

                        Toast.show({
                            type: 'success',
                            text1: 'Password changed successfully!',
                        });
                        navigation.goBack();

                        setLoading(false);
                    })
                    .catch(error => {
                        Toast.show({
                            type: 'error',
                            text2: 'An unexpected error occurred. Please try again later.',
                        });
                        // Handle error: Unable to update password
                        setLoading(false);
                    });
            })
            .catch(error => {
                console.log('Error reauthenticating user:', error.message);

                if (error.code === 'auth/wrong-password') {
                    setAlertTitle('Incorrect Current Password!');
                    setAlertMsg('Please enter your correct current password.');
                    alertRef.current.open();
                } else if (error.code === 'auth/too-many-requests') {
                    setAlertTitle('Account Temporarily Disabled!');
                    setAlertMsg(
                        'Access to this account has been temporarily disabled due to many attempts with incorrect password. You can immediately restore it by resetting your password or you can try again later.',
                    );
                    alertRef.current.open();
                }

                setLoading(false);
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Change Password</Text>
            <Divider width={1} style={styles.divider} />

            <View style={styles.inputView1}>
                <TextInput
                    mode="outlined"
                    label={'Current password'}
                    style={styles.input}
                    secureTextEntry={!showCurrentPass}
                    onChangeText={text => setCurrentPassword(text)}
                    right={
                        <TextInput.Icon
                            style={{top: 4}}
                            icon={showCurrentPass ? 'eye-off' : 'eye'}
                            onPress={() => setShowCurrentPass(!showCurrentPass)}
                        />
                    }
                />
                {currentError ? (
                    <View style={styles.errorView}>
                        <Text style={styles.errorText}>{currentError}</Text>
                    </View>
                ) : (
                    <></>
                )}
            </View>

            <AlertPro
                ref={ref => (alertRef.current = ref)}
                title={alertTitle}
                message={alertMsg}
                onConfirm={() => alertRef.current.close()}
                showCancel={false}
                textConfirm="Ok"
                customStyles={{
                    buttonConfirm: {backgroundColor: '#4a5a96'},
                    container: {
                        borderWidth: 2,
                        borderColor: 'lightgrey',
                    },
                    message: {
                        textAlign: 'justify',
                        alignSelf: 'center',
                    },
                }}
            />

            <View style={styles.noteView}>
                <Text
                    style={{
                        fontSize: 15,
                        width: '80%',
                        textAlign: 'justify',
                        color: 'grey',
                    }}>
                    {`Note: Password must be at least 6 characters long and should not contain spaces.`}
                </Text>
            </View>

            <View style={styles.inputView2}>
                <TextInput
                    mode="outlined"
                    label={'New password'}
                    secureTextEntry={!showNewPass}
                    style={styles.input}
                    onChangeText={text => setNewPassword(text)}
                    right={
                        <TextInput.Icon
                            style={{top: 4}}
                            icon={showNewPass ? 'eye-off' : 'eye'}
                            onPress={() => setShowNewPass(!showNewPass)}
                        />
                    }
                />
                {passError ? (
                    <View style={styles.errorView}>
                        <Text style={styles.errorText}>{passError}</Text>
                    </View>
                ) : (
                    <></>
                )}
            </View>

            <View style={styles.inputView2}>
                <TextInput
                    mode="outlined"
                    label={'Confirm password'}
                    secureTextEntry={!showMatchPass}
                    style={styles.input}
                    disabled={newPassword === ''}
                    onChangeText={text => {
                        if (text !== newPassword) {
                            setMatchError('Password does not match!');
                        } else {
                            setMatchError('');
                        }
                    }}
                    right={
                        <TextInput.Icon
                            style={{top: 4}}
                            icon={showMatchPass ? 'eye-off' : 'eye'}
                            onPress={() => setShowMatchPass(!showMatchPass)}
                        />
                    }
                />
                {matchError ? (
                    <View style={styles.errorView}>
                        <Text style={styles.errorText}>{matchError}</Text>
                    </View>
                ) : (
                    <></>
                )}
            </View>

            <View style={styles.updateBtnView}>
                <Button
                    title={'Update password'}
                    color={'primary'}
                    containerStyle={styles.updateBtn}
                    buttonStyle={{height: 45}}
                    loading={loading}
                    loadingProps={{color: 'white'}}
                    onPress={() => handleChangePassword()}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 20,
        marginBottom: 5,
    },
    divider: {
        width: '90%',
        alignSelf: 'center',
    },
    inputView1: {
        width: '90%',
        marginTop: 50,
    },
    noteView: {
        width: '90%',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 20,
    },
    inputView2: {
        width: '90%',
        marginBottom: 15,
    },
    input: {
        width: '80%',
        height: 50,
        alignSelf: 'center',
        backgroundColor: 'white',
    },
    updateBtnView: {
        width: '90%',
        marginTop: 50,
        height: 60,
        justifyContent: 'center',
    },
    updateBtn: {
        borderRadius: 8,
        alignSelf: 'center',
        width: '45%',
    },
    errorView: {
        width: '80%',
        marginTop: 5,
        alignSelf: 'center',
    },
    errorText: {
        fontSize: 15,
        color: 'red',
    },
});

export default ChangePassword;
