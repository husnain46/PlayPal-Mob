import React, {useRef, useState} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    FlatList,
    Alert,
    ToastAndroid,
    ActivityIndicator,
    Modal,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import cityData from '../Assets/cityData.json';
import {Divider, Icon} from '@rneui/themed';
import AlertPro from 'react-native-alert-pro';
import firestore from '@react-native-firebase/firestore';
import {StackActions} from '@react-navigation/native';

const EditTournament = ({navigation, route}) => {
    const {data, teamsData} = route.params;
    const [teamsList, setTeamsList] = useState(teamsData);
    const [tourName, setTourName] = useState(data.name);
    const [selectedCity, setSelectedCity] = useState(data.city);
    const [open, setOpen] = useState(false);
    const [tourDetail, setTourDetail] = useState(data.detail);
    const [loading, setLoading] = useState(false);

    const isTeamInMatches = (matches, teamId) => {
        return matches.some(
            match =>
                match.teams.team1 === teamId || match.teams.team2 === teamId,
        );
    };

    const searchCity = query => {
        const filteredItems = cityData.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase()),
        );
        return filteredItems;
    };

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

    const renderAlert = (tId, tName, index, isTeamInMatch) => {
        return (
            <AlertPro
                ref={ref => (alertRefs.current[index] = ref)}
                title=""
                message={
                    isTeamInMatch
                        ? `${tName} is already in a match. You cannot remove this team directly`
                        : `Are you sure you want to remove ${tName} from the tournament?`
                }
                onCancel={() => handleClose(index)}
                showConfirm={isTeamInMatch ? false : true}
                textCancel={isTeamInMatch ? 'Ok' : 'No'}
                textConfirm="Yes"
                onConfirm={() => confirmDelete(tId, index)}
                customStyles={{
                    message: {
                        marginTop: -20,
                        marginBottom: 10,
                    },
                    buttonConfirm: {backgroundColor: 'red'},
                    buttonCancel: {
                        backgroundColor: isTeamInMatch ? '#1d4d80' : '#00acef',
                    },
                }}
            />
        );
    };

    const confirmDelete = (tId, index) => {
        const arrayIndex = teamsData.findIndex(team => team.id === tId);
        alertRefs.current[index].close();

        if (arrayIndex !== -1) {
            const updatedTeamsData = [...teamsData];
            updatedTeamsData.splice(arrayIndex, 1);
            setTeamsList(updatedTeamsData);
        }
    };

    const handleUpdateTournament = async () => {
        try {
            setLoading(true);

            const updatedTeams = teamsList.map(item => item.id);

            const tournamentData = {
                name: tourName,
                detail: tourDetail,
                city: selectedCity,
                teamIds: updatedTeams,
            };

            await firestore()
                .collection('tournaments')
                .doc(data.id)
                .update(tournamentData);

            ToastAndroid.show(
                'Tournament updated successfully!',
                ToastAndroid.LONG,
            );

            navigation.goBack();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            ToastAndroid.show(error.message, ToastAndroid.TOP);
        }
    };

    const handleDeleteTournament = async () => {
        try {
            setLoading(true);

            const tournamentRef = firestore()
                .collection('tournaments')
                .doc(data.id);

            await tournamentRef.delete();

            navigation.navigate('BottomTab', {screen: 'Tournament'});

            setLoading(false);
        } catch (error) {
            setLoading(false);
            ToastAndroid.show(error.message, ToastAndroid.TOP);
        }
    };

    const renderItem = ({item, index}) => {
        const num = index + 1;
        const isTeamInMatch = isTeamInMatches(data.matches, item.id);
        return (
            <View style={styles.teamCard}>
                <Text style={styles.teamName}>{`${num})  ${item.name}`}</Text>
                {item.id === data.organizer ? (
                    <></>
                ) : (
                    <Icon
                        name="cancel"
                        color={'#B95252'}
                        size={28}
                        style={styles.removeIcon}
                        type="Icons"
                        onPress={() => showAlert(index)}
                    />
                )}
                {renderAlert(item.id, item.name, index, isTeamInMatch)}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                style={{width: '100%'}}>
                <View style={styles.titleView}>
                    <Text style={styles.titleScreen}>Edit Tournament</Text>
                    <Button
                        mode="contained"
                        style={{borderRadius: 10}}
                        buttonColor="#18ad79"
                        onPress={() => handleUpdateTournament()}>
                        <Text style={styles.updateTxt}>Save</Text>
                    </Button>
                </View>

                <Divider style={styles.divider} width={2} color="grey" />

                <View style={styles.inputView1}>
                    <Text style={styles.labelText}>Tournament title:</Text>
                    <TextInput
                        mode="outlined"
                        value={tourName}
                        onChangeText={text => setTourName(text)}
                        style={styles.input1}
                        outlineStyle={styles.outline}
                    />
                </View>

                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={loading}>
                    <View style={styles.modalBackground}>
                        <View style={styles.activityIndicatorWrapper}>
                            <ActivityIndicator
                                size="large"
                                color="#0000ff"
                                animating={loading}
                            />
                        </View>
                    </View>
                </Modal>

                <View style={styles.dropView}>
                    <Text style={styles.labelText}>Tournament city:</Text>
                    <DropDownPicker
                        style={styles.dropDown}
                        labelStyle={{fontSize: 17}}
                        open={open}
                        value={selectedCity}
                        items={cityData.map(item => ({
                            label: item.city,
                            value: item.city,
                        }))}
                        textStyle={{fontSize: 17}}
                        setOpen={setOpen}
                        setValue={setSelectedCity}
                        listMode="MODAL"
                        searchable={true}
                        searchPlaceholder="Type city name"
                        placeholder="Select city"
                        placeholderStyle={{color: '#11867F'}}
                        searchableError={() => <Text>City not found</Text>}
                        dropDownContainerStyle={{width: 250}}
                        onChangeSearch={query => searchCity(query)}
                        onClose={() => setOpen(false)}
                    />
                </View>
                <View style={{marginTop: 20}}>
                    <Text style={styles.labelText}>Tournament details:</Text>
                    <TextInput
                        multiline={true}
                        mode="outlined"
                        numberOfLines={4}
                        value={tourDetail}
                        onChangeText={text => setTourDetail(text)}
                        style={styles.detailInput}
                        outlineStyle={styles.outline}
                        outlineColor="black"
                    />
                </View>
                <View style={{marginTop: 20, width: 300}}>
                    <Text style={styles.teamLabel}>Teams:</Text>
                </View>
                <FlatList
                    data={teamsList}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    contentContainerStyle={{
                        paddingHorizontal: 10,
                    }}
                />

                <View style={styles.updateView}>
                    <Button
                        style={{borderRadius: 10}}
                        mode="contained"
                        buttonColor="red"
                        onPress={() => handleDeleteTournament()}>
                        <Text style={styles.updateTxt}>Delete tournament</Text>
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

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
    scrollView: {
        alignItems: 'center',
        paddingBottom: 60,
    },
    titleView: {
        width: '90%',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleScreen: {
        fontSize: 26,
        fontWeight: '700',
        color: '#4a5a96',
    },
    divider: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 10,
        marginBottom: 20,
    },
    inputView1: {
        marginTop: 20,
    },
    input1: {
        backgroundColor: 'white',
        width: 300,
        marginVertical: 6,
    },
    outline: {
        borderRadius: 8,
    },
    pickerView: {
        marginTop: 20,
        alignSelf: 'flex-start',
    },
    pickerBox: {
        fontSize: 17,
    },
    pickerStyle: {
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'white',
    },
    labelText: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: '500',
        color: 'black',
    },
    dropView: {
        zIndex: 2,
        marginRight: 50,
        marginTop: 20,
    },
    dropDown: {
        width: 250,
        borderColor: 'darkgrey',
        borderWidth: 2,
        height: 60,
        borderRadius: 10,
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
        marginRight: 10,
    },
    updateView: {
        marginTop: 50,
    },
    updateTxt: {
        fontSize: 17,
        color: 'white',
        fontWeight: '600',
    },
});

export default EditTournament;
