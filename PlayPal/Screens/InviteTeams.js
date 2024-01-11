import React, {useEffect, useState} from 'react';
import {ButtonGroup, SearchBar, Divider, Card} from '@rneui/themed';
import styles from '../Styles/inviteTeamsStyles';
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
import {Dropdown} from 'react-native-element-dropdown';
import cityData from '../Assets/cityData.json';

const InviteTeams = ({navigation, route}) => {
    const {tourData, organizer} = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [sportsFilter, setSportsFilter] = useState('');
    const [rankFilter, setRankFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [teamsData, setTeamsData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [inviteStatus, setInviteStatus] = useState({});
    const [cityFilter, setCityFilter] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const currentDate = new Date();

    const cityList = cityData.map(item => ({
        label: item.city,
        value: item.city,
    }));

    const gotoViewTeam = (team, sportName) => {
        navigation.navigate('ViewTeam', {team, sportName});
    };

    const handleTeamInvite = async (teamId, captainId) => {
        try {
            const isInvited = inviteStatus[teamId];
            if (isInvited) {
                await firestore()
                    .collection('teams')
                    .doc(teamId)
                    .update({
                        invites: firestore.FieldValue.arrayRemove(tourData.id),
                    });

                const notifyRef = await firestore()
                    .collection('notifications')
                    .where('senderId', '==', organizer.teamId)
                    .where('receiverId', '==', captainId)
                    .where('type', '==', 'tour_invite')
                    .get();

                await notifyRef.docs[0].ref.delete();

                Toast.show({
                    type: 'info',
                    text1: 'Invitation cancelled!',
                });

                setInviteStatus({
                    ...inviteStatus,
                    [teamId]: false,
                });
            } else {
                await firestore()
                    .collection('teams')
                    .doc(teamId)
                    .update({
                        invites: firestore.FieldValue.arrayUnion(tourData.id),
                    });

                const notification = {
                    senderId: organizer.teamId,
                    receiverId: captainId,
                    message: `${organizer.name} has invited your team to play ${tourData.name}`,
                    type: 'tour_invite',
                    tourId: tourData.id,
                    read: false,
                    timestamp: currentDate,
                };
                await firestore().collection('notifications').add(notification);
                Toast.show({
                    type: 'success',
                    text1: `Invitation sent!`,
                });

                setInviteStatus({
                    ...inviteStatus,
                    [teamId]: true,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text2: 'An error occurred!',
            });
        }
    };

    useEffect(() => {
        const fetchTeams = async () => {
            const teamsCollection = firestore()
                .collection('teams')
                .where('sportId', '==', tourData.sport);

            try {
                const querySnapshot = await teamsCollection.get();

                const teams = [];
                const updatedInviteStatus = {};

                querySnapshot.forEach(doc => {
                    if (!tourData.teamIds.includes(doc.id)) {
                        const tData = {
                            teamId: doc.id,
                            ...doc.data(),
                        };
                        const invited = tData.invites.includes(tourData.id);

                        teams.push(tData);

                        updatedInviteStatus[tData.teamId] = invited;
                    }
                });

                setTeamsData(teams);

                setInviteStatus(prevStatus => ({
                    ...prevStatus,
                    ...updatedInviteStatus,
                }));

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
        setCityFilter(null);
        setRankFilter(null);
    };

    const handleSearch = text => {
        setSearchQuery(text);

        const searchFilteredTeams = teamsData;

        const filtered = searchFilteredTeams.filter(team => {
            const isNameMatched = team.name
                .toLowerCase()
                .includes(text.toLowerCase());

            const isCityMatched = !cityFilter || team.city === cityFilter;

            const isRankMatched = !rankFilter || team.rank === rankFilter;

            return isNameMatched && isCityMatched && isRankMatched;
        });

        setFilteredTeams(filtered);
    };

    const [filteredTeams, setFilteredTeams] = useState();

    const applyFilters = () => {
        const filtered = teamsData.filter(team => {
            const isNameMatched = team.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const isCityMatched = !cityFilter || team.city === cityFilter;

            const isRankMatched = !rankFilter || team.rank === rankFilter;
            return isNameMatched && isCityMatched && isRankMatched;
        });

        setFilteredTeams(filtered);
        setModalVisible(false);
    };

    const renderItem = ({item}) => {
        const sportName = getSportsByIds([item.sportId], sportsList);
        const playerCount = item.playersId.length;
        const isInvited = inviteStatus[item.teamId];

        return (
            <Card containerStyle={styles.card}>
                <TouchableOpacity onPress={() => gotoViewTeam(item, sportName)}>
                    <Card.Image
                        style={styles.cardImage}
                        source={{uri: item.teamPic}}
                        resizeMode="stretch"
                    />
                    <View style={styles.content}>
                        <Title style={styles.cardTitle}>{item.name}</Title>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignSelf: 'center',
                                marginBottom: 5,
                            }}>
                            <Image
                                style={styles.locIcon}
                                source={require('../Assets/Icons/location.png')}
                            />
                            <Text style={styles.cityText}>{item.city}</Text>
                        </View>
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
                    </View>
                </TouchableOpacity>
                <View style={styles.cardDetailView2}>
                    <Text style={styles.rankText}>({item.rank})</Text>

                    <TouchableOpacity
                        style={[
                            !isInvited ? styles.inviteBtn : styles.invitedBtn,
                        ]}
                        onPress={() =>
                            handleTeamInvite(item.teamId, item.captainId)
                        }>
                        <Text
                            style={[
                                !isInvited
                                    ? styles.inviteText
                                    : styles.invitedText,
                            ]}>
                            {!isInvited ? 'Invite' : 'Invited'}
                        </Text>

                        {!isInvited ? (
                            <Image
                                source={require('../Assets/Icons/send.png')}
                                resizeMode="contain"
                                style={styles.inviteIcon}
                            />
                        ) : (
                            <Image
                                source={require('../Assets/Icons/tick.png')}
                                resizeMode="contain"
                                style={styles.invitedIcon}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerView}>
                <Title style={styles.topTitle}>Invite Teams</Title>
            </View>

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
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 20,
                                fontWeight: '600',
                                color: 'darkblue',
                            }}>
                            Filters
                        </Text>
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

export default InviteTeams;
