import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';

export default function Header({title, navigation}) {
    const openMenu = () => {
        navigation.openDrawer();
    };

    return (
        <SafeAreaView style={styles.header}>
            <View>
                <Image
                    source={require('../Assets/Icons/logo4.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.rightView}>
                <TouchableOpacity>
                    <Image
                        source={require('../Assets/Icons/bell.png')}
                        style={styles.bell}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <View style={styles.divider} />

                <TouchableOpacity>
                    <Image
                        source={require('../Assets/Icons/account.png')}
                        style={styles.account}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    logo: {
        width: 90,
        height: 90,
        left: -10,
    },
    rightView: {
        flexDirection: 'row',
        alignItems: 'center',
        left: 180,
    },
    bell: {
        width: 26,
        height: 29,
    },
    divider: {
        width: 2,
        height: 30,
        backgroundColor: '#BCBCBC',
        marginHorizontal: 20,
    },
    account: {
        width: 35,
        height: 35,
    },
});
