import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEDED',
    },
    topTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#4a5a96',
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
        width: 250,
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
        marginTop: 45,
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
        marginTop: 30,
        alignItems: 'center',
    },
    card: {
        margin: 10,
        height: 315,
        borderRadius: 10,
        elevation: 3,
        width: 310,
        borderWidth: 3,
        borderColor: 'lightgrey',
        backgroundColor: 'white',
    },
    cardImage: {
        width: 280,
        height: 170,
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 10,
    },
    cardSubView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardDetailView: {
        flexDirection: 'row',
        marginTop: 10,
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: 'black',
        marginEnd: 10,
    },
    cardText: {
        fontSize: 16,
        fontWeight: '700',
    },
    content: {
        padding: 15,
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
