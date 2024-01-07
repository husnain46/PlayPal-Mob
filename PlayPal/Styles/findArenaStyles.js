import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    titleScreen: {
        fontSize: 20,
        fontWeight: '600',
        color: '#4A5B96',
        textAlign: 'center',
        marginVertical: 10,
    },
    searchView: {
        width: '85%',
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginTop: 25,
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
    centeredView: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalView: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 25,
        alignItems: 'center',
        elevation: 35,
        borderWidth: 2,
    },
    dropView: {
        alignSelf: 'center',
        marginTop: 20,
        width: '90%',
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
        maxHeight: 200,
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
    },
    buttonOpen: {
        backgroundColor: '#11867F',
    },
    buttonClose: {
        backgroundColor: 'red',
        marginRight: 10,
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
    filterBtnView: {
        flexDirection: 'row',
        marginTop: 60,
        marginBottom: 15,
        width: '100%',
        justifyContent: 'space-between',
    },
    resetBtn: {
        borderWidth: 1,
        borderColor: 'grey',
    },
    listView: {
        marginTop: 20,
        width: '100%',
        alignSelf: 'center',
    },
    emptyListText: {
        fontSize: 16,
        color: '#124163',
        textAlign: 'center',
    },
    cardContainer: {
        borderRadius: 13,
        marginBottom: 10,
        width: '85%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'grey',
        elevation: 5,
        padding: 12,
    },
    cardImage: {
        height: 150,
        borderRadius: 10,
    },
    arenaTitle: {
        fontSize: 19,
        color: 'black',
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 5,
    },
    locationText: {
        marginVertical: 2,
        fontSize: 15,
        fontWeight: '400',
        textAlign: 'center',
        color: 'grey',
    },
    infoView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 5,
        paddingHorizontal: 2,
        justifyContent: 'space-between',
    },
    infoSubView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        width: 16,
        height: 16,
    },
    rating: {
        marginLeft: 10,
        fontSize: 17,
        fontWeight: '600',
        color: 'darkblue',
    },
    numRating: {
        marginLeft: 10,
        fontSize: 13,
        color: 'grey',
    },
    priceLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: 'black',
        marginRight: 5,
    },
    price: {
        fontSize: 15,
        color: 'green',
    },
    sportsView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
        alignSelf: 'center',
        width: '100%',
    },
    sportChip: {
        marginTop: 8,
        marginRight: 8,
        backgroundColor: '#d5dbf0',
    },
});

export default styles;
