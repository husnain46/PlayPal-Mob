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
} from 'react-native';

const Login = ({navigation}) => {
    const gotoHome = () => {
        navigation.navigate('BottomTab');
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
                                        />
                                        <TextInput
                                            placeholder="Password"
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.btnContainer}>
                                        <Button
                                            title="Login"
                                            onPress={() => gotoHome()}
                                        />
                                    </View>

                                    <View style={styles.footerView}>
                                        <TouchableOpacity>
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
