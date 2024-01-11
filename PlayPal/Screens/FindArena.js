import styles from '../Styles/findArenaStyles';
import React, {useCallback, useState} from 'react';
import {SearchBar, Card, Divider} from '@rneui/themed';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    Modal,
    ActivityIndicator,
} from 'react-native';

import {Dropdown} from 'react-native-element-dropdown';
import sportsList from '../Assets/sportsList.json';
import {Button, Chip} from 'react-native-paper';
import cityData from '../Assets/cityData.json';
import getSportsByIds from '../Functions/getSportsByIds';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';

const FindArena = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sportFilter, setSportFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const [arenasData, setArenasData] = useState([]);

    // filter data resets on refresh.............................................................

    // ..........................................................................................
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchArenas = async () => {
                try {
                    const arenaRef = await firestore()
                        .collection('arenas')
                        .where('holiday', '==', false)
                        .where('approved', '==', true)
                        .get();

                    if (!arenaRef.empty) {
                        const aData = arenaRef.docs.map(doc => {
                            return {id: doc.id, ...doc.data()};
                        });

                        const filtered = aData.filter(data => {
                            const isNameMatched = data.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase());

                            const isCityMatched =
                                !cityFilter || data.city.includes(cityFilter);

                            const isSportsMatched =
                                !sportFilter ||
                                data.sports.some(sport =>
                                    sport.includes(sportFilter),
                                );

                            return (
                                isNameMatched &&
                                isCityMatched &&
                                isSportsMatched
                            );
                        });

                        setArenasData(aData);
                        setFilteredData(filtered);
                        setIsLoading(false);
                    } else {
                        setIsLoading(false);

                        setArenasData([]);
                    }
                } catch (error) {
                    setIsLoading(false);

                    Toast.show({
                        type: 'error',
                        text2: 'Error loading arenas data!',
                    });
                }
            };

            fetchArenas();

            return () => {};
        }, []),
    );

    const gotoViewArena = (arena, arenaRating, ratingCount, arenaId) => {
        navigation.navigate('ViewArena', {
            arena,
            arenaRating,
            ratingCount,
            arenaId,
        });
    };

    const cityList = cityData.map(item => ({
        label: item.city,
        value: item.city,
    }));

    const sportsData = Object.keys(sportsList).map(sportId => ({
        label: sportsList[sportId].name,
        value: sportId,
    }));

    const getStartingPrice = slots => {
        if (!slots || slots.length === 0) {
            return 0;
        }
        const prices = slots.map(slot => slot.price);
        const minPrice = Math.min(...prices);

        return minPrice;
    };

    const getSportIcon = sport => {
        if (sport === 'Football') {
            return 'soccer';
        } else if (sport === 'Basketball') {
            return 'basketball';
        } else if (sport === 'Cricket') {
            return 'cricket';
        } else if (sport === 'Hockey') {
            return 'hockey-sticks';
        } else if (sport === 'Badminton') {
            return 'badminton';
        } else if (sport === 'Volleyball') {
            return 'volleyball';
        } else if (sport === 'Tennis') {
            return 'tennis';
        } else if (sport === 'Table Tennis') {
            return 'table-tennis';
        } else {
            return 'run';
        }
    };

    const getRatingCount = totalRating => {
        if (totalRating > 100) {
            return `${
                Math.floor(totalRating / 100) * 100 +
                (totalRating % 100 === 0 ? 0 : '+')
            } ratings`;
        } else if (totalRating >= 2 && totalRating <= 100) {
            return `${totalRating} ratings`;
        } else if (totalRating === 1) {
            return '1 rating';
        } else {
            return 'No ratings';
        }
    };

    const getAverageRating = ratings => {
        if (!ratings || ratings.length === 0) {
            return 0;
        }

        const totalRating = ratings.reduce(
            (sum, rating) => sum + rating.ratingValue,
            0,
        );

        const averageRating = totalRating / ratings.length;

        const formattedAverage = averageRating.toFixed(1);

        return parseFloat(formattedAverage);
    };

    const resetFilters = () => {
        setSportFilter('');
        setCityFilter('');
    };

    const handleSearch = text => {
        setSearchQuery(text);

        const filtered = arenasData.filter(data => {
            const isNameMatched = data.name
                .toLowerCase()
                .includes(text.toLowerCase());

            const isCityMatched = !cityFilter || data.city.includes(cityFilter);

            const isSportsMatched =
                !sportFilter ||
                data.sports.some(sport => sport.includes(sportFilter));

            return isNameMatched && isCityMatched && isSportsMatched;
        });

        setFilteredData(filtered);
    };

    const applyFilters = () => {
        const filtered = arenasData.filter(data => {
            const isNameMatched = data.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const isCityMatched = !cityFilter || data.city.includes(cityFilter);

            const isSportsMatched =
                !sportFilter ||
                data.sports.some(sport => sport.includes(sportFilter));

            return isNameMatched && isCityMatched && isSportsMatched;
        });
        setFilteredData(filtered);
        setModalVisible(false);
    };

    const renderItem = ({item}) => {
        let aRating = getAverageRating(item.rating);
        let arenaRating = aRating.toFixed(1);
        let ratingCount = getRatingCount(item.rating.length);
        let sportsList = getSportsByIds(item.sports);
        let startingPrice = getStartingPrice(item.slots);

        return (
            <TouchableOpacity
                onPress={() =>
                    gotoViewArena(item, arenaRating, ratingCount, item.id)
                }>
                <Card containerStyle={styles.cardContainer}>
                    <Card.Image
                        source={{uri: item.arenaPics[0]}}
                        style={styles.cardImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.arenaTitle}>{item.name}</Text>
                    <Text style={styles.locationText}>({item.city})</Text>
                    <Divider width={0.5} color="grey" style={{marginTop: 5}} />
                    <View style={styles.infoView}>
                        <View style={styles.infoSubView}>
                            <Image
                                source={require('../Assets/Icons/star.png')}
                                style={styles.starIcon}
                            />
                            {ratingCount !== 0 ? (
                                <Text style={styles.rating}>{arenaRating}</Text>
                            ) : (
                                <></>
                            )}
                            <Text style={styles.numRating}>
                                ({ratingCount})
                            </Text>
                        </View>
                        <View style={styles.infoSubView}>
                            <Text style={styles.priceLabel}>Starts at:</Text>
                            <Text style={styles.price}>{startingPrice} Rs</Text>
                        </View>
                    </View>

                    <View style={styles.sportsView}>
                        {sportsList.map((sport, index) => {
                            let sportIcon = getSportIcon(sport);
                            return (
                                <Chip
                                    key={index}
                                    icon={sportIcon}
                                    style={styles.sportChip}
                                    textStyle={{fontSize: 12}}>
                                    {sport}
                                </Chip>
                            );
                        })}
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* <Text style={styles.titleScreen}>Sports Arenas</Text> */}

            <View style={styles.searchView}>
                <SearchBar
                    placeholder="Search arena name"
                    onChangeText={handleSearch}
                    value={searchQuery}
                    containerStyle={styles.searchBar}
                    inputStyle={{fontSize: 16, marginTop: 0, marginLeft: 0}}
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

                        <View style={styles.dropView}>
                            <Text style={styles.dropLabel}>
                                Sports preference:
                            </Text>
                            <Dropdown
                                style={styles.dropdown}
                                selectedTextStyle={styles.selectedTextStyle}
                                containerStyle={styles.dropContainer}
                                iconStyle={styles.iconStyle}
                                itemTextStyle={styles.dropItemText}
                                placeholderStyle={{color: 'darkgrey'}}
                                data={sportsData}
                                maxHeight={180}
                                labelField="label"
                                valueField="value"
                                placeholder={'Select sports'}
                                value={sportFilter}
                                onChange={item => setSportFilter(item.value)}
                            />
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
                        data={filteredData}
                        renderItem={renderItem}
                        keyExtractor={filteredData.id}
                        contentContainerStyle={{paddingBottom: 210}}
                        ListEmptyComponent={() => (
                            <Text style={styles.emptyListText}>
                                No arena found!
                            </Text>
                        )}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

export default FindArena;
