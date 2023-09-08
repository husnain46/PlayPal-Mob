import React, {useState} from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    Button,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    ImageBackground,
    Alert,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import {StackActions} from '@react-navigation/native';

const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {
        if (email && password) {
            auth()
                .signInWithEmailAndPassword(email, password)
                .then(async userCredential => {
                    const user = userCredential.user;
                    if (user.emailVerified) {
                        navigation.dispatch(StackActions.replace('BottomTab'));
                    } else {
                        await user.sendEmailVerification();
                        alert(
                            'Your email is not verified, Check your email and verify.',
                        );
                        await auth().signOut();
                    }
                })
                .catch(error => {
                    if (error.code === 'auth/user-not-found') {
                        Alert.alert('Error', 'No user found with this email.');
                    } else if (error.code === 'auth/wrong-password') {
                        Alert.alert('Error', 'Incorrect password.');
                    } else {
                        Alert.alert('Error', 'An error occurred during login.');
                    }
                });
        } else {
            Alert.alert('Empty fields', 'Please enter email/password to login');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.bgImageView}>
                <ImageBackground
                    source={require('../Assets/BGs/blurPic.jpg')}
                    style={styles.bgImage}
                    resizeMode="cover">
                    <View>
                        <View>
                            <Image
                                source={require('../Assets/Icons/Logo.png')}
                                style={styles.logoImg}
                            />
                        </View>

                        <ScrollView>
                            <TouchableWithoutFeedback
                                onPress={Keyboard.dismiss}>
                                <View style={styles.inner}>
                                    <View style={styles.inputView}>
                                        <TextInput
                                            placeholder="Email"
                                            style={styles.textInput}
                                            onChangeText={text =>
                                                setEmail(text)
                                            }
                                        />
                                        <TextInput
                                            placeholder="Password"
                                            style={styles.textInput}
                                            secureTextEntry={true}
                                            onChangeText={text =>
                                                setPassword(text)
                                            }
                                        />
                                    </View>
                                    <View style={styles.btnContainer}>
                                        <Button
                                            title="Login"
                                            onPress={() => handleSignIn()}
                                        />
                                    </View>

                                    <View style={styles.footerView}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate(
                                                    'ForgotPassword',
                                                )
                                            }>
                                            <Text style={styles.loginText}>
                                                Forgot password
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </View>
                </ImageBackground>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#041e38',
    },
    bgImageView: {
        width: '91%',
        height: '95%',
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        marginTop: 20,
        alignSelf: 'center',
    },
    bgImage: {
        flex: 1,
        alignItems: 'center',
    },
    logoImg: {
        marginTop: 50,
        alignSelf: 'center',
        width: 230,
        height: 60,
    },
    inner: {
        flex: 1,
        marginTop: 100,
        justifyContent: 'center',
        alignContent: 'center',
    },
    inputView: {
        width: 300,
        marginTop: 15,
        justifyContent: 'center',
        alignContent: 'center',
    },
    textInput: {
        height: 40,
        width: 280,
        borderColor: '#000000',
        marginBottom: 20,
        borderBottomWidth: 1,
        alignSelf: 'center',
        fontSize: 17,
    },
    btnContainer: {
        width: 150,
        alignSelf: 'center',
        marginTop: 50,
    },
    footerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    loginText: {
        fontSize: 18,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
});

export default Login;
