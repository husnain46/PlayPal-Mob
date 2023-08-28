import React, {useState} from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Image,
    ScrollView,
    Modal,
    Dimensions,
    TouchableOpacity,
    Text,
    FlatList,
} from 'react-native';
import {Button, Chip} from 'react-native-paper';
import {Divider, Icon} from '@rneui/themed';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import getPlayerData from '../Functions/getPlayerData';
import getTimeAgo from '../Functions/getTimeAgo';
import getSportsByIds from '../Functions/getSportsByIds';

const ViewArena = ({navigation, route}) => {
    const {arena, arenaRating, ratingCount} = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);

    let sportsList = getSportsByIds(arena.sports);

    const gotoReviews = () => {
        navigation.navigate('Reviews', {
            reviews: arena.rating,
            arenaRating: arenaRating,
            ratingCount: ratingCount,
        });
    };

    const gotoSlots = () => {
        navigation.navigate('Slots', {slots: arena.slots});
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

    const renderCarousel = ({item}) => (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
                source={{uri: item}}
                style={styles.carouselImage}
                resizeMode="stretch"
            />
        </TouchableOpacity>
    );

    const renderModalCarousel = ({item}) => (
        <Image
            source={{uri: item}}
            style={styles.modalImage}
            resizeMode="contain"
        />
    );

    const renderReviewList = ({item}) => {
        let user = getPlayerData(item.userId);
        let userName = `${user.firstName} ${user.lastName}`;
        let reviewTime = getTimeAgo(item.timestamp);
        return (
            <View style={styles.ratingItem}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.reviewUserText}>{userName}</Text>
                        <Text style={styles.timeElapsed}>{reviewTime}</Text>
                    </View>
                    <Text style={styles.ratingValue}>
                        ⭐ {item.ratingValue}
                    </Text>
                </View>
                <Text style={styles.reviewText}>{item.review}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{alignItems: 'center'}}
                style={{width: '100%'}}>
                <Carousel
                    data={arena.arenaPics}
                    renderItem={renderCarousel}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={Dimensions.get('window').width}
                    onSnapToItem={index => setActiveSlide(index)}
                />
                <Pagination
                    dotsLength={arena.arenaPics.length}
                    activeDotIndex={activeSlide}
                    containerStyle={styles.paginationContainer}
                    dotStyle={styles.paginationDot}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    dotColor="black"
                    inactiveDotColor="black"
                />

                <Modal visible={modalVisible} transparent={true}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        <Carousel
                            data={arena.arenaPics}
                            renderItem={renderModalCarousel}
                            sliderWidth={Dimensions.get('window').width}
                            itemWidth={Dimensions.get('window').width}
                            initialScrollIndex={activeSlide}
                        />
                    </View>
                </Modal>

                <Text style={styles.arenaTitle}>{arena.name}</Text>
                <Text style={styles.cityText}>({arena.city})</Text>
                <Divider width={1} color="darkgrey" style={styles.divider} />

                <View></View>

                <View style={styles.detailView}>
                    <View style={styles.subView}>
                        <Icon
                            name="location-pin"
                            color={'#bd2a17'}
                            size={22}
                            type="FontAwesome5"
                            style={styles.contactIcons}
                        />
                        <Text style={styles.detailText}>{arena.address}</Text>
                    </View>
                    <View style={styles.subView}>
                        <Icon
                            name="email"
                            color={'#4a5a96'}
                            size={22}
                            type="FontAwesome5"
                            style={styles.contactIcons}
                        />
                        <Text style={styles.detailText}>{arena.email}</Text>
                    </View>
                    <View style={styles.subView}>
                        <Icon
                            name="phone"
                            color={'#2b3c6b'}
                            size={22}
                            type="FontAwesome5"
                            style={styles.contactIcons}
                        />
                        <Text style={styles.detailText}>{arena.phone}</Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            width: 120,
                            height: 40,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 5,
                            marginBottom: 15,
                            borderRadius: 12,
                            backgroundColor: '#05b08e',
                            elevation: 5,
                        }}>
                        <Text style={styles.locText}>Maps</Text>
                        <Icon
                            name="location"
                            color={'white'}
                            size={17}
                            type="entypo"
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.mainView}>
                    <Text style={styles.sportsTitle}>Sports:</Text>
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
                    <Divider
                        width={1}
                        color="darkgrey"
                        style={styles.divider2}
                    />

                    <Text style={styles.facilitiesTitle}>Facilities:</Text>
                    <View style={styles.facilitiesView}>
                        {arena.facilities.map((facility, index) => (
                            <View key={index} style={styles.facilitySubView}>
                                <Icon
                                    name="checkcircleo"
                                    color={'black'}
                                    size={18}
                                    type="antdesign"
                                />
                                <Text style={styles.facilityText}>
                                    {facility}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <Button
                    mode="contained"
                    buttonColor="#4a5a96"
                    style={{marginTop: 30, marginBottom: 5}}
                    labelStyle={{fontSize: 16}}
                    onPress={() => gotoSlots()}>
                    Book slots
                </Button>

                <Text style={styles.ratingTitle}>Rating & Reviews</Text>
                <View style={styles.ratingView}>
                    <View style={styles.ratingSubView}>
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
                        <Button
                            style={{bottom: 2}}
                            labelStyle={{textDecorationLine: 'underline'}}
                            onPress={() => gotoReviews()}>
                            See all
                        </Button>
                    </View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        data={arena.rating}
                        renderItem={renderReviewList}
                        keyExtractor={item => item.ratingId}
                        contentContainerStyle={{paddingBottom: 10}}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    carouselImage: {
        width: Dimensions.get('window').width,
        height: 250,
    },
    paginationContainer: {
        marginTop: -10,
        marginBottom: -20,
        alignSelf: 'center',
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 1)',
    },
    modalImage: {
        width: Dimensions.get('window').width,
        height: '100%',
        marginTop: -30,
    },
    closeButton: {
        marginTop: 20,
        alignSelf: 'flex-end',
        width: 30,
        height: 30,
        marginRight: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    arenaTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#4a5a96',
        textAlign: 'center',
        width: 250,
        marginTop: 15,
    },
    cityText: {
        fontSize: 16,
        color: 'black',
        marginTop: 5,
        fontWeight: '600',
    },
    divider: {
        width: '91%',
        marginTop: 10,
        alignSelf: 'center',
    },
    divider2: {
        width: '93%',
        marginTop: 10,
        alignSelf: 'center',
    },
    detailView: {
        width: '90%',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        paddingHorizontal: 15,
        paddingTop: 5,
    },
    subView: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    contactIcons: {
        marginRight: 10,
    },
    detailLabel: {
        fontSize: 17,
        color: 'black',
        fontWeight: '700',
        marginRight: 10,
    },
    detailText: {
        fontSize: 16,
        color: 'black',
    },
    locText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginRight: 15,
    },
    mainView: {
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        width: '90%',
        marginTop: 20,
    },
    sportsTitle: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: '700',
        color: 'black',
        marginLeft: 15,
    },
    sportsView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '95%',
        paddingHorizontal: 10,
        paddingTop: 12,
        alignSelf: 'center',
    },
    sportChip: {
        marginRight: 8,
        marginBottom: 10,
        backgroundColor: '#d5dbf0',
    },
    facilitiesTitle: {
        marginTop: 15,
        marginLeft: 15,
        fontSize: 18,
        fontWeight: '700',
        color: 'black',
    },
    facilitiesView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '95%',
        paddingHorizontal: 10,
        paddingTop: 12,
        paddingBottom: 10,
        alignSelf: 'center',
    },
    facilitySubView: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
        marginLeft: 5,
    },
    facilityText: {
        fontSize: 16,
        color: 'black',
        marginLeft: 7,
        marginRight: 20,
    },
    ratingTitle: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: '700',
        color: 'black',
        textDecorationLine: 'underline',
    },
    ratingView: {
        width: '90%',
        maxHeight: 350,
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        marginBottom: 20,
        padding: 10,
    },
    ratingSubView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoSubView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: -5,
    },
    starIcon: {
        width: 18,
        height: 18,
    },
    rating: {
        marginLeft: 10,
        fontSize: 17,
        fontWeight: '600',
        color: 'darkblue',
    },
    numRating: {
        marginLeft: 10,
        fontSize: 14,
    },
    ratingItem: {
        marginTop: 10,
        width: '95%',
        borderWidth: 1.5,
        borderColor: 'grey',
        borderRadius: 10,
        padding: 10,
        alignSelf: 'center',
    },
    reviewUserText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'black',
    },
    timeElapsed: {
        fontSize: 14,
        marginLeft: 15,
        textAlignVertical: 'center',
    },
    ratingValue: {
        fontSize: 16,
        color: 'black',
        marginRight: 10,
    },
    reviewText: {
        fontSize: 16,
        marginTop: 8,
    },
});

export default ViewArena;
