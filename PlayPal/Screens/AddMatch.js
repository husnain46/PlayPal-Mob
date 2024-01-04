import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {Divider} from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

const AddMatch = ({navigation, route}) => {
    const {data, teamsData, isCricket} = route.params;
    const [matchTitle, setMatchTitle] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [showPicker1, setShowPicker1] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);
    const [showPicker2, setShowPicker2] = useState(false);
    const [selectedTeam1, setSelectedTeam1] = useState('');
    const [selectedTeam2, setSelectedTeam2] = useState('');
    const [loading, setLoading] = useState(false);
    const [minDate, setMinDate] = useState(data.start_date.toDate());
    const finalExists = data.matches.some(match => match.title === 'Final');
    const semi1Exists = data.matches.some(
        match => match.title === 'Semi-Final 1',
    );
    const semi2Exists = data.matches.some(
        match => match.title === 'Semi-Final 2',
    );

    const maxDate = data.end_date.toDate();

    const [errors, setErrors] = useState({
        matchTitle: '',
        date: '',
        time: '',
        team1: '',
        team2: '',
    });

    const matchTypes = [
        {label: 'Group Stage', value: 'Group Stage'},
        {label: 'Knockout', value: 'Knockout'},
        {label: 'Semi-Final 1', value: 'Semi-Final 1'},
        {label: 'Semi-Final 2', value: 'Semi-Final 2'},
        {label: 'Final', value: 'Final'},
    ];

    const newMatchTypes = matchTypes.filter(
        matchType => matchType.label !== 'Final',
    );

    useEffect(() => {
        const currentDate = new Date();
        if (currentDate > data.start_date.toDate()) {
            setMinDate(currentDate);
        } else {
            setMinDate(data.start_date.toDate());
        }
    }, []);

    const tournamentTeams = teamsData.map(team => ({
        label: team.name,
        value: team.id,
    }));

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

    const handleAddMatch = async () => {
        let hasError = false;

        if (!matchTitle.trim()) {
            setErrors(prevState => ({
                ...prevState,
                matchTitle: 'Please select a match title.',
            }));
            hasError = true;
        } else {
            setErrors(prevState => ({
                ...prevState,
                matchTitle: '',
            }));
        }

        if (selectedDate === null) {
            setErrors(prevState => ({
                ...prevState,
                date: 'Please select match date.',
            }));
            hasError = true;
        } else {
            setErrors(prevState => ({
                ...prevState,
                date: '',
            }));
        }

        if (selectedTime === null) {
            setErrors(prevState => ({
                ...prevState,
                time: 'Please select match time.',
            }));
            hasError = true;
        } else {
            setErrors(prevState => ({
                ...prevState,
                time: '',
            }));
        }

        if (selectedTeam1 === '') {
            setErrors(prevState => ({
                ...prevState,
                team1: 'Please select team 1.',
            }));
            hasError = true;
        } else {
            setErrors(prevState => ({
                ...prevState,
                team1: '',
            }));
        }

        if (selectedTeam2 === '') {
            setErrors(prevState => ({
                ...prevState,
                team2: 'Please select team 2.',
            }));
            hasError = true;
        } else {
            setErrors(prevState => ({
                ...prevState,
                team2: '',
            }));
        }

        if (hasError) {
            return;
        }

        try {
            setLoading(true);
            let matchData;
            if (isCricket) {
                matchData = {
                    title: matchTitle.trim(),
                    date: selectedDate,
                    time: selectedTime,
                    status: 'Upcoming',
                    teams: {
                        team1: selectedTeam1,
                        team2: selectedTeam2,
                    },
                    result: {
                        scoreTeam1: 0,
                        wicketsT1: 0,
                        scoreTeam2: 0,
                        wicketsT2: 0,
                    },
                };
            } else {
                matchData = {
                    title: matchTitle.trim(),
                    date: selectedDate,
                    time: selectedTime,
                    status: 'Upcoming',
                    teams: {
                        team1: selectedTeam1,
                        team2: selectedTeam2,
                    },
                    result: {
                        scoreTeam1: 0,
                        scoreTeam2: 0,
                    },
                };
            }

            await firestore()
                .collection('tournaments')
                .doc(data.id)
                .update({
                    matches: firestore.FieldValue.arrayUnion(matchData),
                });

            navigation.goBack();

            Toast.show({
                type: 'success',
                text1: 'A new match added successfully!',
            });

            setLoading(false);
        } catch (error) {
            setLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.screenTitle}>New Match</Text>

            <Divider style={styles.divider} width={2} color="lightgrey" />

            <View style={styles.dateView}>
                <Text style={styles.dateLabel}>Match date:</Text>
                <Button
                    mode="contained-tonal"
                    style={styles.dateBox}
                    buttonColor="#cfdfe8"
                    onPress={() => setShowPicker1(true)}>
                    {selectedDate !== null ? (
                        <Text style={styles.dateText}>
                            {selectedDate.toLocaleDateString('en-GB')}
                        </Text>
                    ) : (
                        <Text style={styles.datePlaceholder}>Select Date</Text>
                    )}
                </Button>

                {showPicker1 && (
                    <DateTimePicker
                        value={minDate}
                        mode="date"
                        display="compact"
                        minimumDate={minDate}
                        maximumDate={maxDate}
                        onChange={handleDateChange}
                    />
                )}
            </View>
            {errors.date ? (
                <Text style={styles.dateError}>{errors.date}</Text>
            ) : null}

            {selectedDate !== null && (
                <View style={styles.dateView}>
                    <Text style={styles.dateLabel}>Match time:</Text>
                    <Button
                        mode="contained-tonal"
                        buttonColor="#cfdfe8"
                        style={styles.dateBox}
                        onPress={() => setShowPicker2(true)}>
                        {selectedTime !== null ? (
                            <Text style={styles.dateText}>
                                {selectedTime.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                        ) : (
                            <Text style={styles.datePlaceholder}>
                                Select time
                            </Text>
                        )}
                    </Button>

                    {showPicker2 && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="time"
                            display="default"
                            minimumDate={selectedDate}
                            onChange={handleTimeChange}
                        />
                    )}
                </View>
            )}

            {selectedDate !== null && errors.time ? (
                <Text style={styles.dateError}>{errors.time}</Text>
            ) : null}

            <View style={styles.dropView}>
                <Text style={styles.dropLabel}>Match title:</Text>
                <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    containerStyle={styles.dropContainer}
                    itemTextStyle={{color: 'black', fontSize: 14}}
                    iconStyle={styles.iconStyle}
                    data={finalExists ? newMatchTypes : matchTypes}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={'Select Match Title'}
                    placeholderStyle={{color: 'grey', fontSize: 14}}
                    value={matchTitle}
                    onChange={item => setMatchTitle(item.value)}
                />
                {errors.matchTitle ? (
                    <Text style={styles.errorText}>{errors.matchTitle}</Text>
                ) : null}
            </View>

            <View style={styles.dropView}>
                <Text style={styles.dropLabel}>Team 1:</Text>
                <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    containerStyle={styles.dropContainer}
                    itemTextStyle={{color: 'black', fontSize: 14}}
                    iconStyle={styles.iconStyle}
                    placeholderStyle={{color: 'grey', fontSize: 14}}
                    data={filteredTeams(selectedTeam2)}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={'Select team 1'}
                    value={selectedTeam1}
                    onChange={item => setSelectedTeam1(item.value)}
                />
                {errors.team1 ? (
                    <Text style={styles.errorText}>{errors.team1}</Text>
                ) : null}
            </View>

            <View style={styles.dropView}>
                <Text style={styles.dropLabel}>Team 2:</Text>
                <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    containerStyle={styles.dropContainer}
                    iconStyle={styles.iconStyle}
                    itemTextStyle={{color: 'black', fontSize: 14}}
                    placeholderStyle={{color: 'grey', fontSize: 14}}
                    data={filteredTeams(selectedTeam1)}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={'Select team 2'}
                    value={selectedTeam2}
                    onChange={item => setSelectedTeam2(item.value)}
                />
                {errors.team2 ? (
                    <Text style={styles.errorText}>{errors.team2}</Text>
                ) : null}
            </View>

            <View style={{marginTop: 50}}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Button
                        mode="contained"
                        buttonColor="#1cad73"
                        onPress={() => handleAddMatch()}>
                        <Text
                            style={{
                                fontSize: 18,
                                color: 'white',
                                paddingTop: 1,
                            }}>
                            Add match
                        </Text>
                    </Button>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    screenTitle: {
        fontSize: 22,
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
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
    },
    dateError: {
        color: 'red',
        fontSize: 14,
        textAlign: 'right',
        width: '75%',
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
        fontWeight: '400',
        color: 'grey',
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
        fontSize: 14,
        color: '#11867F',
    },
    iconStyle: {
        width: 25,
        height: 25,
        tintColor: 'black',
    },
});
export default AddMatch;
