import {StyleSheet, Dimensions} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    carouselImage: {
        width: Dimensions.get('window').width,
        height: 230,
    },
    paginationContainer: {
        marginTop: -10,
        marginBottom: -20,
        alignSelf: 'center',
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 1)',
    },
    modalImage: {
        width: Dimensions.get('window').width,
        height: '100%',
        marginTop: -30,
    },
    closeButton: {
        marginTop: 20,
        alignSelf: 'flex-end',
        width: 30,
        height: 30,
        marginRight: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    arenaTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#4a5a96',
        textAlign: 'center',
        width: '80%',
        fontStyle: 'italic',
        marginTop: 15,
    },
    cityText: {
        fontSize: 16,
        color: 'black',
        marginTop: 5,
        fontWeight: '600',
    },
    divider: {
        width: '91%',
        marginTop: 10,
        alignSelf: 'center',
    },
    divider2: {
        width: '93%',
        marginTop: 10,
        alignSelf: 'center',
    },
    detailView: {
        width: '90%',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        paddingHorizontal: 15,
        paddingTop: 5,
    },
    subView: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    contactIcons: {
        marginRight: 10,
    },
    detailLabel: {
        fontSize: 17,
        color: 'black',
        fontWeight: '700',
        marginRight: 10,
    },
    detailText: {
        fontSize: 16,
        color: 'black',
    },
    mapBtn: {
        width: 110,
        height: 38,
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 15,
        borderRadius: 12,
        backgroundColor: '#05b08e',
        elevation: 5,
    },
    mapText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginRight: 15,
    },
    mainView: {
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        width: '90%',
        marginVertical: 20,
    },
    sportsTitle: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: '700',
        color: 'black',
        marginLeft: 15,
    },
    sportsView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '95%',
        paddingHorizontal: 8,
        paddingTop: 12,
        alignSelf: 'center',
    },
    sportChip: {
        marginRight: 8,
        marginBottom: 10,
        backgroundColor: '#d5dbf0',
    },
    facilitiesTitle: {
        marginTop: 15,
        marginLeft: 15,
        fontSize: 18,
        fontWeight: '700',
        color: 'black',
    },
    facilitiesView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '95%',
        paddingHorizontal: 3,
        paddingTop: 12,
        paddingBottom: 10,
        alignSelf: 'center',
    },
    facilitySubView: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
        marginLeft: 5,
    },
    facilityText: {
        fontSize: 16,
        color: 'black',
        marginLeft: 7,
        marginRight: 20,
    },
    bookView: {
        width: '100%',
        alignItems: 'center',
    },
    bookBtn: {
        width: 150,
        height: 38,
        justifyContent: 'center',
        backgroundColor: '#4a5a96',
        elevation: 5,
        borderRadius: 10,
    },
    bookText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
    ratingTitle: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: '700',
        color: 'black',
        textDecorationLine: 'underline',
    },
    ratingView: {
        width: '90%',
        maxHeight: 350,
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        marginBottom: 20,
        padding: 10,
    },
    ratingSubView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoSubView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: -5,
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
        color: 'grey',
    },
    ratingItem: {
        marginTop: 10,
        width: '95%',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        padding: 8,
        alignSelf: 'center',
    },
    reviewUserText: {
        fontSize: 14,
        width: 80,
        color: 'grey',
    },
    timeElapsed: {
        fontSize: 14,
        textAlignVertical: 'center',
        color: 'grey',
    },
    ratingValue: {
        fontSize: 15,
        color: 'black',
        marginRight: 10,
        marginLeft: 10,
    },
    reviewText: {
        fontSize: 15,
        marginTop: 8,
        color: 'black',
    },
});

export default styles;
