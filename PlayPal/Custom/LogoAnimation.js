import {ScreenWidth} from '@rneui/base';
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
    const [logoAnim] = useState(new Animated.Value(-250)); // Updated initial value
    const [textAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        const logoAnimation = Animated.sequence([
            Animated.timing(logoAnim, {
                toValue: 50,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(logoAnim, {
                toValue: 0,
                duration: 400,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]);

        const textAnimation = Animated.timing(textAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
            delay: 600,
        });

        // Initialize a variable to keep track of whether the animations have completed
        let animationsCompleted = false;

        const checkIfAnimationsCompleted = () => {
            if (animationsCompleted) {
                // After the animations are complete, update the layout dynamically
                logoAnim.setValue(0);
            }
        };

        // Set up the listeners for the animations
        logoAnimation.start(({finished}) => {
            if (finished) {
                checkIfAnimationsCompleted();
            }
        });

        textAnimation.start(({finished}) => {
            if (finished) {
                animationsCompleted = true;
                checkIfAnimationsCompleted();
            }
        });

        // Cleanup listeners when the component unmounts
        return () => {
            logoAnimation.stop();
            textAnimation.stop();
        };
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
            <View style={styles.logoAndTextContainer}>
                <Animated.Image
                    source={require('../Assets/Icons/logoName.png')}
                    style={[styles.textImage, animatedTextStyle]}
                    resizeMode="contain"
                />
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
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    logoAndTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        bottom: '5%',
    },
    logoContainer: {},
    logo: {
        width: 60,
        height: 60,
    },
    textImage: {
        width: 200,
        height: 60,
    },
});

export default LogoAnimation;
