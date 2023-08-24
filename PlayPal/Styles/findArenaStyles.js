import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    titleScreen: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4A5B96',
        textAlign: 'center',
        marginVertical: 10,
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
        width: 290,
        height: 50,
        marginEnd: 30,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'darkgrey',
    },
    filter: {
        width: 25,
        height: 25,
        top: 2,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalView: {
        width: 300,
        height: 320,
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 25,
        alignItems: 'center',
        elevation: 35,
        borderWidth: 3,
    },
    dropView: {
        alignSelf: 'center',
        marginTop: 20,
    },
    dropdown: {
        height: 50,
        width: 200,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white',
    },
    dropLabel: {
        fontSize: 17,
        fontWeight: '700',
        color: 'black',
        marginBottom: 10,
    },
    dropContainer: {
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'grey',
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
    filterLabel: {
        fontSize: 17,
        marginBottom: 10,
        fontWeight: '700',
        color: 'black',
    },
    filterBtnView: {
        flexDirection: 'row',
        marginTop: 55,
        left: 10,
    },
    resetBtn: {
        marginEnd: 65,
        borderWidth: 1,
        borderColor: 'grey',
    },
    listView: {
        marginTop: 30,
        width: '100%',
        alignSelf: 'center',
    },
    cardContainer: {
        borderRadius: 13,
        marginBottom: 10,
        overflow: 'hidden',
        width: '100%',
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: 'lightgrey',
        elevation: 5,
    },
    cardImage: {
        height: 160,
        borderRadius: 10,
    },
    arenaTitle: {
        fontSize: 20,
        color: 'black',
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 10,
    },
    locationText: {
        marginVertical: 2,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    infoView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        justifyContent: 'space-between',
    },
    infoSubView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        width: 18,
        height: 18,
    },
    rating: {
        marginLeft: 10,
        fontSize: 17,
        fontWeight: '600',
        color: 'darkblue',
    },
    numRating: {
        marginLeft: 10,
        fontSize: 14,
    },
    priceLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
        marginRight: 5,
    },
    price: {
        fontSize: 16,
    },
    sportsView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 15,
        alignSelf: 'center',
        width: 315,
    },
    sportChip: {
        marginTop: 8,
        marginRight: 8,
        backgroundColor: '#d5dbf0',
    },
});

export default styles;
