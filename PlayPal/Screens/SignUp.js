import React from 'react';
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

const SignUp = ({navigation}) => {
    const gotoLogin = () => {
        navigation.navigate('Login');
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
                                    <View style={styles.nameView}>
                                        <TextInput
                                            placeholder="First Name"
                                            style={styles.textInput1}
                                        />
                                        <TextInput
                                            placeholder="Last Name"
                                            style={styles.textInput2}
                                        />
                                    </View>
                                    <View style={styles.inputView}>
                                        <TextInput
                                            placeholder="Email"
                                            style={styles.textInput3}
                                        />
                                        <TextInput
                                            placeholder="Mobile no. (e.g. 03xxxxxxxxx)"
                                            style={styles.textInput3}
                                        />
                                        <TextInput
                                            placeholder="Username"
                                            style={styles.textInput3}
                                        />
                                        <TextInput
                                            placeholder="Password"
                                            style={styles.textInput3}
                                        />
                                    </View>
                                    <View style={styles.btnContainer}>
                                        <Button
                                            title="Submit"
                                            onPress={() => null}
                                        />
                                    </View>

                                    <View style={styles.footerView}>
                                        <Text style={styles.ftText}>
                                            Already have an account?
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => gotoLogin()}>
                                            <Text style={styles.loginText}>
                                                Login
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
        marginTop: 20,
        alignSelf: 'center',
        width: 230,
        height: 60,
    },
    inner: {
        flex: 1,
        marginTop: 50,
        justifyContent: 'center',
        alignContent: 'center',
    },
    nameView: {
        width: 300,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },
    inputView: {
        width: 300,
        marginTop: 15,
        justifyContent: 'center',
        alignContent: 'center',
    },
    textInput1: {
        height: 40,
        width: 125,
        borderColor: '#000000',
        borderBottomWidth: 1,
        fontSize: 17,
        marginEnd: 30,
    },
    textInput2: {
        height: 40,
        width: 125,
        borderColor: '#000000',
        borderBottomWidth: 1,
        fontSize: 17,
    },
    textInput3: {
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
    ftText: {
        fontSize: 17,
    },
    loginText: {
        fontSize: 18,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
});

export default SignUp;
