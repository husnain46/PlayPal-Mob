import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ToastAndroid,
    Modal,
    ActivityIndicator,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {Divider} from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import firestore from '@react-native-firebase/firestore';

const EditMatch = ({navigation, route}) => {
    const {tournamentId, match, teamsData} = route.params;
    const [matchTitle, setMatchTitle] = useState(match.title);
    const [selectedDate, setSelectedDate] = useState(match.date.toDate());
    const [showPicker1, setShowPicker1] = useState(false);
    const [selectedTime, setSelectedTime] = useState(match.time.toDate());
    const [showPicker2, setShowPicker2] = useState(false);
    const [selectedTeam1, setSelectedTeam1] = useState(match.teams.team1);
    const [selectedTeam2, setSelectedTeam2] = useState(match.teams.team2);
    const [isLoading, setIsLoading] = useState(false);

    const tournamentTeams = teamsData.map(team => ({
        label: team.name,
        value: team.id,
    }));

    const currentDate = new Date();
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    const maxDate = new Date();
    maxDate.setMonth(currentDate.getMonth() + 12);

    const handleDateChange = (event, selected) => {
        setShowPicker1(false);
        if (selected) {
            setSelectedDate(selected);
        }
    };

    const handleTimeChange = (event, selected) => {
        setShowPicker2(false);
        if (selected) {
            setSelectedTime(selected);
        }
    };

    const filteredTeams = teamSelected => {
        return tournamentTeams.filter(team => team.value !== teamSelected);
    };

    const handleUpdateMatch = async () => {
        try {
            setIsLoading(true);
            const tournamentRef = firestore()
                .collection('tournaments')
                .doc(tournamentId);
            const tournamentDoc = await tournamentRef.get();

            if (tournamentDoc.exists) {
                const tournamentData = tournamentDoc.data();

                const updatedMatches = tournamentData.matches.map(item => {
                    if (
                        item.title === match.title &&
                        item.date.isEqual(match.date) &&
                        item.time.isEqual(match.time)
                    ) {
                        return {
                            title: matchTitle.trim(),
                            date: selectedDate,
                            time: selectedTime,
                            teams: {
                                team1: selectedTeam1,
                                team2: selectedTeam2,
                            },
                            result: {
                                scoreTeam1: item.result.scoreTeam1,
                                scoreTeam2: item.result.scoreTeam2,
                            },
                            status: item.status,
                        };
                    } else {
                        return item; // Keep other matches unchanged
                    }
                });

                // Update the tournament document with the modified matches array
                await tournamentRef.update({matches: updatedMatches});

                ToastAndroid.show(
                    'Match updated successfully!',
                    ToastAndroid.LONG,
                );

                setIsLoading(false);

                navigation.goBack();
            }
        } catch (error) {
            setIsLoading(false);
            ToastAndroid.show(error.message, ToastAndroid.TOP);
        }
    };

    const handleDeleteMatch = async () => {
        try {
            setIsLoading(true);

            const tournamentRef = firestore()
                .collection('tournaments')
                .doc(tournamentId);

            const tournamentDoc = await tournamentRef.get();

            if (tournamentDoc.exists) {
                const tournamentData = tournamentDoc.data();

                const matchIndexToDelete = tournamentData.matches.findIndex(
                    item =>
                        item.title === match.title &&
                        item.date.isEqual(match.date) &&
                        item.time.isEqual(match.time),
                );

                if (matchIndexToDelete !== -1) {
                    const updatedMatches = tournamentData.matches.filter(
                        (item, index) => index !== matchIndexToDelete,
                    );

                    await tournamentRef.update({matches: updatedMatches});
                    ToastAndroid.show('Match deleted!', ToastAndroid.LONG);
                } else {
                    ToastAndroid.show(
                        'Match could not be deleted!',
                        ToastAndroid.LONG,
                    );
                }
            }

            setIsLoading(false);
            navigation.goBack();
        } catch (error) {
            setIsLoading(false);
            ToastAndroid.show(error.message, ToastAndroid.TOP);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.screenTitle}>Edit Match</Text>

            <Divider style={styles.divider} width={2} color="lightgrey" />

            <View style={styles.inputView1}>
                <Text style={styles.labelText}>Match title:</Text>
                <TextInput
                    mode="outlined"
                    placeholder="Group Stage/Qualifier/Semi-Final..."
                    placeholderTextColor={'grey'}
                    value={matchTitle}
                    onChangeText={text => setMatchTitle(text)}
                    style={styles.input1}
                    outlineStyle={styles.outline}
                />
            </View>

            <View style={styles.dateView}>
                <Text style={styles.dateLabel}>Match date:</Text>
                <Button
                    mode="contained-tonal"
                    style={styles.dateBox}
                    buttonColor="#cfdfe8"
                    onPress={() => setShowPicker1(true)}>
                    {selectedDate ? (
                        <Text style={styles.dateText}>
                            {selectedDate.toLocaleDateString('en-GB')}
                        </Text>
                    ) : (
                        <Text style={styles.datePlaceholder}>Select date</Text>
                    )}
                </Button>
                {showPicker1 && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="compact"
                        minimumDate={nextDay}
                        maximumDate={maxDate}
                        onChange={handleDateChange}
                    />
                )}
            </View>

            <View style={styles.dateView}>
                <Text style={styles.dateLabel}>Match time:</Text>
                <Button
                    mode="contained-tonal"
                    buttonColor="#cfdfe8"
                    style={styles.dateBox}
                    onPress={() => setShowPicker2(true)}>
                    {selectedTime ? (
                        <Text style={styles.dateText}>
                            {selectedTime.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    ) : (
                        <Text style={styles.datePlaceholder}>Select time</Text>
                    )}
                </Button>
                {showPicker2 && (
                    <DateTimePicker
                        value={selectedTime}
                        mode="time"
                        display="default"
                        onChange={handleTimeChange}
                    />
                )}
            </View>

            <Modal
                transparent={true}
                animationType={'none'}
                visible={isLoading}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator
                            size="large"
                            color="#0000ff"
                            animating={isLoading}
                        />
                    </View>
                </View>
            </Modal>

            <View style={styles.dropView}>
                <Text style={styles.dropLabel}>Team 1:</Text>
                <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    containerStyle={styles.dropContainer}
                    iconStyle={styles.iconStyle}
                    data={filteredTeams(selectedTeam2)}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={'Select team 1'}
                    value={selectedTeam1}
                    onChange={item => setSelectedTeam1(item)}
                />
            </View>

            <View style={styles.dropView}>
                <Text style={styles.dropLabel}>Team 2:</Text>
                <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    containerStyle={styles.dropContainer}
                    iconStyle={styles.iconStyle}
                    data={filteredTeams(selectedTeam1)}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={'Select team 2'}
                    value={selectedTeam2}
                    onChange={item => setSelectedTeam2(item)}
                />
            </View>
            <View
                style={{
                    width: '75%',
                    flexDirection: 'row',
                    marginTop: 100,
                    justifyContent: 'space-between',
                }}>
                <Button
                    style={{borderRadius: 10}}
                    mode="contained"
                    buttonColor="red"
                    onPress={() => handleDeleteMatch()}>
                    <Text
                        style={{
                            fontSize: 18,
                            color: 'white',
                            paddingTop: 1,
                        }}>
                        Delete
                    </Text>
                </Button>

                <Button
                    style={{borderRadius: 10, width: 100}}
                    mode="contained"
                    buttonColor="#22446c"
                    onPress={() => handleUpdateMatch()}>
                    <Text
                        style={{
                            fontSize: 18,
                            color: 'white',
                            paddingTop: 1,
                        }}>
                        Save
                    </Text>
                </Button>
            </View>
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
    screenTitle: {
        fontSize: 26,
        color: '#4a5a96',
        fontWeight: '700',
        marginTop: 30,
    },
    divider: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 10,
        marginBottom: 10,
    },
    inputView1: {
        marginTop: 20,
    },
    labelText: {
        fontSize: 17,
        fontWeight: '500',
        color: 'black',
    },
    input1: {
        backgroundColor: 'white',
        width: 300,
        marginVertical: 6,
    },
    outline: {
        borderRadius: 8,
    },
    dateView: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        width: 300,
        marginBottom: 10,
    },
    dateLabel: {
        fontSize: 17,
        fontWeight: '500',
        color: 'black',
        textAlignVertical: 'center',
        marginRight: 40,
    },
    dateBox: {
        width: 160,
        marginLeft: 10,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 17,
        fontWeight: '500',
        color: '#4a5a96',
        paddingHorizontal: 0,
    },
    datePlaceholder: {
        paddingHorizontal: 0,
        fontSize: 16,
        fontWeight: '500',
        color: '#4a5a96',
    },
    dropView: {
        width: 300,
        marginTop: 20,
    },
    dropdown: {
        height: 50,
        width: 250,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white',
    },
    dropLabel: {
        fontSize: 17,
        fontWeight: '500',
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
});
export default EditMatch;
