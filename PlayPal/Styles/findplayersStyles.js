import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchView: {
        width: '85%',
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginTop: 12,
        height: 80,
    },
    searchBar: {
        width: '85%',
        height: 50,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#8b8b8b',
    },
    filter: {
        width: 27,
        height: 27,
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
    },
    buttonOpen: {
        backgroundColor: '#11867F',
    },
    buttonClose: {
        backgroundColor: 'red',
        right: 10,
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
        width: '90%',
    },
    pickerBox: {
        fontSize: 16,
        backgroundColor: 'white',
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
        marginTop: 30,
        width: '100%',
        justifyContent: 'space-between',
    },
    resetBtn: {
        borderWidth: 1,
        borderColor: 'grey',
    },
    safeContainerStyle: {
        flex: 1,
        margin: 20,
        justifyContent: 'center',
    },
    listView: {
        marginTop: 10,
        width: '100%',
    },
    emptyListText: {
        fontSize: 18,
        color: '#124163',
        textAlign: 'center',
    },
    card: {
        width: '85%',
        elevation: 10,
        alignSelf: 'center',
        marginBottom: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'darkgrey',
    },
    cardName: {
        width: '150%',
        fontSize: 18,
        marginLeft: 15,
        fontWeight: '500',
        color: 'black',
    },
    cardUsername: {
        fontSize: 15,
        marginLeft: 15,
        width: '150%',
        color: 'grey',
    },
    cardHeader: {
        flexDirection: 'row',
    },
    divider: {
        alignSelf: 'center',
        width: '100%',
        marginVertical: 10,
    },
    dpImage: {
        height: 80,
        width: 80,
        borderWidth: 2,
        borderColor: '#143B63',
        borderRadius: 15,
    },
    cardSportsText: {
        width: '80%',
        fontSize: 15,
        left: 20,
        color: 'black',
    },
    userInfo: {
        fontSize: 15,
        left: 20,
        color: 'grey',
        width: '80%',
    },
    infoIcons: {
        width: 25,
        height: 25,
        left: 2,
    },
    cardInfoView: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    cardAgeView: {
        flexDirection: 'row',
        marginLeft: 15,
        top: 10,
    },
    ageText: {
        fontSize: 15,
        color: 'grey',
    },
});

export default styles;
