import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEDED',
    },
    headerView: {
        width: '100%',
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        backgroundColor: '#4a5a96',
        alignItems: 'center',
        height: 70,
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        fontStyle: 'italic',
        color: 'white',
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
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalView: {
        width: '100%',
        height: 430,
        backgroundColor: 'white',
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 25,
        alignItems: 'center',
        elevation: 35,
        borderWidth: 2,
    },
    dropView: {
        alignSelf: 'flex-start',
        width: '100%',
        marginTop: 10,
        marginBottom: 20,
    },
    dropdown: {
        height: 50,
        width: '100%',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white',
    },
    dropLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: 'black',
        marginBottom: 5,
    },
    dropContainer: {
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'grey',
        maxHeight: 250,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#11867F',
    },
    iconStyle: {
        width: 25,
        height: 25,
        tintColor: 'black',
    },
    dropItemText: {
        height: 22,
        color: 'black',
    },
    dropItem: {
        height: 45,
        justifyContent: 'center',
    },
    dropSearch: {
        height: 40,
        fontSize: 16,
        borderColor: 'black',
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
        height: 50,
    },
    pickerStyle: {
        borderRadius: 10,
        height: 50,

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
        marginTop: -5,
        color: '#4a5a96',
        textAlign: 'center',
    },
    locIcon: {
        width: 16,
        height: 16,
        marginRight: 5,
    },
    cityText: {
        fontSize: 16,
        color: 'black',
    },
});

export default styles;
