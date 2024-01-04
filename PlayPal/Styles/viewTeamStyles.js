import {StyleSheet, Dimensions} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    mainImage: {
        width: Dimensions.get('window').width,
        height: 250,
        top: -2,
    },
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeTouchable: {
        position: 'absolute',
        alignItems: 'center',
        top: 30,
        right: 10,
        width: 40,
        height: 30,
    },
    closeText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    teamTitle: {
        fontSize: 22,
        color: '#4a5a96',
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 10,
        width: 250,
    },
    editIcon: {
        width: 40,
        alignSelf: 'flex-end',
        marginTop: -40,
        marginBottom: -10,
        right: 10,
    },
    bio: {
        fontSize: 16.5,
        textAlign: 'center',
        marginTop: 15,
        width: '90%',
    },
    divider: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 10,
    },
    divider2: {
        alignSelf: 'center',
        width: '89%',
        marginBottom: 20,
    },
    divider3: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 15,
    },
    invitesBtn: {
        width: 100,
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#28b57a',
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailView: {
        width: '90%',
        marginTop: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
    },
    subView1: {
        flexDirection: 'row',
        padding: 15,
    },
    subView2: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    detailLabel: {
        fontSize: 17,
        color: 'black',
        fontWeight: '700',
        marginRight: 5,
    },
    detailText: {
        fontSize: 17,
        color: 'black',
    },
    cardView: {
        marginTop: 15,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: 'white',
        width: '49%',
    },
    reqModalView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
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
    modelHeaderView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    modelTitle: {
        fontSize: 22,
        flex: 1,
        left: 25,
        textAlign: 'center',
        color: '#4a5a96',
        fontWeight: '700',
    },
    emptyList: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
        paddingHorizontal: 40,
        color: 'grey',
    },
    teamInfoBtnView: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 15,
        width: '100%',
    },
    tournamentBtn: {
        backgroundColor: '#eba421',
        borderRadius: 12,
        height: 40,
        justifyContent: 'center',
    },
    tournamentBtnText: {
        fontSize: 15,
        fontWeight: '500',
        color: 'white',
        paddingHorizontal: 10,
    },
    teamReqBtn: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#4a5a96',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderRadius: 12,
    },
    teamReqText: {
        fontSize: 15,
        color: 'white',
        fontWeight: '600',
        paddingHorizontal: 10,
    },
    badge: {
        marginRight: -30,
        right: 10,
        marginBottom: 40,
    },
    playersView: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
    },
    playerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: 'black',
        textDecorationLine: 'underline',
        letterSpacing: 1,
    },
    leaveButton: {
        borderRadius: 12,
        width: 110,
    },
    acceptBtn: {
        borderRadius: 12,
    },
    joinButton: {
        borderRadius: 12,
        width: 90,
        height: 40,
    },
    requestSentButton: {
        borderRadius: 12,
        width: 140,
        height: 40,
        backgroundColor: '#ccc',
    },
    listView: {
        width: '100%',
        paddingBottom: 30,
    },
    playerLabel: {
        marginLeft: 5,
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
    },
    playerText: {
        fontSize: 16,
        color: 'grey',
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    playersContainer: {
        width: '92%',
        alignSelf: 'center',
        height: 50,
        marginTop: 20,
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'grey',
        borderRadius: 10,
        padding: 5,
    },
    tourInvitesView: {
        width: '85%',
        alignSelf: 'center',
        height: 50,
        marginTop: 20,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tourNameBtn: {
        width: '65%',
    },
    tourInvitesBtnView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '35%',
        height: 50,
        justifyContent: 'space-evenly',
    },
    userReqView: {
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
    card1: {
        marginVertical: 10,
        borderRadius: 15,
        elevation: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'darkgrey',
        width: '85%',
        alignSelf: 'center',
    },

    title: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 2,
        color: 'black',
    },
    subtitle: {
        fontSize: 17,
    },
    locIcon: {
        width: 18,
        height: 18,
        marginRight: 10,
    },
    winIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    cityText: {
        fontSize: 16,
        color: 'darkblue',
    },
    winText: {
        fontSize: 16,
        color: '#098f60',
    },
});

export default styles;
