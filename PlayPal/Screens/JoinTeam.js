import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {ButtonGroup, SearchBar} from '@rneui/themed';

import {
    Image,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    View,
    Text,
    FlatList,
    StyleSheet,
} from 'react-native';
import {Button, Card, Title, Paragraph, Divider} from 'react-native-paper';

import getAge from '../Functions/getAge';
import getSportsByIds from '../Functions/getSportsByIds';
import sportsList from '../Assets/sportsList.json';
import teamsData from '../Assets/teamsData.json';

const JoinTeam = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [ageFilter, setAgeFilter] = useState(null);
    const [sportsFilter, setSportsFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

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

        const searchFilteredTeams = Object.keys(teamsData).map(
            key => teamsData[key],
        );

        const filtered = searchFilteredTeams.filter(user => {
            const isNameMatched =
                user.firstName.toLowerCase().includes(text.toLowerCase()) ||
                user.lastName.toLowerCase().includes(text.toLowerCase());

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

        setFilteredTeams(filtered);
    };

    const [filteredTeams, setFilteredTeams] = useState(
        Object.keys(teamsData).map(key => teamsData[key]),
    );

    const applyFilters = () => {
        const filtered = Object.keys(teamsData)
            .map(key => teamsData[key])
            .filter(user => {
                const isNameMatched =
                    user.firstName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    user.lastName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase());

                const isSportsMatched =
                    !sportsFilter ||
                    user.preferredSports.includes(sportsFilter);
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

        setFilteredTeams(filtered);
        setModalVisible(false);
    };

    const renderItem = ({item}) => {
        const sportName = getSportsByIds([item.sportId], sportsList);
        return (
            <Card style={styles.card}>
                <Card.Cover
                    style={styles.cardImage}
                    source={{uri: item.teamPic}}
                />
                <Card.Content style={styles.content}>
                    <Title style={styles.title}>{item.name}</Title>
                    <Divider style={{height: 3}} />
                    <View style={styles.cardDetailView}>
                        <Text style={styles.cardLabel}>Sport:</Text>
                        <Text style={styles.cardText}>{sportName}</Text>
                    </View>
                    <View style={styles.cardDetailView}>
                        <Text style={styles.cardLabel}>No. of players:</Text>
                        <Text style={styles.cardText}>{item.size}</Text>
                    </View>
                    <View style={styles.cardDetailView}>
                        <Text style={styles.cardLabel}>Rank:</Text>
                        <Text style={styles.cardText}>{item.rank}</Text>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Title style={styles.topTitle}>Search Teams</Title>

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
                                    onValueChange={itemValue =>
                                        setSportsFilter(itemValue)
                                    } // Use the original value without modification
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
                    numColumns={2}
                    data={filteredTeams}
                    renderItem={renderItem}
                    keyExtractor={filteredTeams.teamId}
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
        width: 270,
        height: 50,
        marginEnd: 30,
        justifyContent: 'center',
        backgroundColor: 'white',
        elevation: 10,
        borderRadius: 10,
        borderWidth: 1,
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
        top: 30,
        alignItems: 'center',
    },
    card: {
        margin: 10,
        borderRadius: 10,
        elevation: 3,
        width: 180,
    },
    cardImage: {
        height: 150,
    },
    cardDetailView: {
        flexDirection: 'row',
        marginTop: 10,
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: 'black',
        marginEnd: 10,
    },
    cardText: {
        fontSize: 16,
        fontWeight: '700',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        marginBottom: 12,
    },
    info: {
        marginBottom: 6,
        color: '#616161',
    },

    dpImage: {
        height: 70,
        width: 70,
        right: 5,
        borderWidth: 2,
        borderColor: '#143B63',
        borderRadius: 15,
    },
    infoContainer: {
        padding: 10,
    },
    cardSportsText: {
        fontSize: 18,
        left: 20,
    },
    userInfo: {
        fontSize: 17,
        marginBottom: 8,
        left: 20,
    },
    infoIcons: {
        width: 28,
        height: 28,
    },
    cardInfoView: {
        flexDirection: 'row',
        marginTop: 10,
    },
    cardAgeView: {
        flexDirection: 'row',
        top: 35,
        right: 10,
    },
    ageText: {
        fontSize: 15,
    },
});

export default JoinTeam;
