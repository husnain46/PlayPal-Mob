import React, {useRef, useState} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
} from 'react-native';
import {Button, IconButton, TextInput} from 'react-native-paper';
import getPlayerData from '../Functions/getPlayerData';
import AlertPro from 'react-native-alert-pro';

const EditTeam = ({navigation, route}) => {
    const {myTeam} = route.params;

    const [teamName, setTeamName] = useState(myTeam.name);
    const [teamDetail, setTeamDetail] = useState(myTeam.description);
    const [listRefresh, setListRefresh] = useState(false);

    const alertRefs = useRef([]);
    const showAlert = index => {
        if (alertRefs.current[index]) {
            alertRefs.current[index].open();
        }
    };

    const handleClose = index => {
        if (alertRefs.current[index]) {
            alertRefs.current[index].close();
        }
    };

    const renderAlert = (pId, pName, index) => {
        return (
            <AlertPro
                ref={ref => (alertRefs.current[index] = ref)}
                title={''}
                message={`Do want to remove ${pName} from this team?`}
                onCancel={() => handleClose(index)}
                textCancel="No"
                textConfirm="Yes"
                onConfirm={() => confirmDelete(pId)}
                customStyles={{
                    message: {marginTop: -20, marginBottom: 10},
                }}
            />
        );
    };

    const confirmDelete = pId => {
        const index = myTeam.playersId.indexOf(pId);
        if (index !== -1) {
            myTeam.playersId.splice(index, 1);
        }
        setListRefresh(prevState => !prevState);
    };

    const renderItem = ({item, index}) => {
        const player = getPlayerData(item);
        const fullName = `${player.firstName} ${player.lastName}`;

        const num = index + 1;
        return (
            <View style={styles.teamCard}>
                <Text style={styles.teamName}>{`${num})  ${fullName}`}</Text>
                {item === myTeam.captainId ? (
                    <Image
                        source={require('../Assets/Icons/captain.png')}
                        style={{marginRight: 14}}
                    />
                ) : (
                    <IconButton
                        icon="close-circle"
                        iconColor={'#B95252'}
                        size={28}
                        style={styles.removeIcon}
                        onPress={() => showAlert(index)}
                    />
                )}
                {renderAlert(item, fullName, index)}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                style={{width: '100%'}}>
                <Text style={styles.titleScreen}>Edit Team</Text>

                <View style={styles.inputView1}>
                    <Text style={styles.labelText}>Team name:</Text>

                    <TextInput
                        style={styles.textInput1}
                        outlineStyle={styles.inputOutline}
                        contentStyle={styles.inputText}
                        mode="outlined"
                        value={teamName}
                        onChangeText={text => setTeamName(text)}
                        outlineColor="black"
                    />
                </View>

                <View style={{marginTop: 20}}>
                    <Text style={styles.labelText}>Team detail:</Text>
                    <TextInput
                        multiline={true}
                        mode="outlined"
                        numberOfLines={4}
                        value={teamDetail}
                        onChangeText={text => setTeamDetail(text)}
                        style={styles.detailInput}
                        outlineStyle={styles.inputOutline}
                        outlineColor="black"
                    />
                </View>
                <View style={{marginTop: 20, width: 300}}>
                    <Text style={styles.teamLabel}>Players:</Text>
                </View>
                <FlatList
                    data={myTeam.playersId}
                    renderItem={renderItem}
                    extraData={listRefresh}
                    keyExtractor={item => item}
                    scrollEnabled={false}
                    contentContainerStyle={{
                        paddingHorizontal: 10,
                    }}
                />
                <Button
                    mode="outlined"
                    buttonColor="#348883"
                    style={styles.updateBtn}>
                    <Text style={styles.updateTxt}>Update</Text>
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    scrollView: {
        alignItems: 'center',
        paddingBottom: 50,
    },
    titleScreen: {
        fontSize: 26,
        fontWeight: '700',
        color: '#4a5a96',
        marginVertical: 30,
        marginBottom: 40,
    },
    inputView1: {
        marginVertical: 5,
    },
    textInput1: {
        width: 300,
        height: 50,
        backgroundColor: 'white',
    },
    inputOutline: {
        borderRadius: 10,
    },

    inputText: {
        fontSize: 17,
        height: 55,
    },

    labelText: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: '500',
        color: 'black',
    },
    detailInput: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    teamLabel: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: '500',
        color: 'black',
    },
    teamCard: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'lightgrey',
        marginBottom: 10,
        height: 55,
        alignSelf: 'center',
        alignItems: 'center',
        width: 300,
        justifyContent: 'space-between',
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
    },
    teamName: {
        fontSize: 17,
        color: 'black',
        paddingHorizontal: 10,
    },
    removeIcon: {
        marginRight: 5,
    },
    updateBtn: {
        marginTop: 30,
    },
    updateTxt: {
        fontSize: 17,
        color: 'white',
        fontWeight: '600',
    },
});
export default EditTeam;
