import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {ButtonGroup, SearchBar} from '@rneui/themed';

import {
    Image,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    View,
    StyleSheet,
    FlatList,
} from 'react-native';
import {Button, Card, Title, Text, Divider} from 'react-native-paper';
import getAge from '../Functions/getAge';
import userData from '../Assets/userData.json';
import getSportsByIds from '../Functions/getSportsByIds';
import sportsList from '../Assets/sportsList.json';
import tournamentData from '../Assets/tournamentData.json';

const ExploreTournament = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [ageFilter, setAgeFilter] = useState(null);
    const [sportsFilter, setSportsFilter] = useState(null);
    const [levelFilter, setLevelFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const gotoViewProfile = user => {
        navigation.navigate('ViewProfile', {user});
    };

    const getTournamentDates = tournament => {
        const matches = tournament.matches;
        if (matches.length === 0) {
            return {startDate: null, lastDate: null};
        }

        const sortedMatches = matches.sort((a, b) => {
            return a.date.localeCompare(b.date);
        });

        const startDate = sortedMatches[0].date;
        const lastDate = sortedMatches[sortedMatches.length - 1].date;

        return {
            startDate: startDate,
            endDate: lastDate,
        };
    };

    const sportIcons = {
        Cricket: require('../Assets/Icons/cricket.png'),
        Football: require('../Assets/Icons/football.png'),
        Hockey: require('../Assets/Icons/hockey.png'),
        Basketball: require('../Assets/Icons/basketball.png'),
        Volleyball: require('../Assets/Icons/volleyball.png'),
        Badminton: require('../Assets/Icons/badminton.png'),
        Tennis: require('../Assets/Icons/tennis.png'),
        'Table Tennis': require('../Assets/Icons/tableTennis.png'),
        default: require('../Assets/Icons/no image.png'),
    };

    const ageRange = [
        {value: 20, label: 'Under 20'},
        {value: 30, label: 'Under 30'},
        {value: 40, label: 'Under 40'},
    ];

    const handleAgeFilterButton = selectedIndex => {
        setAgeFilter(ageRange[selectedIndex].value);
    };

    const skLvl = [
        {label: 'Beginner', value: 'Beginner'},
        {label: 'Amateur', value: 'Amateur'},
        {label: 'Pro', value: 'Pro'},
    ];

    const handleSkillFilterButton = selectedIndex => {
        setLevelFilter(skLvl[selectedIndex].value);
    };

    const resetFilters = () => {
        setSportsFilter(null);
        setAgeFilter(null);
        setLevelFilter(null);
    };

    const handleSearch = text => {
        setSearchQuery(text);

        const searchFilteredData = Object.keys(userData).map(
            key => userData[key],
        );

        const searchWords = text.trim().toLowerCase().split(/\s+/);

        const filtered = searchFilteredData.filter(user => {
            const isNameMatched = searchWords.every(
                word =>
                    user.firstName.toLowerCase().includes(word) ||
                    user.lastName.toLowerCase().includes(word),
            );

            const isSportsMatched =
                !sportsFilter || user.preferredSports.includes(sportsFilter);
            const isAgeMatched =
                !ageFilter ||
                (getAge(user.DOB) <= ageFilter &&
                    getAge(user.DOB) > ageFilter - 10);

            const isLevelMatched =
                !levelFilter || user.skillLevel === levelFilter;

            return (
                isNameMatched &&
                isSportsMatched &&
                isAgeMatched &&
                isLevelMatched
            );
        });

        setFilteredData(filtered);
    };

    const [filteredData, setFilteredData] = useState(
        Object.keys(tournamentData).map(key => tournamentData[key]),
    );

    const applyFilters = () => {
        const searchFilteredData = Object.keys(userData).map(
            key => userData[key],
        );

        const filtered = searchFilteredData.filter(user => {
            const isNameMatched =
                user.firstName
                    .toLowerCase()
                    .includes(searchQuery.trim().toLowerCase()) ||
                user.lastName
                    .toLowerCase()
                    .includes(searchQuery.trim().toLowerCase());

            const isSportsMatched =
                !sportsFilter || user.preferredSports.includes(sportsFilter);
            const isAgeMatched =
                !ageFilter ||
                (getAge(user.DOB) <= ageFilter &&
                    getAge(user.DOB) > ageFilter - 10);
            const isLevelMatched =
                !levelFilter || user.skillLevel === levelFilter;

            return (
                isNameMatched &&
                isSportsMatched &&
                isAgeMatched &&
                isLevelMatched
            );
        });

        setFilteredData(filtered);
        setModalVisible(false);
    };

    const renderItem = ({item}) => {
        const {startDate, endDate} = getTournamentDates(item);
        const sportName = getSportsByIds([item.sport]);

        const iconPath = sportIcons[sportName] || sportIcons.default;

        return (
            <Card style={styles.card}>
                <Card.Content
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <View style={{flexWrap: 'wrap'}}>
                        <Title style={styles.title}>{item.name}</Title>
                        <Text style={styles.subtitle}> {sportName} </Text>
                        <Divider style={styles.divider} />

                        <View style={{flexDirection: 'row'}}>
                            <Image
                                style={styles.icon}
                                source={require('../Assets/Icons/location.png')}
                            />
                            <Text style={styles.cityText}>{item.city}</Text>
                        </View>
                        <View
                            style={{flexDirection: 'row', paddingVertical: 10}}>
                            <Text style={styles.dateText}>Start date: </Text>
                            <Text style={styles.info1}>{startDate} </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text>End date: </Text>
                            <Text style={styles.info2}>{endDate} </Text>
                        </View>
                    </View>
                    <View style={styles.sportIconView}>
                        <Image style={styles.sportsIcon} source={iconPath} />
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Title style={styles.topTitle}>Explore Tournaments</Title>
            <View style={styles.searchView}>
                <SearchBar
                    placeholder="Search name"
                    onChangeText={handleSearch}
                    value={searchQuery}
                    containerStyle={styles.searchBar}
                    platform="android"
                    cancelButtonTitle="Cancel"
                    onCancel={() => handleSearch('')}
                    cancelButtonProps={{color: 'grey'}}
                />

                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image
                        style={styles.filter}
                        source={require('../Assets/Icons/filter.png')}
                    />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.pickerView}>
                            <Text style={styles.filterLabel}>
                                Sports preference:
                            </Text>
                            <View style={styles.pickerStyle}>
                                <Picker
                                    style={{width: 180}}
                                    selectedValue={sportsFilter}
                                    onValueChange={setSportsFilter}
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
                                    {Object.keys(sportsList).map(
                                        (sportId, index) => (
                                            <Picker.Item
                                                key={index}
                                                style={styles.pickerBox}
                                                label={sportsList[sportId].name}
                                                value={sportId}
                                                color="black"
                                            />
                                        ),
                                    )}
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.ageFilterView}>
                            <Text style={styles.agefilterLabel}>
                                Age preference:
                            </Text>
                            <View style={{width: 240}}>
                                <ButtonGroup
                                    buttons={ageRange.map(item => item.label)}
                                    selectedIndex={ageRange.findIndex(
                                        item => item.value === ageFilter,
                                    )}
                                    onPress={handleAgeFilterButton}
                                    containerStyle={{
                                        height: 40,
                                    }}
                                    selectedTextStyle={{color: 'white'}}
                                />
                            </View>
                        </View>

                        <View style={styles.ageFilterView}>
                            <Text style={styles.agefilterLabel}>
                                Skills preference:
                            </Text>
                            <View style={{width: 240}}>
                                <ButtonGroup
                                    buttons={skLvl.map(item => item.label)}
                                    selectedIndex={skLvl.findIndex(
                                        item => item.value === levelFilter,
                                    )}
                                    onPress={handleSkillFilterButton}
                                    containerStyle={{
                                        height: 40,
                                    }}
                                    selectedTextStyle={{color: 'white'}}
                                />
                            </View>
                        </View>

                        <View style={styles.filterBtnView}>
                            <Button
                                style={styles.resetBtn}
                                onPress={() => resetFilters()}>
                                Reset
                            </Button>

                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => applyFilters()}>
                                <Text style={styles.textStyle}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.listView}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={filteredData.tournamentId}
                    contentContainerStyle={{paddingBottom: 180}}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEDED',
    },
    topTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A5B96',
        textAlign: 'center',
        marginVertical: 20,
    },
    searchView: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 10,
    },
    searchBar: {
        width: 290,
        height: 50,
        marginEnd: 30,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'darkgrey',
    },
    filter: {
        width: 25,
        height: 25,
        top: 2,
    },
    ageFilterView: {
        alignSelf: 'center',
        marginTop: 20,
    },
    agefilterLabel: {
        fontSize: 16,
        marginBottom: 5,
        marginLeft: 10,
        fontWeight: '600',
        color: 'black',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalView: {
        width: 300,
        height: 400,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        elevation: 35,
        borderWidth: 3,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginEnd: 10,
    },
    buttonOpen: {
        backgroundColor: '#11867F',
    },
    buttonClose: {
        backgroundColor: 'red',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    pickerView: {
        alignSelf: 'center',
    },
    pickerBox: {
        fontSize: 16,
    },
    pickerStyle: {
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'lightgrey',
    },
    filterLabel: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: '600',
        color: 'black',
    },
    filterBtnView: {
        flexDirection: 'row',
        marginTop: 35,
        left: 10,
    },
    resetBtn: {
        marginEnd: 65,
        borderWidth: 1,
        borderColor: 'grey',
    },
    safeContainerStyle: {
        flex: 1,
        margin: 20,
        justifyContent: 'center',
    },
    listView: {
        marginTop: 30,
    },
    card: {
        marginVertical: 10,
        width: '85%',
        borderRadius: 15,
        elevation: 10,
        backgroundColor: 'white',
        alignSelf: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 2,
    },
    subtitle: {
        fontSize: 17,
    },
    divider: {
        marginTop: 10,
        width: '101%',
        height: 3,
        marginBottom: 10,
    },
    dateText: {
        fontSize: 14,
    },
    info1: {
        fontSize: 14,
        color: 'green',
    },
    info2: {
        fontSize: 14,
        color: '#fc3003',
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 15,
    },
    cityText: {
        fontSize: 16,
    },
    sportIconView: {
        justifyContent: 'center',
        marginEnd: 10,
    },
    sportsIcon: {
        width: 60,
        height: 60,
    },
});

export default ExploreTournament;
