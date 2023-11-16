import {Picker} from '@react-native-picker/picker';
import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {RadioButton, TextInput, Button} from 'react-native-paper';
import sportsList from '../Assets/sportsList.json';
import DropDownPicker from 'react-native-dropdown-picker';
import cityData from '../Assets/cityData.json';
import arenasData from '../Assets/arenasData.json';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';

const OrganizeTournament = ({navigation, route}) => {
    const {myTeam} = route.params;
    const [tourName, setTourName] = useState('');
    const [sportId, setSportId] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(cityData);
    const [tourDetail, setTourDetail] = useState('');
    const [venueName, setVenueName] = useState('');
    const [venueAddress, setVenueAddress] = useState('');
    const [tourSize, setTourSize] = useState(3);
    const myId = auth().currentUser.uid;
    const [loading, setLoading] = useState(false);
    const [showPicker1, setShowPicker1] = useState(false);
    const [showPicker2, setShowPicker2] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);

    const endMinDate = new Date();
    endMinDate.setDate(minDate.getDate() + 3);

    const numbers = Array.from({length: 6}, (_, index) => index + 3);

    const handleStartDate = (event, selected) => {
        setShowPicker1(false);
        if (selected) {
            setStartDate(selected);
        }
    };

    const handleEndDate = (event, selected) => {
        setShowPicker2(false);
        if (selected) {
            setEndDate(selected);
        }
    };

    const searchCity = query => {
        const filteredItems = items.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase()),
        );
        return filteredItems;
    };

    const searchVenue = query => {
        const filteredItems = items.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase()),
        );
        return filteredItems;
    };

    const handleCreateTournament = async () => {
        const tName = tourName.trim().toLowerCase();

        try {
            setLoading(true);

            const tourQuery = await firestore().collection('tournaments').get();

            // Check if a team with the same name (case-insensitive) already exists
            const matchName = tourQuery.docs.find(doc => {
                const tData = doc.data();
                const existingName = tData.name.trim().toLowerCase();
                return existingName === tName;
            });

            if (matchName) {
                setLoading(false);

                Toast.show({
                    type: 'error',
                    text1: 'Change title!',
                    text2: 'A tournament with same title already exists!',
                });
            } else if (
                !tourName ||
                !tourDetail ||
                !selectedCity ||
                !sportId ||
                !tourSize ||
                !startDate ||
                !endDate ||
                !venueName ||
                !venueAddress
            ) {
                setLoading(false);

                Toast.show({
                    type: 'error',
                    text2: 'Please fill in all fields',
                });
            } else {
                const tourData = {
                    name: tourName,
                    sport: sportId,
                    size: tourSize,
                    city: selectedCity,
                    detail: tourDetail,
                    teamIds: [myTeam.id],
                    organizer: myTeam.id,
                    requests: [],
                    start_date: startDate,
                    end_date: endDate,
                    matches: [],
                    address: venueAddress,
                    venue: venueName,
                };

                await firestore().collection('tournaments').add(tourData);

                Toast.show({
                    type: 'success',
                    text1: `Tournament ${tourName} created successfully!`,
                });

                setLoading(false);

                navigation.navigate('BottomTab', {screen: 'Tournament'});
            }
        } catch (error) {
            setLoading(false);

            Toast.show({
                type: 'error',
                text1: 'Error creating team!',
                text2: error.message,
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                style={{width: '100%'}}>
                <Text style={styles.titleScreen}>Create Tournament</Text>
                <View style={styles.inputView1}>
                    <Text style={styles.labelText}>Your Team:</Text>

                    <TextInput
                        style={styles.textInput1}
                        contentStyle={styles.inputText1}
                        value={myTeam.name}
                        editable={false}
                        textColor="white"
                        outlineStyle={{borderRadius: 10}}
                    />
                </View>

                <View style={styles.inputView2}>
                    <Text style={styles.labelText}>Tournament title:</Text>

                    <TextInput
                        style={styles.textInput2}
                        outlineStyle={styles.inputOutline}
                        contentStyle={styles.inputText2}
                        mode="outlined"
                        label="Title"
                        value={tourName}
                        onChangeText={text => setTourName(text)}
                        outlineColor="black"
                    />
                </View>

                <View style={styles.pickerView}>
                    <Text style={styles.labelText}>Tournament sport:</Text>
                    <View style={styles.pickerStyle}>
                        <Picker
                            style={{width: 250}}
                            selectedValue={sportId}
                            onValueChange={setSportId}
                            mode="dropdown"
                            dropdownIconColor={'#143B63'}
                            dropdownIconRippleColor={'#11867F'}>
                            <Picker.Item
                                style={styles.pickerBox}
                                label="Select sports"
                                value=""
                                enabled={false}
                                color="#11867F"
                            />
                            {Object.keys(sportsList).map((sportId, index) => (
                                <Picker.Item
                                    key={index}
                                    style={styles.pickerBox}
                                    label={sportsList[sportId].name}
                                    value={sportId}
                                    color="black"
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.pickerView}>
                    <Text style={styles.labelText}>No. of teams:</Text>

                    <View style={styles.pickerStyle}>
                        <Picker
                            style={{width: 250}}
                            selectedValue={tourSize}
                            onValueChange={setTourSize}
                            mode="dropdown"
                            dropdownIconColor={'#143B63'}
                            dropdownIconRippleColor={'#11867F'}>
                            {numbers.map(number => (
                                <Picker.Item
                                    style={styles.pickerBox}
                                    key={number}
                                    label={`${number}`}
                                    value={number}
                                    color="black"
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.dropView}>
                    <Text style={styles.labelText}>Tournament city:</Text>
                    <DropDownPicker
                        style={styles.dropDown}
                        labelStyle={{fontSize: 17}}
                        open={open}
                        value={selectedCity}
                        items={items.map(item => ({
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

                <View style={styles.dateView}>
                    <Text style={styles.dateLabel}>Start date:</Text>
                    <Button
                        mode="contained-tonal"
                        style={styles.dateBox}
                        buttonColor="#cfdfe8"
                        onPress={() => setShowPicker1(true)}>
                        {startDate ? (
                            <Text style={styles.dateText}>
                                {startDate.toLocaleDateString('en-GB')}
                            </Text>
                        ) : (
                            <Text style={styles.datePlaceholder}>
                                Select Date
                            </Text>
                        )}
                    </Button>

                    {showPicker1 && (
                        <DateTimePicker
                            value={minDate}
                            mode="date"
                            display="compact"
                            onpre
                            minimumDate={minDate}
                            maximumDate={maxDate}
                            onChange={handleStartDate}
                        />
                    )}
                </View>

                <View style={styles.dateView}>
                    <Text style={styles.dateLabel}>End date:</Text>
                    <Button
                        mode="contained-tonal"
                        style={styles.dateBox}
                        buttonColor="#cfdfe8"
                        onPress={() => setShowPicker2(true)}>
                        {endDate ? (
                            <Text style={styles.dateText}>
                                {endDate.toLocaleDateString('en-GB')}
                            </Text>
                        ) : (
                            <Text style={styles.datePlaceholder}>
                                Select Date
                            </Text>
                        )}
                    </Button>

                    {showPicker2 && (
                        <DateTimePicker
                            value={endMinDate}
                            mode="date"
                            display="compact"
                            minimumDate={minDate.setDate(minDate.getDate() + 3)}
                            maximumDate={maxDate}
                            onChange={handleEndDate}
                        />
                    )}
                </View>

                <View style={styles.inputView2}>
                    <Text style={styles.inputLabel}>Venue name:</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="Other arena/ground.etc"
                        placeholderTextColor={'grey'}
                        value={venueName}
                        onChangeText={text => setVenueName(text)}
                        style={styles.input2}
                        outlineStyle={styles.outline}
                    />
                    <View style={{marginTop: 15}}></View>
                    <Text style={styles.inputLabel}>Venue address:</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="Address"
                        placeholderTextColor={'grey'}
                        value={venueAddress}
                        onChangeText={text => setVenueAddress(text)}
                        style={styles.input2}
                        outlineStyle={styles.outline}
                    />
                </View>

                <View style={{marginTop: 20}}>
                    <Text style={styles.labelText}>Tournament details:</Text>

                    <TextInput
                        multiline={true}
                        mode="outlined"
                        numberOfLines={4}
                        label="Add details (e.g. Format of play)"
                        labelStyle={{color: 'black', bottom: 10, fontSize: 18}}
                        value={tourDetail}
                        onChangeText={text => setTourDetail(text)}
                        style={styles.detailInput}
                        outlineStyle={styles.inputOutline}
                        outlineColor="black"
                    />
                </View>

                <View style={{marginTop: 30}}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <Button
                            mode="contained"
                            buttonColor="#1cad73"
                            style={{borderRadius: 10}}
                            onPress={() => handleCreateTournament()}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: 'white',
                                    paddingTop: 1,
                                }}>
                                Create
                            </Text>
                        </Button>
                    )}
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
    scrollView: {
        alignItems: 'center',
        paddingBottom: 40,
    },
    titleScreen: {
        fontSize: 26,
        fontWeight: '700',
        color: '#4a5a96',
        marginVertical: 30,
        marginBottom: 50,
    },
    inputView1: {
        width: 300,
    },
    textInput1: {
        width: 300,
        height: 60,
        borderRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#4377AA',
    },
    textInput2: {
        width: 300,
        height: 50,
        backgroundColor: 'white',
    },
    inputOutline: {
        borderRadius: 10,
    },
    inputText1: {
        fontSize: 20,
        fontWeight: '700',
        fontStyle: 'italic',
        letterSpacing: 1.5,
        textAlign: 'center',
    },
    inputText2: {
        fontSize: 17,
    },
    pickerView: {
        marginTop: 20,
        alignSelf: 'flex-start',
        marginLeft: 55,
    },
    pickerBox: {
        fontSize: 17,
    },
    pickerStyle: {
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'white',
    },
    labelText: {
        fontSize: 17,
        marginBottom: 10,
        fontWeight: '500',
        color: 'black',
    },
    dropView: {
        alignSelf: 'flex-start',
        marginLeft: 55,
        marginTop: 20,
    },
    dropDown: {
        width: 250,
        borderColor: 'darkgrey',
        borderWidth: 2,
        height: 50,
        borderRadius: 10,
    },
    detailInput: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        top: -5,
    },
    dateView: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        width: 290,
        marginBottom: 10,
        justifyContent: 'space-between',
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
    venueView: {
        marginTop: 20,
        width: 300,
        left: 2,
    },
    venueLabel: {
        fontSize: 17,
        fontWeight: '500',
        color: 'black',
        marginRight: 40,
        marginBottom: 10,
    },
    radioView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioLabel1: {
        fontSize: 16,
        color: 'black',
    },
    radioLabel2: {
        fontSize: 16,
        color: 'black',
        marginLeft: 20,
    },
    inputView2: {
        marginTop: 20,
        width: 300,
    },
    outline: {
        borderRadius: 8,
    },
    input2: {
        backgroundColor: 'white',
        width: 250,
    },
    inputLabel: {
        fontSize: 17,
        marginBottom: 5,
        fontWeight: '500',
        color: 'black',
    },
});

export default OrganizeTournament;
