import {StyleSheet} from 'react-native';

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
    logoView: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20,
    },
    logoImg: {
        width: 200,
        height: 90,
    },
    inner: {
        marginTop: 30,
        justifyContent: 'center',
        alignContent: 'center',
    },
    nameView: {
        width: 300,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        marginBottom: 10,
    },
    radioView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 15,
    },
    radioText: {
        fontSize: 17,
        textAlign: 'right',
        marginLeft: 15,
        color: 'black',
    },
    dobView: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'flex-start',
        left: 13,
        alignItems: 'center',
        marginBottom: 10,
    },
    dateView: {
        marginLeft: 20,
    },
    dateBox: {
        width: 160,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#383838',
        borderRadius: 12,
    },
    dobText: {
        fontSize: 17,
        color: 'black',
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
        marginBottom: 25,
        borderBottomWidth: 1,
        alignSelf: 'center',
        fontSize: 17,
    },
    btnContainer: {
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 20,
        height: 80,
    },
    submitBtn: {
        borderRadius: 8,
        width: 140,
        elevation: 5,
    },
    submitText: {
        fontSize: 18,
        letterSpacing: 0.5,
        fontWeight: '600',
    },
});

export default styles;
