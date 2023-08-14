import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEDED',
    },
    searchView: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 10,
    },
    searchBar: {
        width: 270,
        height: 50,
        marginEnd: 30,
        justifyContent: 'center',
        backgroundColor: 'white',
        elevation: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
    filter: {
        width: 25,
        height: 25,
        top: 2,
    },
    ageFilterView: {
        alignSelf: 'center',
        marginTop: 20,
    },
    agefilterLabel: {
        fontSize: 16,
        marginBottom: 5,
        marginLeft: 10,
        fontWeight: '600',
        color: 'black',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalView: {
        width: 300,
        height: 400,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        elevation: 35,
        borderWidth: 3,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginEnd: 10,
    },
    buttonOpen: {
        backgroundColor: '#11867F',
    },
    buttonClose: {
        backgroundColor: 'red',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    pickerView: {
        alignSelf: 'center',
    },
    pickerBox: {
        fontSize: 16,
    },
    pickerStyle: {
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'lightgrey',
    },
    filterLabel: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: '600',
        color: 'black',
    },
    filterBtnView: {
        flexDirection: 'row',
        marginTop: 35,
        left: 10,
    },
    resetBtn: {
        marginEnd: 65,
        borderWidth: 1,
        borderColor: 'grey',
    },
    safeContainerStyle: {
        flex: 1,
        margin: 20,
        justifyContent: 'center',
    },
    listView: {
        top: 30,
        alignItems: 'center',
    },
    card: {
        width: 350,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 15,
    },
    cardName: {
        width: '150%',
        fontSize: 18,
        marginLeft: 25,
        bottom: 8,
    },
    cardUsername: {
        fontSize: 15,
        marginLeft: 25,
        bottom: 8,
        width: '150%',
    },
    cardHeader: {
        height: 90,
    },
    divider: {
        alignSelf: 'center',
        width: '105%',
        marginTop: 10,
    },
    dpImage: {
        height: 75,
        width: 75,
        right: 5,
        marginTop: 5,
        borderWidth: 2,
        borderColor: '#143B63',
        borderRadius: 15,
    },
    infoContainer: {
        padding: 10,
    },
    cardSportsText: {
        fontSize: 18,
        left: 20,
    },
    userInfo: {
        fontSize: 17,
        marginBottom: 8,
        left: 20,
    },
    infoIcons: {
        width: 28,
        height: 28,
    },
    cardInfoView: {
        flexDirection: 'row',
        marginTop: 10,
    },
    cardAgeView: {
        flexDirection: 'row',
        top: 38,
        right: 10,
    },
    ageText: {
        fontSize: 15,
    },
});

export default styles;
