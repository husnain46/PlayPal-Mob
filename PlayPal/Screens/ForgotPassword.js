import React, {useState} from 'react';
import {View, Text, TextInput, Alert, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Button} from 'react-native-paper';
import {Divider} from '@rneui/themed';

const ForgotPassword = ({navigation}) => {
    const [email, setEmail] = useState('');

    const handleResetPassword = () => {
        if (email) {
            auth()
                .sendPasswordResetEmail(email)
                .then(() => {
                    Alert.alert(
                        'Password Reset Email',
                        'Check your email for instructions to reset your password.',
                    );
                    navigation.goBack();
                })
                .catch(error => {
                    if (error.code === 'auth/user-not-found') {
                        Alert.alert('Error', 'No user found with this email.');
                    } else if (error.code === 'auth/invalid-email') {
                        Alert.alert('Error', 'Invalid email.');
                    } else {
                        Alert.alert(error.message);
                    }
                });
        } else {
            Alert.alert('Empty Field', 'Please enter your email address.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <Divider
                width={1}
                color="grey"
                style={{width: '90%', marginTop: 5}}
            />
            <TextInput
                placeholder="Email"
                style={styles.input}
                onChangeText={text => setEmail(text)}
            />
            <Button
                mode="contained"
                onPress={handleResetPassword}
                style={{borderRadius: 10, marginTop: 30}}
                labelStyle={{fontSize: 17}}>
                Reset Password
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 30,
        color: '#4a5a96',
    },
    input: {
        width: '70%',
        height: 50,
        borderWidth: 1,
        fontSize: 17,
        borderColor: 'gray',
        paddingHorizontal: 10,
        marginBottom: 20,
        marginTop: 80,
        borderRadius: 10,
    },
});

export default ForgotPassword;
