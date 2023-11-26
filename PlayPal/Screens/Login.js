import React, {useState} from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    ImageBackground,
    ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {StackActions} from '@react-navigation/native';
import {Button} from '@rneui/themed';
import Toast from 'react-native-toast-message';

const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        if (email && password) {
            setIsLoading(true);

            auth()
                .signInWithEmailAndPassword(email, password)
                .then(async userCredential => {
                    const user = userCredential.user;
                    if (user.emailVerified) {
                        checkProfile(user.uid);
                    } else {
                        setIsLoading(false);
                        await user.sendEmailVerification();
                        Toast.show({
                            type: 'error',
                            text1: 'Email not verified!',
                            text2: 'Please check your email inbox and verify.',
                        });

                        await auth().signOut();
                    }
                })
                .catch(error => {
                    setIsLoading(false);
                    if (error.code === 'auth/user-not-found') {
                        Toast.show({
                            type: 'error',
                            text1: 'No user found with this email.',
                        });
                    } else if (error.code === 'auth/wrong-password') {
                        Toast.show({
                            type: 'error',
                            text1: 'Incorrect password.',
                        });
                    } else if (error.code === 'auth/invalid-email') {
                        Toast.show({
                            type: 'error',
                            text1: 'Invalid email format. Please enter a valid email address.',
                        });
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: error.message,
                        });
                    }
                });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Empty fields',
                text2: 'Please enter email/password to login.',
            });
        }
    };

    const checkProfile = userId => {
        const userDocRef = firestore().collection('users').doc(userId);

        userDocRef
            .get()
            .then(docSnapshot => {
                if (docSnapshot.exists) {
                    const userData = docSnapshot.data();

                    if (!userData.city) {
                        navigation.dispatch(StackActions.replace('Welcome'));
                    } else {
                        navigation.dispatch(StackActions.replace('BottomTab'));
                    }
                }
            })
            .catch(error => {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.message,
                });
            });
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
                                resizeMode="contain"
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
                                            placeholderTextColor={'darkgrey'}
                                        />
                                        <TextInput
                                            placeholder="Password"
                                            style={styles.textInput}
                                            secureTextEntry={true}
                                            onChangeText={text =>
                                                setPassword(text)
                                            }
                                            placeholderTextColor={'darkgrey'}
                                        />
                                    </View>
                                    <View style={styles.btnContainer}>
                                        {isLoading ? (
                                            <ActivityIndicator
                                                size="large"
                                                color="#0000ff"
                                            />
                                        ) : (
                                            <Button
                                                containerStyle={{
                                                    borderRadius: 8,
                                                    elevation: 5,
                                                    width: 130,
                                                }}
                                                title="Login"
                                                titleStyle={{fontSize: 17}}
                                                onPress={() => handleSignIn()}
                                            />
                                        )}
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
        alignItems: 'center',
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
        color: 'darkblue',
    },
});

export default Login;
