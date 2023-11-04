import styles from '../Styles/findplayersStyles';
import React, {useState, useEffect, useCallback} from 'react';
import {FlatList} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ButtonGroup, Divider, SearchBar} from '@rneui/themed';
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
import {Button, Card, Title} from 'react-native-paper';
import locationIcon from '../Assets/Icons/location.png';
import levelIcon from '../Assets/Icons/level.png';
import sportsIcon from '../Assets/Icons/sports.png';
import getAge from '../Functions/getAge';
import getSportsByIds from '../Functions/getSportsByIds';
import sportsList from '../Assets/sportsList.json';
import {useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const FindPlayers = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [ageFilter, setAgeFilter] = useState(null);
    const [sportsFilter, setSportsFilter] = useState(null);
    const [levelFilter, setLevelFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [playersData, setPlayersData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserDataFromFirestore = async () => {
        try {
            const myId = auth().currentUser.uid;

            const usersCollection = firestore().collection('users');
            const snapshot = await usersCollection.get();

            const userData = snapshot.docs.map(doc => {
                return {...doc.data(), id: doc.id};
            });

            const newUsersData = userData.filter(user => user.id !== myId);

            setFilteredUsers(newUsersData);
            setPlayersData(userData);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            Alert.alert(
                'Error',
                'An error occurred while fetching players. Please reload app.',
            );
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUserDataFromFirestore();
        }, []),
    );

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

        setFilteredUsers(filtered);
        setModalVisible(false);
    };

    const renderItem = ({item}) => {
        const sportName = getSportsByIds(item.preferredSports);

        return (
            <Card style={styles.card} mode="elevated">
                <Card.Title
                    title={`${item.firstName} ${item.lastName}`}
                    titleStyle={styles.cardName}
                    subtitleStyle={styles.cardUsername}
                    subtitle={`@${item.username}`}
                    style={styles.cardHeader}
                    left={() => (
                        <View>
                            <Image
                                style={styles.dpImage}
                                source={{uri: item.profilePic}}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                    right={() => (
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
                    )}
                />
                <Card.Content>
                    <Divider style={styles.divider} width={1.2} color="grey" />
                    <View style={styles.infoContainer}>
                        <View style={styles.cardInfoView}>
                            <Image
                                source={sportsIcon}
                                style={styles.infoIcons}
                            />
                            <Title style={styles.cardSportsText}>
                                {`${sportName.join(', ')}`}
                            </Title>
                        </View>
                        <View style={styles.cardInfoView}>
                            <Image
                                source={levelIcon}
                                style={styles.infoIcons}
                            />
                            <Text style={styles.userInfo}>
                                {`${item.skillLevel}`}
                            </Text>
                        </View>
                        <View style={styles.cardInfoView}>
                            <Image
                                source={locationIcon}
                                style={styles.infoIcons}
                            />
                            <Text style={styles.userInfo}>
                                {`${item.area}, ${item.city}`}
                            </Text>
                        </View>
                        <Button
                            style={{
                                top: 10,
                                width: 130,
                                alignSelf: 'center',
                            }}
                            mode="outlined"
                            onPress={() => gotoViewProfile(item)}>
                            View Profile
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
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

            {isLoading ? (
                <View style={{alignSelf: 'center'}}>
                    <ActivityIndicator
                        style={{top: 100}}
                        size={50}
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
                        contentContainerStyle={{paddingBottom: 180}}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

export default FindPlayers;
