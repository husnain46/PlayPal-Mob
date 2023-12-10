import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEDED',
    },
    topTitle: {
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 20,
        color: '#4a5a96',
    },
    divider: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 5,
    },
    searchView: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginTop: 25,
        width: '85%',
    },
    searchBar: {
        width: '85%',
        height: 50,
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
        width: 320,
        height: 320,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        elevation: 35,
        borderWidth: 2,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginLeft: 5,
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
        alignSelf: 'flex-start',
        width: '90%',
    },
    pickerBox: {
        fontSize: 16,
        backgroundColor: 'white',
    },
    pickerStyle: {
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'darkgrey',
    },
    filterLabel: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: '600',
        color: 'black',
    },
    filterBtnView: {
        flexDirection: 'row',
        marginTop: 45,
        width: '100%',
        justifyContent: 'space-between',
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
        marginTop: 30,
        width: '100%',
    },
    emptyText: {
        marginTop: 20,
        fontSize: 17,
        color: '#c22710',
        fontWeight: '500',
        textAlign: 'center',
    },
    card: {
        borderRadius: 10,
        elevation: 3,
        width: '85%',
        margin: 9,
        borderWidth: 1,
        borderColor: 'darkgrey',
        marginBottom: 20,
        alignSelf: 'center',
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    cardSubView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardDetailView: {
        flexDirection: 'row',
        marginTop: 10,
        alignSelf: 'center',
        alignItems: 'center',
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
        marginEnd: 5,
    },
    cardText: {
        fontSize: 16,
        fontWeight: '400',
        color: 'grey',
    },
    rankText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'darkblue',
    },
    content: {
        marginTop: 10,
    },
    cardTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: -5,
        color: '#4a5a96',
        textAlign: 'center',
    },
});

export default styles;
