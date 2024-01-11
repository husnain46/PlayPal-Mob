import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    activityIndicatorWrapper: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    titleView: {
        marginTop: 20,
    },
    teamTitle: {
        fontSize: 24,
        color: '#4a5a96',
        fontWeight: '700',
        textAlign: 'center',
        paddingHorizontal: 25,
    },
    bio: {
        fontSize: 17,
        textAlign: 'center',
        marginTop: 20,
        color: 'black',
        paddingHorizontal: 20,
        marginBottom: 5,
    },
    divider: {
        alignSelf: 'center',
        width: '90%',
        marginBottom: 10,
        marginTop: 5,
    },
    disabledBtn: {
        backgroundColor: 'lightgrey',
        borderRadius: 12,
        width: '46%',

        borderWidth: 1.5,
        borderColor: 'grey',
        opacity: 0.4, // Adjust the opacity to make it visually disabled
    },
    editBtn: {
        borderRadius: 12,
        width: '46%',

        borderWidth: 1.5,
        borderColor: 'grey',
        backgroundColor: 'white',
    },
    inviteTeamBtn: {
        borderRadius: 12,
        backgroundColor: '#2abd89',

        justifyContent: 'center',
        width: '46%',
    },
    detailView: {
        width: '90%',
        justifyContent: 'space-between',
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'darkgrey',
        flexWrap: 'wrap',
        paddingVertical: 5,
    },
    subView: {
        flexDirection: 'row',
        marginVertical: 5,
        marginHorizontal: 10,
        flexWrap: 'wrap',
    },
    dateView: {
        width: '90%',
        justifyContent: 'space-between',
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'darkgrey',
    },
    subView2: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 16,
        color: 'black',
        fontWeight: '600',
        marginRight: 10,
    },
    dateLabel: {
        fontSize: 16,
        color: 'black',
        fontWeight: '600',
        marginRight: 7,
    },
    detailText: {
        fontSize: 16,
        color: 'black',
    },
    sDateText: {
        fontSize: 15.5,
        color: '#0a9464',
    },
    eDateText: {
        fontSize: 15.5,
        color: '#c71013',
    },
    organizerLabel: {
        fontSize: 17,
        color: 'black',
        fontWeight: '600',
        textAlign: 'center',
    },
    divider2: {
        alignSelf: 'center',
        width: '100%',
        marginTop: 5,
    },
    divider3: {
        alignSelf: 'center',
        width: '90%',
    },
    organizer: {
        fontSize: 16,
        color: '#4a5a96',
        textDecorationLine: 'underline',
        fontWeight: '500',
        textAlign: 'center',
        width: '100%',
    },
    totalMatch: {
        fontSize: 22,
        paddingVertical: 15,
        color: '#4a5a96',
        fontWeight: '400',
        textAlign: 'center',
    },
    cardView: {
        marginTop: 20,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: 'white',
        width: '48%',
        height: 110,
        borderWidth: 1,
        borderColor: 'darkgrey',
    },
    reqModalView: {
        flex: 1,
        justifyContent: 'center',
    },
    reqModalInnerView: {
        width: '90%',
        height: 600,
        borderRadius: 15,
        borderWidth: 1,
        backgroundColor: 'white',
        alignSelf: 'center',
        elevation: 20,
    },
    playerLabel: {
        marginLeft: 5,
        fontSize: 17,
        fontWeight: '700',
        color: 'black',
    },
    teamReqView: {
        width: '80%',
        alignSelf: 'center',
        height: 50,
        marginTop: 20,
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'grey',
        borderRadius: 10,
        padding: 5,
    },
    emptyText: {
        fontSize: 17,
        textAlign: 'center',
        marginTop: 40,
        color: 'grey',
    },
    middleBtnView: {
        width: '90%',
        marginTop: 25,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    middleBtnView2: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 20,
    },
    matchesBtn: {
        width: '46%',
        borderRadius: 12,
        justifyContent: 'center',
    },
    disabledBtn2: {
        width: '100%',
        backgroundColor: 'grey',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'grey',
        opacity: 0.4, // Adjust the opacity to make it visually disabled
    },
    reqBtn: {
        borderRadius: 12,
        width: '100%',
        borderWidth: 1.5,
        justifyContent: 'center',
    },
    tableTitle: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: '700',
        color: 'black',
        textDecorationLine: 'underline',
        letterSpacing: 0.5,
    },
    tableHeader: {
        width: '90%',
        height: 50,
        justifyContent: 'space-between',
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#567595',
        elevation: 5,
    },
    headerView1: {
        width: '40%',
        left: 30,
    },
    headerView2: {
        right: -4,
    },
    headerText: {
        fontSize: 17,
        color: 'white',
        fontWeight: '700',
        marginRight: 10,
    },
    teamCard: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'darkgrey',
        marginBottom: 10,
        height: 55,
        alignSelf: 'center',
        alignItems: 'center',
        width: '95%',
        justifyContent: 'space-around',
        borderRadius: 10,
        backgroundColor: 'white',
        paddingLeft: 10,
    },
    cardSubView: {
        flexDirection: 'row',
        width: '41%',
        marginRight: 10,
    },
    cardSubView2: {
        width: '7%',
        marginRight: 20,
        alignItems: 'center',
    },
    cardSubView3: {
        width: 25,
        marginLeft: 15,
        marginRight: 17,
    },
    numText: {
        fontSize: 16,
        color: 'black',
        left: 5,
    },
    teamName: {
        fontSize: 16,
        color: 'black',
        paddingHorizontal: 15,
    },
    pointsText: {
        fontSize: 17,
        color: 'green',
    },
    pointsText2: {
        fontSize: 17,
        color: 'blue',
    },
});

export default styles;
