import styles from '../Styles/findplayersStyles';
import React, {useState, useEffect, useCallback} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ButtonGroup, SearchBar, Card} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';

import {
    Image,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    View,
    Text,
    ActivityIndicator,
} from 'react-native';
import {Button} from 'react-native-paper';
import locationIcon from '../Assets/Icons/location.png';
import levelIcon from '../Assets/Icons/level.png';
import sportsIcon from '../Assets/Icons/sports.png';
import getAge from '../Functions/getAge';
import getSportsByIds from '../Functions/getSportsByIds';
import sportsList from '../Assets/sportsList.json';
import {useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import {Dropdown} from 'react-native-element-dropdown';
import cityData from '../Assets/cityData.json';

const FindPlayers = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [ageFilter, setAgeFilter] = useState(null);
    const [sportsFilter, setSportsFilter] = useState(null);
    const [levelFilter, setLevelFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [playersData, setPlayersData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cityFilter, setCityFilter] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const [myCity, setMyCity] = useState('');
    const [refreshPlayers, setRefreshPlayers] = useState(false);

    const cityList = cityData.map(item => ({
        label: item.city,
        value: item.city,
    }));

    const fetchUserDataFromFirestore = async () => {
        try {
            const myId = auth().currentUser.uid;

            const usersCollection = firestore()
                .collection('users')
                .where('city', '!=', '');

            const snapshot = await usersCollection.get();
            if (!snapshot.empty) {
                let cityName;
                const userData = snapshot.docs.map(doc => {
                    if (doc.id == myId) {
                        cityName = doc.data().city;
                        setMyCity(cityName);
                    }
                    return {...doc.data(), id: doc.id};
                });

                const newUsersData = userData.filter(user => user.id !== myId);

                const filterData = newUsersData.filter(
                    user => user.city === cityName,
                );
                setFilteredUsers(filterData);
                setPlayersData(newUsersData);
                setCityFilter(cityName);

                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);

            Toast.show({
                type: 'error',
                text1: 'Error loading players data!',
                text2: error.message,
            });
        }
    };

    const fetchNewDataFromFirestore = async () => {
        try {
            const myId = auth().currentUser.uid;

            const usersCollection = firestore()
                .collection('users')
                .where('city', '!=', '');

            const snapshot = await usersCollection.get();
            if (!snapshot.empty) {
                let cityName;
                const userData = snapshot.docs.map(doc => {
                    if (doc.id == myId) {
                        cityName = doc.data().city;
                        setMyCity(cityName);
                    }
                    return {...doc.data(), id: doc.id};
                });

                const newUsersData = userData.filter(user => user.id !== myId);

                const filterData = newUsersData.filter(
                    user => user.city === cityFilter,
                );
                setFilteredUsers(filterData);
                setPlayersData(newUsersData);
                applyFilters();

                setIsLoading(false);
                setRefreshPlayers(false);
            }
        } catch (error) {
            setIsLoading(false);

            Toast.show({
                type: 'error',
                text1: 'Error loading players data!',
                text2: error.message,
            });
        }
    };

    useEffect(() => {
        fetchUserDataFromFirestore();
    }, []);

    const toggleRefresh = () => {
        setRefreshPlayers(prevState => !prevState);

        fetchNewDataFromFirestore();
    };

    const gotoViewProfile = user => {
        navigation.navigate('ViewProfile', {user});
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
        setCityFilter(myCity);
        setSportsFilter(null);
        setAgeFilter(null);
        setLevelFilter(null);
    };

    const handleSearch = text => {
        setSearchQuery(text);

        const searchFilteredUsers = playersData;
        const searchWords = text.trim().toLowerCase().split(/\s+/);

        const filtered = searchFilteredUsers.filter(user => {
            const isNameMatched = searchWords.every(
                word =>
                    user.firstName.toLowerCase().includes(word) ||
                    user.lastName.toLowerCase().includes(word) ||
                    user.username.toLowerCase().includes(word),
            );

            const isCityMatched = !cityFilter || user.city.includes(cityFilter);

            const isSportsMatched =
                !sportsFilter || user.preferredSports.includes(sportsFilter);

            const isAgeMatched =
                !ageFilter ||
                (getAge(user.DOB) <= ageFilter &&
                    getAge(user.DOB) > ageFilter - 10);

            const isLevelMatched =
                !levelFilter || user.skillLevel === levelFilter;

            return (
                isCityMatched &&
                isNameMatched &&
                isSportsMatched &&
                isAgeMatched &&
                isLevelMatched
            );
        });

        setFilteredUsers(filtered);
    };

    const [filteredUsers, setFilteredUsers] = useState();

    const applyFilters = () => {
        const filtered = playersData.filter(user => {
            const isNameMatched =
                user.firstName
                    .toLowerCase()
                    .includes(searchQuery.trim().toLowerCase()) ||
                user.lastName
                    .toLowerCase()
                    .includes(searchQuery.trim().toLowerCase());

            const isCityMatched = !cityFilter || user.city.includes(cityFilter);

            const isSportsMatched =
                !sportsFilter || user.preferredSports.includes(sportsFilter);

            const isAgeMatched =
                !ageFilter ||
                (getAge(user.DOB) <= ageFilter &&
                    getAge(user.DOB) > ageFilter - 10);

            const isLevelMatched =
                !levelFilter || user.skillLevel === levelFilter;

            return (
                isCityMatched &&
                isNameMatched &&
                isSportsMatched &&
                isAgeMatched &&
                isLevelMatched
            );
        });

        setFilteredUsers(filtered);
        setModalVisible(false);
    };

    const renderItem = ({item}) => {
        const sportName = getSportsByIds(item.preferredSports);

        return (
            <Card containerStyle={styles.card}>
                <View style={styles.cardHeader}>
                    <Image
                        style={styles.dpImage}
                        source={{uri: item.profilePic}}
                        resizeMode="contain"
                    />
                    <View style={{flex: 1}}>
                        <Text style={styles.cardName}>
                            {`${item.firstName} ${item.lastName}`}
                        </Text>
                        <Text style={styles.cardUsername}>
                            {`@${item.username}`}
                        </Text>
                        <View style={styles.cardAgeView}>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color:
                                        item.gender === 'Male'
                                            ? 'blue'
                                            : '#CA0079',
                                }}>
                                {`(${item.gender}`}
                            </Text>

                            <Text style={styles.ageText}>{` - ${getAge(
                                item.DOB,
                            )} years)`}</Text>
                        </View>
                    </View>
                </View>

                <Card.Divider style={styles.divider} width={1.2} color="grey" />

                <View style={styles.cardInfoView}>
                    <Image source={sportsIcon} style={styles.infoIcons} />
                    <Text style={styles.cardSportsText}>
                        {`${sportName.join(', ')}`}
                    </Text>
                </View>
                <View style={styles.cardInfoView}>
                    <Image source={levelIcon} style={styles.infoIcons} />
                    <Text style={styles.userInfo}>{`${item.skillLevel}`}</Text>
                </View>
                <View style={styles.cardInfoView}>
                    <Image source={locationIcon} style={styles.infoIcons} />
                    <Text style={styles.userInfo}>
                        {`${item.area}, ${item.city}`}
                    </Text>
                </View>

                <Button
                    style={{
                        marginTop: 5,
                        width: '40%',
                        alignSelf: 'center',
                        height: 35,
                        borderRadius: 12,
                        justifyContent: 'center',
                    }}
                    labelStyle={{height: 20, width: '80%'}}
                    mode="outlined"
                    onPress={() => gotoViewProfile(item)}>
                    View Profile
                </Button>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchView}>
                <SearchBar
                    placeholder="Search name/username"
                    inputStyle={{fontSize: 16, marginTop: 0, marginLeft: 0}}
                    onChangeText={handleSearch}
                    value={searchQuery}
                    containerStyle={styles.searchBar}
                    platform="android"
                    cancelButtonTitle="Cancel"
                    onCancel={() => handleSearch('')}
                    cancelButtonProps={{color: 'grey'}}
                />

                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{width: '10%'}}>
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
                        <View style={styles.dropView}>
                            <Text style={styles.dropLabel}>City:</Text>
                            <Dropdown
                                style={styles.dropdown}
                                selectedTextStyle={styles.selectedTextStyle}
                                containerStyle={styles.dropContainer}
                                itemTextStyle={styles.dropItemText}
                                itemContainerStyle={styles.dropItem}
                                iconStyle={styles.iconStyle}
                                inputSearchStyle={styles.dropSearch}
                                placeholderStyle={{color: 'darkgrey'}}
                                data={cityList}
                                maxHeight={200}
                                labelField="label"
                                search={true}
                                valueField="value"
                                placeholder={!isFocus ? 'Select city' : '...'}
                                searchPlaceholder={'Search...'}
                                searchField=""
                                value={cityFilter}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    setCityFilter(item.value);
                                    setIsFocus(false);
                                }}
                            />
                        </View>

                        <View style={styles.pickerView}>
                            <Text style={styles.filterLabel}>
                                Sports preference:
                            </Text>
                            <View style={styles.pickerStyle}>
                                <Picker
                                    selectedValue={sportsFilter}
                                    onValueChange={setSportsFilter}
                                    selectionColor={'#11867F'}
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
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() =>
                                        setModalVisible(!modalVisible)
                                    }>
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
                </View>
            </Modal>

            {isLoading ? (
                <View style={{alignSelf: 'center'}}>
                    <ActivityIndicator
                        style={{top: 50}}
                        size={35}
                        color="#11867F"
                    />
                </View>
            ) : (
                <View style={styles.listView}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={filteredUsers}
                        renderItem={renderItem}
                        keyExtractor={item => item.username}
                        contentContainerStyle={{paddingBottom: 200}}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshPlayers}
                                onRefresh={toggleRefresh}
                            />
                        }
                        onScroll={event => {
                            const offsetY = event.nativeEvent.contentOffset.y;
                            if (
                                offsetY === 0 &&
                                event.nativeEvent.velocity.y > 0
                            ) {
                                setRefreshPlayers(false);
                            }
                        }}
                        ListEmptyComponent={() => (
                            <Text style={styles.emptyListText}>
                                No player found in{' '}
                                {cityFilter ? cityFilter : ''}
                                {sportsFilter
                                    ? ' for the selected filters'
                                    : ''}
                                !
                            </Text>
                        )}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

export default FindPlayers;
