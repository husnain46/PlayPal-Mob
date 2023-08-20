import React, {useState} from 'react';
import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {Divider} from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import teamsData from '../Assets/teamsData.json';

const AddMatch = ({navigation, route}) => {
    const {data} = route.params;
    const [matchTitle, setMatchTitle] = useState('');
    const [selectedDate, setSelectedDate] = useState();
    const [showPicker1, setShowPicker1] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);
    const [showPicker2, setShowPicker2] = useState(false);
    const [selectedTeam1, setSelectedTeam1] = useState(null);
    const [selectedTeam2, setSelectedTeam2] = useState(null);

    const tournamentTeams = data.teamIds.map(tId => ({
        label: teamsData[tId].name,
        value: tId,
    }));

    //
    const currentDate = new Date();
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    const maxDate = new Date();
    maxDate.setMonth(currentDate.getMonth() + 12);

    const handleDateChange = (event, selected) => {
        setShowPicker1(false);
        if (selected) {
            setSelectedDate(selected.toLocaleDateString('en-GB'));
        }
    };

    const handleTimeChange = (event, selected) => {
        setShowPicker2(false);
        if (selected) {
            setSelectedTime(
                selected.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.screenTitle}>New Match</Text>

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
                        <Text style={styles.dateText}>{selectedDate}</Text>
                    ) : (
                        <Text style={styles.datePlaceholder}>Select date</Text>
                    )}
                </Button>
                {showPicker1 && (
                    <DateTimePicker
                        value={nextDay}
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
                    {selectedTime !== null ? (
                        <Text style={styles.dateText}>{selectedTime}</Text>
                    ) : (
                        <Text style={styles.datePlaceholder}>Select time</Text>
                    )}
                </Button>
                {showPicker2 && (
                    <DateTimePicker
                        value={currentDate}
                        mode="time"
                        display="default"
                        onChange={handleTimeChange}
                    />
                )}
            </View>

            <View style={styles.dropView}>
                <Text style={styles.dropLabel}>Team 1:</Text>
                <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    containerStyle={styles.dropContainer}
                    iconStyle={styles.iconStyle}
                    data={tournamentTeams}
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
                    data={tournamentTeams}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={'Select team 2'}
                    value={selectedTeam2}
                    onChange={item => setSelectedTeam2(item)}
                />
            </View>

            <Button
                style={{marginTop: 50}}
                mode="contained"
                buttonColor="#119677"
                onPress={{}}>
                <Text
                    style={{
                        fontSize: 18,
                        color: 'white',
                        paddingTop: 1,
                    }}>
                    Add match
                </Text>
            </Button>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
export default AddMatch;
