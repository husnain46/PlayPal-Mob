import {Picker} from '@react-native-picker/picker';
import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {RadioButton, TextInput} from 'react-native-paper';
import sportsList from '../Assets/sportsList.json';
import DropDownPicker from 'react-native-dropdown-picker';
import cityData from '../Assets/cityData.json';
import getTeamByCaptainId from '../Functions/getTeamByCaptainId';
import arenasData from '../Assets/arenasData.json';

const OrganizeTournament = () => {
    const [tourName, setTourName] = useState('');
    const [sport, setSport] = useState(null);
    const [selectedCity, setSelectedCity] = useState('');
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(cityData);
    const [tourDetail, setTourDetail] = useState('');
    const [selectedVenue, setSelectedVenue] = useState('');
    const [open2, setOpen2] = useState(false);
    const [venueName, setVenueName] = useState();
    const [venueType, setVenueType] = useState();

    const [arenaList, setArenaList] = useState(
        Object.keys(arenasData).map(arenaId => ({
            label: arenasData[arenaId].name,
            value: arenasData[arenaId].name,
        })),
    );
    const capId = 'user1';

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

    const myTeam = getTeamByCaptainId(capId);

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
                        outlineColor="black"
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
                            selectedValue={sport}
                            onValueChange={setSport}
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
                <View style={styles.venueView}>
                    <Text style={styles.venueLabel}>Venue:</Text>

                    <RadioButton.Group
                        onValueChange={newValue => setVenueType(newValue)}
                        value={venueType}>
                        <View style={styles.radioView}>
                            <Text style={styles.radioLabel1}>
                                PlayPal Arena
                            </Text>
                            <RadioButton value={1} />
                            <Text style={styles.radioLabel2}>Other</Text>
                            <RadioButton value={2} />
                        </View>
                    </RadioButton.Group>
                </View>

                {venueType == 1 ? (
                    <View style={styles.dropView}>
                        <Text style={styles.venueLabel}>Select venue:</Text>
                        <DropDownPicker
                            style={styles.dropDown}
                            labelStyle={{fontSize: 17}}
                            open={open2}
                            value={selectedVenue}
                            items={arenaList}
                            textStyle={{fontSize: 17}}
                            setOpen={setOpen2}
                            setValue={setSelectedVenue}
                            listMode="MODAL"
                            searchable={true}
                            searchPlaceholder="Type venue name"
                            placeholder="Select venue"
                            placeholderStyle={{color: '#11867F'}}
                            searchableError={() => <Text>Venue not found</Text>}
                            dropDownContainerStyle={{width: 250}}
                            onChangeSearch={query => searchVenue(query)}
                            onClose={() => setOpen(false)}
                        />
                    </View>
                ) : (
                    <></>
                )}
                {venueType == 2 ? (
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
                            value={venueName}
                            onChangeText={text => setVenueName(text)}
                            style={styles.input2}
                            outlineStyle={styles.outline}
                        />
                    </View>
                ) : (
                    <></>
                )}
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
        marginBottom: 20,
    },

    inputView2: {
        marginVertical: 5,
    },

    textInput1: {
        width: 300,
        height: 60,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        borderRadius: 10,
        backgroundColor: '#4377AA',
    },
    textInput2: {
        width: 300,
        height: 60,
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
