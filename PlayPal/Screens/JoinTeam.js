import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {ButtonGroup, SearchBar, Divider, Card} from '@rneui/themed';
import styles from '../Styles/joinTeamStyles';
import {
    Image,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    View,
    Text,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import {Button, Title} from 'react-native-paper';
import getSportsByIds from '../Functions/getSportsByIds';
import sportsList from '../Assets/sportsList.json';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

const JoinTeam = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [sportsFilter, setSportsFilter] = useState('');
    const [rankFilter, setRankFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [teamsData, setTeamsData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const gotoViewTeam = (team, sportName) => {
        navigation.navigate('ViewTeam', {team, sportName});
    };

    useEffect(() => {
        const fetchTeams = async () => {
            const teamsCollection = firestore().collection('teams');

            try {
                const querySnapshot = await teamsCollection.get();

                const teams = [];
                querySnapshot.forEach(doc => {
                    const tData = {
                        teamId: doc.id,
                        ...doc.data(),
                    };

                    teams.push(tData);
                });
                setTeamsData(teams);
                setFilteredTeams(teams);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                Toast.show({
                    type: 'error',
                    text1: 'Error loading teams!',
                    text2: error.message,
                });
            }
        };

        fetchTeams();
    }, []);

    const rankLvl = [
        {label: 'Freshies', value: 'Freshies'},
        {label: 'Emerging', value: 'Emerging'},
        {label: 'Champions', value: 'Champions'},
    ];

    const handleRankFilterButton = selectedIndex => {
        setRankFilter(rankLvl[selectedIndex].value);
    };

    const resetFilters = () => {
        setSportsFilter(null);
        setRankFilter(null);
    };

    const handleSearch = text => {
        setSearchQuery(text);

        const searchFilteredTeams = teamsData;

        const filtered = searchFilteredTeams.filter(team => {
            const isNameMatched = team.name
                .toLowerCase()
                .includes(text.toLowerCase());

            const isSportsMatched =
                !sportsFilter || team.sportId.includes(sportsFilter);

            const isRankMatched = !rankFilter || team.rank === rankFilter;

            return isNameMatched && isSportsMatched && isRankMatched;
        });

        setFilteredTeams(filtered);
    };

    const [filteredTeams, setFilteredTeams] = useState();

    const applyFilters = () => {
        const filtered = teamsData.filter(team => {
            const isNameMatched = team.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const isSportsMatched =
                !sportsFilter || team.sportId.includes(sportsFilter);

            const isRankMatched = !rankFilter || team.rank === rankFilter;
            return isNameMatched && isSportsMatched && isRankMatched;
        });

        setFilteredTeams(filtered);
        setModalVisible(false);
    };

    const renderItem = ({item}) => {
        const sportName = getSportsByIds([item.sportId], sportsList);
        const playerCount = item.playersId.length;

        return (
            <TouchableOpacity onPress={() => gotoViewTeam(item, sportName)}>
                <Card containerStyle={styles.card}>
                    <Card.Image
                        style={styles.cardImage}
                        source={{uri: item.teamPic}}
                        resizeMode="stretch"
                    />
                    <View style={styles.content}>
                        <Title style={styles.cardTitle}>{item.name}</Title>
                        <Divider width={1} />
                        <View style={styles.cardSubView}>
                            <View style={styles.cardDetailView}>
                                <Text style={styles.cardLabel}>Sport:</Text>
                                <Text style={styles.cardText}>{sportName}</Text>
                            </View>
                            <View style={styles.cardDetailView}>
                                <Text style={styles.cardLabel}>Players:</Text>
                                <Text style={styles.cardText}>
                                    {`${playerCount}/${item.size}`}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.cardDetailView}>
                            <Text style={styles.rankText}>({item.rank})</Text>
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Title style={styles.topTitle}>Explore Teams</Title>
            <Divider width={1} style={styles.divider} color="grey" />

            <View style={styles.searchView}>
                <SearchBar
                    placeholder="Search team"
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
                                    style={{width: '100%', color: '#11867F'}}
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

                        <View style={styles.ageFilterView}>
                            <Text style={styles.agefilterLabel}>
                                Team's rank:
                            </Text>
                            <View style={{width: 270, alignItems: 'center'}}>
                                <ButtonGroup
                                    buttons={rankLvl.map(item => item.label)}
                                    selectedIndex={rankLvl.findIndex(
                                        item => item.value === rankFilter,
                                    )}
                                    onPress={handleRankFilterButton}
                                    containerStyle={{
                                        height: 40,
                                        width: 270,
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
                        style={{top: 100}}
                        size={50}
                        color="#11867F"
                    />
                </View>
            ) : (
                <View style={styles.listView}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={filteredTeams}
                        renderItem={renderItem}
                        keyExtractor={item => item.teamId}
                        contentContainerStyle={{paddingBottom: 150}}
                        ListEmptyComponent={() => (
                            <Text style={styles.emptyText}>No team found!</Text>
                        )}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

export default JoinTeam;
