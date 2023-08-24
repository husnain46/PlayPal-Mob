import React, {useState} from 'react';
import {SearchBar, Icon, Card, Button} from '@rneui/themed';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import arenasData from '../Assets/arenasData.json';

const FindArena = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = text => {
        setSearchQuery(text);

        // const searchFilteredData = Object.keys(tournamentData).map(
        //     key => tournamentData[key],
        // );

        // const filtered = searchFilteredData.filter(data => {
        //     const isNameMatched = data.name
        //         .toLowerCase()
        //         .includes(text.toLowerCase());

        //     const isSportsMatched =
        //         !sportsFilter || data.sport.includes(sportsFilter);

        //     const isCityMatched =
        //         !selectedCity || data.city.includes(selectedCity);

        //     return isNameMatched && isSportsMatched && isCityMatched;
        // });

        setFilteredData(filtered);
    };

    const [filteredData, setFilteredData] = useState(
        Object.keys(arenasData).map(key => arenasData[key]),
    );

    const applyFilters = () => {
        setFilteredData(filtered);
        setModalVisible(false);
    };

    const renderItem = ({item}) => {
        return (
            <Card containerStyle={styles.cardContainer}>
                <Card.Image
                    source={{uri: item.arenaPics[0]}}
                    style={styles.cardImage}
                />
                <Text h4>{item.name}</Text>
                <Text style={styles.locationText}>{item.city}</Text>
                <Text>{item.availability}</Text>
                <View style={styles.facilitiesContainer}>
                    {item.facilities.map((facility, index) => (
                        <Button
                            key={index}
                            title={facility}
                            type="outline"
                            buttonStyle={styles.facilityButton}
                            titleStyle={styles.facilityButtonText}
                        />
                    ))}
                </View>
                <Button
                    icon={<Icon name="phone" color="#ffffff" />}
                    buttonStyle={styles.contactButton}
                    title="Contact"
                />
            </Card>
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
            <View style={styles.listView}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={filteredData.arenaId}
                    contentContainerStyle={{paddingBottom: 180}}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    titleScreen: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4A5B96',
        textAlign: 'center',
        marginVertical: 10,
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
    listView: {
        marginTop: 30,
    },
    cardContainer: {
        borderRadius: 10,
        marginBottom: 20,
        overflow: 'hidden',
    },
    cardImage: {
        height: 150,
    },
    locationText: {
        marginTop: 5,
        color: 'gray',
    },
    facilitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    facilityButton: {
        marginRight: 10,
        marginBottom: 5,
        borderColor: '#007bff',
    },
    facilityButtonText: {
        color: '#007bff',
    },
    contactButton: {
        marginTop: 10,
        backgroundColor: '#007bff',
    },
});

export default FindArena;
