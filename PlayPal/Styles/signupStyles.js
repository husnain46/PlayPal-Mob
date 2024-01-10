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
        width: '85%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        alignItems: 'center',
        alignSelf: 'center',
    },
    textInput1: {
        height: 40,
        width: '45%',
        fontSize: 16,
        backgroundColor: 'white',
    },
    textInput2: {
        height: 40,
        width: '45%',
        fontSize: 16,
        backgroundColor: 'white',
    },
    radioView: {
        width: '85%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 15,
        marginLeft: 8,
    },
    radioText: {
        fontSize: 17,
        color: 'black',
        marginRight: 1,
    },
    dobView: {
        width: '85%',
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 8,
    },
    dateBox: {
        width: '55%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#383838',
        borderRadius: 10,
    },
    dobText: {
        fontSize: 17,
        color: 'black',
    },
    inputView: {
        width: '85%',
        marginTop: 20,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    textInput3: {
        height: 40,
        width: '100%',
        marginBottom: 20,
        alignSelf: 'center',
        fontSize: 16,
        color: 'black',
        backgroundColor: 'white',
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
        textAlign: 'right',
        fontSize: 13,
        bottom: 16,
    },
});

export default styles;
