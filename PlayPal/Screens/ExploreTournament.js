import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {SearchBar, Tab, TabView} from '@rneui/themed';
import {
    Image,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import {Button, Card, Title, Text, Divider} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import getSportsByIds from '../Functions/getSportsByIds';
import sportsList from '../Assets/sportsList.json';
import cityData from '../Assets/cityData.json';
import Toast from 'react-native-toast-message';
import firestore from '@react-native-firebase/firestore';

const ExploreTournament = ({navigation}) => {
    const [tournamentsData, setTournamentsData] = useState([]);
    const [upcomingTours, setUpcomingTours] = useState([]);
    const [ongoingTours, setOngoingTours] = useState([]);
    const [upcomingFiltered, setUpcomingFiltered] = useState([]);
    const [ongoingFiltered, setOngoingFiltered] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [sportsFilter, setSportsFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(cityData);
    const [isLoading, setIsLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);

    const searchCity = query => {
        const filteredItems = items.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase()),
        );
        return filteredItems;
    };

    const gotoViewTournament = (tournamentId, sportName) => {
        navigation.navigate('ViewTournament', {
            tournamentId,
            sportName,
        });
    };

    useEffect(() => {
        const currentDate = new Date();

        const unsubscribe = firestore()
            .collection('tournaments')
            .where('end_date', '>=', currentDate)
            .onSnapshot(
                querySnapshot => {
                    const ongoingData = [];

                    const upcomingData = [];

                    querySnapshot.forEach(doc => {
                        const startDate = doc.data().start_date.toDate();
                        if (startDate <= currentDate) {
                            ongoingData.push({id: doc.id, ...doc.data()});
                        } else {
                            upcomingData.push({id: doc.id, ...doc.data()});
                        }
                    });

                    setUpcomingTours(upcomingData);
                    setOngoingTours(ongoingData);

                    setOngoingFiltered(ongoingData);
                    setUpcomingFiltered(upcomingData);

                    setIsLoading(false);
                },
                error => {
                    setIsLoading(false);
                    Toast.show({
                        type: 'error',
                        text1: 'An error occurred!',
                        text2: error.message,
                    });
                },
            );

        return () => unsubscribe();
    }, []);

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

    const handleTabChange = index => {
        resetFilters();
        setTabIndex(index);
        setSearchQuery('');

        // Reset search query when the tab changes
    };

    const resetFilters = () => {
        setSportsFilter(null);
        setSelectedCity('');
    };

    const handleSearch = text => {
        setSearchQuery(text);

        const searchFilteredData =
            tabIndex === 0 ? ongoingTours : upcomingTours;

        const filtered = searchFilteredData.filter(data => {
            const isNameMatched = data.name
                .toLowerCase()
                .includes(text.toLowerCase());

            const isSportsMatched =
                !sportsFilter || data.sport.includes(sportsFilter);

            const isCityMatched =
                !selectedCity || data.city.includes(selectedCity);

            return isNameMatched && isSportsMatched && isCityMatched;
        });

        if (tabIndex === 0) {
            setOngoingFiltered(filtered);
        } else {
            setUpcomingFiltered(filtered);
        }
    };

    const applyFilters = () => {
        const searchFilteredData =
            tabIndex === 0 ? ongoingTours : upcomingTours;

        const filtered = searchFilteredData.filter(data => {
            const isNameMatched = data.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const isSportsMatched =
                !sportsFilter || data.sport.includes(sportsFilter);

            const isCityMatched =
                !selectedCity || data.city.includes(selectedCity);

            return isNameMatched && isSportsMatched && isCityMatched;
        });

        if (tabIndex === 0) {
            setOngoingFiltered(filtered);
        } else {
            setUpcomingFiltered(filtered);
        }

        setModalVisible(false);
    };

    const renderItem = ({item}) => {
        const startDate = item.start_date.toDate().toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
        const endDate = item.end_date.toDate().toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

        const sportName = getSportsByIds([item.sport]);

        const iconPath = sportIcons[sportName] || sportIcons.default;

        return (
            <TouchableOpacity
                style={styles.cardView}
                onPress={() => gotoViewTournament(item.id, sportName)}>
                <Card style={styles.card}>
                    <Card.Content
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <View style={{flexWrap: 'wrap'}}>
                            <Title style={styles.title}>{item.name}</Title>
                            <Text style={styles.subtitle}>({sportName})</Text>
                            <Divider style={styles.divider} />

                            <View style={{flexDirection: 'row'}}>
                                <Image
                                    style={styles.icon}
                                    source={require('../Assets/Icons/location.png')}
                                />
                                <Text style={styles.cityText}>{item.city}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    paddingVertical: 10,
                                }}>
                                <Text style={styles.dateText}>Start date:</Text>
                                <Text
                                    style={
                                        styles.info1
                                    }>{` ${startDate}`}</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text>End date: </Text>
                                <Text
                                    style={styles.info2}>{` ${endDate}`}</Text>
                            </View>
                        </View>
                        <View style={styles.sportIconView}>
                            <Image
                                style={styles.sportsIcon}
                                source={iconPath}
                            />
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerView}>
                <Title style={styles.topTitle}>Explore Tournaments</Title>
            </View>

            <View style={{marginBottom: 15}}>
                <Tab
                    value={tabIndex}
                    style={{width: '80%', alignSelf: 'center'}}
                    onChange={handleTabChange}
                    titleStyle={{color: '#4a5a96', fontSize: 17}}
                    indicatorStyle={{backgroundColor: '#4a5a96', height: 3}}>
                    <Tab.Item title="Ongoing" />
                    <Tab.Item title="Upcoming" />
                </Tab>
            </View>

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
                        <View style={styles.pickerView2}>
                            <Text style={styles.filterLabel}>
                                Tournament city:
                            </Text>
                            <DropDownPicker
                                style={styles.dropDown}
                                open={open}
                                value={selectedCity}
                                items={items.map(item => ({
                                    label: item.city,
                                    value: item.city,
                                }))}
                                textStyle={{
                                    fontSize: 15,
                                    fontWeight: '400',
                                    color: 'black',
                                }}
                                setOpen={setOpen}
                                setValue={setSelectedCity}
                                searchable={true}
                                searchPlaceholder="Type city name"
                                placeholder="Select city"
                                placeholderStyle={{color: 'grey'}}
                                searchablePlaceholderTextColor="gray"
                                selectedItemLabelStyle={{color: '#11867F'}}
                                searchableError={() => (
                                    <Text>City not found</Text>
                                )}
                                searchContainerStyle={{paddingVertical: 10}}
                                dropDownContainerStyle={{
                                    width: '100%',
                                    maxHeight: 220,
                                }}
                                onChangeSearch={query => searchCity(query)}
                                onClose={() => setOpen(false)}
                            />
                        </View>

                        <View style={styles.pickerView}>
                            <Text style={styles.filterLabel}>
                                Sports preference:
                            </Text>
                            <View style={styles.pickerStyle}>
                                <Picker
                                    style={{width: '100%'}}
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
                                        color="grey"
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

            {isLoading ? (
                <View style={{alignSelf: 'center'}}>
                    <ActivityIndicator
                        style={{top: 100}}
                        size={50}
                        color="#11867F"
                    />
                </View>
            ) : (
                <TabView
                    value={tabIndex}
                    onChange={handleTabChange}
                    animationType="spring">
                    <TabView.Item style={{width: '100%'}}>
                        <View style={styles.listView}>
                            <FlatList
                                data={ongoingFiltered}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                                ListEmptyComponent={() => (
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: '#124163',
                                            textAlign: 'center',
                                        }}>
                                        No tournament found!
                                    </Text>
                                )}
                                contentContainerStyle={{paddingBottom: 180}}
                            />
                        </View>
                    </TabView.Item>

                    <TabView.Item style={{width: '100%'}}>
                        <View style={styles.listView}>
                            <FlatList
                                data={upcomingFiltered}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                                ListEmptyComponent={() => (
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: '#124163',
                                            textAlign: 'center',
                                        }}>
                                        No tournament found!
                                    </Text>
                                )}
                                contentContainerStyle={{paddingBottom: 180}}
                            />
                        </View>
                    </TabView.Item>
                </TabView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEDED',
    },
    headerView: {
        width: '100%',
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        backgroundColor: '#4a5a96',
        alignItems: 'center',
        height: 70,
        justifyContent: 'center',
    },
    topTitle: {
        fontSize: 22,
        fontWeight: '600',
        fontStyle: 'italic',
        color: 'white',
    },
    searchView: {
        width: '85%',
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginTop: 10,
    },
    searchBar: {
        width: '85%',
        height: 50,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1.2,
        borderColor: 'grey',
    },
    filter: {
        width: 25,
        height: 25,
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
        height: 360,
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
        marginTop: 15,
        marginBottom: 10,
        width: '95%',
    },
    pickerView2: {
        zIndex: 2,
        alignSelf: 'center',
        marginBottom: 10,
        width: '95%',
    },
    dropDown: {
        width: '100%',
        height: 50,
        borderColor: 'darkgrey',
        borderWidth: 1,
    },
    pickerBox: {
        fontSize: 16,
        width: '100%',
        backgroundColor: 'white',
    },
    pickerStyle: {
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'darkgrey',
    },
    filterLabel: {
        fontSize: 17,
        marginBottom: 10,
        fontWeight: '700',
        color: 'black',
    },
    filterBtnView: {
        flexDirection: 'row',
        marginTop: 60,
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
        width: '100%',
    },
    card: {
        width: '90%',
        alignSelf: 'center',
        marginVertical: 10,
        borderRadius: 15,
        elevation: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'darkgrey',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 17,
        color: 'grey',
    },
    divider: {
        marginTop: 10,
        width: '101%',
        height: 1.5,
        marginBottom: 10,
        backgroundColor: 'grey',
    },
    divider2: {
        width: '90%',
        height: 1,
        marginTop: 5,
        marginBottom: 10,
        alignSelf: 'center',
        backgroundColor: 'white',
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
        color: 'darkblue',
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
