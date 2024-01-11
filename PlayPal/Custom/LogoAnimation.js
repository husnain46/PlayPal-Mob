import React, {useEffect, useState} from 'react';
import {
    View,
    Image,
    Animated,
    Easing,
    StyleSheet,
    SafeAreaView,
} from 'react-native';

const LogoAnimation = () => {
    const [logoAnim] = useState(new Animated.Value(-150));
    const [textAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.sequence([
            Animated.timing(logoAnim, {
                toValue: 50,
                duration: 600,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(logoAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.timing(textAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
            delay: 1000,
        }).start();
    }, [logoAnim, textAnim]);

    const animatedTextStyle = {
        opacity: textAnim,
        transform: [
            {
                translateY: textAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                }),
            },
            {
                scale: textAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1.5, 1],
                }),
            },
        ],
    };

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {transform: [{translateX: logoAnim}]},
                ]}>
                <Image
                    source={require('../Assets/Icons/runningLogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>
            <Animated.Image
                source={require('../Assets/Icons/logoName.png')}
                style={[styles.textImage, animatedTextStyle]}
                resizeMode="contain"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    logoContainer: {
        position: 'absolute',
        top: '48%',
    },
    logo: {
        width: 80,
        height: 80,
    },
    textImage: {
        width: 200,
        height: 50,
        top: '38%',
    },
});

export default LogoAnimation;
