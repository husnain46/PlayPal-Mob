import styles from '../Styles/findArenaStyles';
import React, {useState} from 'react';
import {SearchBar, Card, Divider} from '@rneui/themed';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    Modal,
} from 'react-native';
import arenasData from '../Assets/arenasData.json';
import {Dropdown} from 'react-native-element-dropdown';
import sportsList from '../Assets/sportsList.json';
import {Button, Chip} from 'react-native-paper';
import cityData from '../Assets/cityData.json';
import getSportsByIds from '../Functions/getSportsByIds';

const FindArena = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sportFilter, setSportFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [isFocus, setIsFocus] = useState(false);

    const gotoViewArena = (arena, arenaRating, ratingCount, arenaId) => {
        navigation.navigate('ViewArena', {
            arena,
            arenaRating,
            ratingCount,
            arenaId,
        });
    };

    const getArenaId = arenaName => {
        const arenaId = Object.keys(arenasData).find(
            key => arenasData[key].name === arenaName,
        );
        return arenaId;
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

        return averageRating;
    };

    const resetFilters = () => {
        setSportFilter('');
        setCityFilter('');
    };

    const handleSearch = text => {
        setSearchQuery(text);

        const searchFilteredData = Object.keys(arenasData).map(
            key => arenasData[key],
        );

        const filtered = searchFilteredData.filter(data => {
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

    const [filteredData, setFilteredData] = useState(
        Object.keys(arenasData).map(key => arenasData[key]),
    );

    const applyFilters = () => {
        const filtered = Object.keys(arenasData)
            .map(key => arenasData[key])
            .filter(data => {
                const isNameMatched = data.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

                const isCityMatched =
                    !cityFilter || data.city.includes(cityFilter);

                const isSportsMatched =
                    !sportFilter ||
                    data.sports.some(sport => sport.includes(sportFilter));

                return isNameMatched && isCityMatched && isSportsMatched;
            });
        setFilteredData(filtered);
        setModalVisible(false);
    };

    const renderItem = ({item}) => {
        let arenaRating = getAverageRating(item.rating);
        let ratingCount = getRatingCount(item.rating.length);
        let sportsList = getSportsByIds(item.sports);
        let startingPrice = getStartingPrice(item.slots);

        let arenaId = getArenaId(item.name);

        return (
            <TouchableOpacity
                onPress={() =>
                    gotoViewArena(item, arenaRating, ratingCount, arenaId)
                }
                style={{width: '85%', alignSelf: 'center'}}>
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
                            <Text style={styles.rating}>{arenaRating}</Text>
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
                                    style={styles.sportChip}>
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
            <Text style={styles.titleScreen}>Sports Arenas</Text>
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
                    keyExtractor={filteredData.arenaId}
                    contentContainerStyle={{paddingBottom: 210}}
                />
            </View>
        </SafeAreaView>
    );
};

export default FindArena;
