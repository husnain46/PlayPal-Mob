import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEDED',
    },

    avatar: {
        alignSelf: 'center',
        marginVertical: 20,
        borderWidth: 3,
        borderColor: '#143B63',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsContainer: {
        width: 370,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: 'lightgrey',
        borderRadius: 10,
    },
    listTop: {
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
    },
    listBottom: {
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10,
    },
    icon: {
        width: 35,
        height: 35,
        marginRight: 10,
    },
    topView: {
        alignItems: 'center',
        marginBottom: 20,
    },
    nameText: {
        fontSize: 24,
        fontWeight: '700',
    },
    usernameText: {
        fontSize: 17,
        marginTop: 5,
    },
    ageText: {
        fontSize: 18,
        color: 'grey',
        fontWeight: '500',
    },
    detailTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    detailText: {
        fontSize: 16,
    },
    requestBtnView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    chatButton: {
        width: 120,
        height: 65,
        backgroundColor: '#0084ff',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    acceptButton: {
        width: 90,
        height: 50,
        backgroundColor: '#13ba85',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    removeButton: {
        width: 90,
        height: 50,
        backgroundColor: 'red',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    addButton: {
        width: 120,
        height: 65,
        backgroundColor: '#0084ff',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    sentButton: {
        backgroundColor: '#e8c641',
    },
    unfriendButton: {
        backgroundColor: 'red',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default styles;
