import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#041e38',
        alignItems: 'center',
    },
    bgContainer: {
        borderRadius: 15,
        backgroundColor: 'white',
        width: '92%',
        margin: 20,
    },
    logoView: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 10,
    },
    logoImg: {
        width: 200,
        height: 90,
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
        color: 'black',
    },
    textInput2: {
        height: 40,
        width: 125,
        borderColor: '#000000',
        borderBottomWidth: 1,
        fontSize: 17,
        color: 'black',
    },
    textInput3: {
        height: 40,
        width: 280,
        marginBottom: 20,
        borderBottomWidth: 1,
        alignSelf: 'center',
        fontSize: 17,
        color: 'black',
    },
    btnContainer: {
        alignSelf: 'center',
        height: 80,
        justifyContent: 'center',
        marginTop: 10,
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
    errorText: {
        color: 'red',
        bottom: 18,
        right: 10,
        textAlign: 'right',
        fontSize: 13,
    },
});

export default styles;
