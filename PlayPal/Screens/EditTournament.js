import React, {useState} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    FlatList,
    Alert,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import cityData from '../Assets/cityData.json';
import getTeamData from '../Functions/getTeamData';
import {Icon} from '@rneui/themed';

const EditTournament = ({navigation, route}) => {
    const {data} = route.params;

    const [tourName, setTourName] = useState(data.name);
    const [selectedCity, setSelectedCity] = useState(data.city);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(cityData);
    const [tourDetail, setTourDetail] = useState(data.detail);
    const [listRefresh, setListRefresh] = useState(false);

    const searchCity = query => {
        const filteredItems = items.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase()),
        );
        return filteredItems;
    };

    const handleRemoveTeam = (tId, tName) => {
        Alert.alert(
            'Remove Team',
            `Are you sure you want to remove ${tName} from the tournament?`,
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => confirmDelete(tId),
                },
            ],
        );
    };

    const confirmDelete = tId => {
        const index = data.teamIds.indexOf(tId);
        if (index !== -1) {
            data.teamIds.splice(index, 1);
        }
        setListRefresh(prevState => !prevState);
    };

    const renderItem = ({item, index}) => {
        const team = getTeamData(item);
        const num = index + 1;
        return (
            <View style={styles.teamCard}>
                <Text style={styles.teamName}>{`${num})  ${team.name}`}</Text>
                {item === data.organizer ? (
                    <></>
                ) : (
                    <Icon
                        name="cancel"
                        color={'#B95252'}
                        size={28}
                        style={styles.removeIcon}
                        type="Icons"
                        onPress={() => handleRemoveTeam(item, team.name)}
                    />
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                style={{width: '100%'}}>
                <Text style={styles.titleScreen}>Edit Tournament</Text>

                <View style={styles.inputView2}>
                    <Text style={styles.labelText}>Tournament title:</Text>

                    <TextInput
                        style={styles.textInput2}
                        outlineStyle={styles.inputOutline}
                        contentStyle={styles.inputText2}
                        mode="outlined"
                        value={tourName}
                        onChangeText={text => setTourName(text)}
                        outlineColor="black"
                    />
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
                <View style={{marginTop: 20}}>
                    <Text style={styles.labelText}>Tournament details:</Text>
                    <TextInput
                        multiline={true}
                        mode="outlined"
                        numberOfLines={4}
                        value={tourDetail}
                        onChangeText={text => setTourDetail(text)}
                        style={styles.detailInput}
                        outlineStyle={styles.inputOutline}
                        outlineColor="black"
                    />
                </View>
                <View style={{marginTop: 20, width: 300}}>
                    <Text style={styles.teamLabel}>Teams:</Text>
                </View>
                <FlatList
                    data={data.teamIds}
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
        height: 65,
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
    updateBtn: {
        marginTop: 30,
    },
    updateTxt: {
        fontSize: 17,
        color: 'white',
        fontWeight: '600',
    },
});

export default EditTournament;
