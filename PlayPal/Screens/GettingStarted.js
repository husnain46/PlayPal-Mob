import React from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Image,
    ImageBackground,
    Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const GettingStarted = ({navigation}) => {
    const gotoSignup = () => {
        navigation.navigate('SignUp');
    };
    const gotoLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../Assets/BGs/welcomePic1.png')}
                style={styles.bgImage}
                resizeMode="stretch">
                <View style={styles.content}>
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 120,
                        }}>
                        <Image
                            source={require('../Assets/Icons/mainLogo.png')}
                            style={styles.logoImg}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.mottoTxt}>
                        "Ignite your passion for sports"
                    </Text>
                </View>

                <View style={styles.btnView}>
                    <TouchableOpacity
                        style={styles.button1}
                        onPress={() => gotoLogin()}>
                        <Text style={styles.btnText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button2}
                        onPress={() => gotoSignup()}>
                        <Text style={styles.btnText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgImage: {
        flex: 1,
        width: width,
        height: height,
    },
    content: {
        flex: 0.95,
        alignItems: 'center',
    },
    logoImg: {
        width: 250,
        height: 80,
    },
    mottoTxt: {
        fontSize: 22,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#442e65',
        marginTop: 10,
    },
    btnView: {
        flexDirection: 'row',
        height: 70,
        top: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button1: {
        position: 'relative',
        width: 140,
        marginHorizontal: 15,
        height: 55,
        borderRadius: 15,
        backgroundColor: '#442d65',
        elevation: 20,
    },
    button2: {
        position: 'relative',
        width: 140,
        marginHorizontal: 15,
        height: 55,
        borderRadius: 15,
        backgroundColor: '#16B271',
        elevation: 20,
    },
    btnText: {
        textAlign: 'center',
        paddingTop: 11,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22,
    },
});

export default GettingStarted;
