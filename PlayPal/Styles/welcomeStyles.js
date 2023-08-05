import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#041e38',
    },
    dpImage: {
        width: 170,
        height: 115,
        alignSelf: 'center',
        marginTop: 80,
    },
    dpView: {
        width: 120,
        alignSelf: 'center',
        marginTop: 40,
    },
    dpImage2: {
        width: 100,
        height: 115,
        borderRadius: 15,
        alignSelf: 'center',
    },
    pencilImg: {
        width: 30,
        height: 40,
        marginTop: -30,
        alignSelf: 'flex-end',
    },
    nameTxt: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginTop: 20,
        textTransform: 'capitalize',
        letterSpacing: 1,
    },
    profileTxt: {
        fontSize: 22,
        textAlign: 'center',
        color: 'white',
        marginTop: 60,
    },
    inputView: {
        marginTop: 40,
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
    },
    textInput: {
        height: 60,
        width: 290,
        borderBottomColor: 'white',
        marginTop: 10,
        borderBottomWidth: 1,
        alignSelf: 'center',
        fontSize: 17,
        backgroundColor: '#143B63',
    },
    text1: {
        height: 30,
        fontSize: 18,
        color: 'white',
    },
    text2: {
        height: 40,
        fontSize: 18,
        alignSelf: 'flex-start',
        marginTop: 30,
        left: 5,
        color: 'white',
    },
    text3: {
        height: 40,
        fontSize: 18,
        alignSelf: 'flex-start',
        marginTop: 25,
        color: 'white',
    },
    container2: {
        width: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignSelf: 'center',
    },
    option: {
        padding: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
        backgroundColor: '#143B63',
        marginHorizontal: 5,
        borderRadius: 15,
    },
    optionSelected: {
        backgroundColor: '#11867F',
    },
    optionText: {
        fontSize: 16,
        color: 'white',
    },
    optionTextSelected: {
        color: 'white',
    },
    arrowView: {
        alignItems: 'center',
        marginTop: 80,
    },
    arrowImg: {
        width: 100,
        height: 100,
    },
    pickerView: {
        alignSelf: 'center',
    },
    pickerBox: {
        backgroundColor: '#143B63',
        color: 'white',
        fontSize: 16,
    },
    pickerStyle: {
        backgroundColor: '#143B63',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'lightgrey',
    },
    btnView: {
        marginTop: 30,
        width: 140,
        height: 50,
        borderRadius: 12,
        borderWidth: 4,
        borderColor: '#143B63',
        backgroundColor: '#0c1833',
        alignSelf: 'center',
        marginBottom: 50,
    },
    btnText: {
        textAlign: 'center',
        padding: 8,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 1,
    },
});

export default styles;
