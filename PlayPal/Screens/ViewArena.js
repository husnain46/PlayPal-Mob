import styles from '../Styles/viewArenaStyles';
import React, {useState} from 'react';
import {
    SafeAreaView,
    View,
    Image,
    ScrollView,
    Modal,
    Dimensions,
    TouchableOpacity,
    Text,
    FlatList,
    Linking,
} from 'react-native';
import {Button, Chip} from 'react-native-paper';
import {Divider, Icon} from '@rneui/themed';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import getTimeAgo from '../Functions/getTimeAgo';
import getSportsByIds from '../Functions/getSportsByIds';
import {Rating} from 'react-native-ratings';
import Toast from 'react-native-toast-message';

const ViewArena = ({navigation, route}) => {
    const {arena, arenaRating, ratingCount, arenaId} = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);

    let sportsList = getSportsByIds(arena.sports);

    const openGoogleMaps = location => {
        const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;

        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    Toast.show({
                        type: 'error',
                        text1: 'Google Maps is not installed.',
                    });
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch(err => {
                Toast.show({
                    type: 'error',
                    text2: 'Location could not be loaded!',
                });
            });
    };

    const gotoCheckReviews = () => {
        navigation.navigate('CheckReviews', {
            reviews: arena.rating,
            arenaRating: arenaRating,
            ratingCount: ratingCount,
        });
    };

    const gotoSlots = () => {
        navigation.navigate('Slots', {arenaId, sportsList});
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
        let reviewTime = getTimeAgo(item.timestamp);
        return (
            <View style={styles.ratingItem}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '62%',
                        }}>
                        <Rating
                            readonly={true}
                            startingValue={item.ratingValue}
                            imageSize={15}
                        />
                        <Text style={styles.ratingValue}>
                            {item.ratingValue}
                        </Text>
                        <Text
                            style={styles.reviewUserText}
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {item.reviewerName}
                        </Text>
                    </View>

                    <Text style={styles.timeElapsed}>({reviewTime})</Text>
                </View>
                {item.review === '' ? (
                    <></>
                ) : (
                    <Text style={styles.reviewText}>{item.review}</Text>
                )}
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
                        <Text selectable={true} style={styles.detailText}>
                            {arena.email}
                        </Text>
                    </View>
                    <View style={styles.subView}>
                        <Icon
                            name="phone"
                            color={'#2b3c6b'}
                            size={22}
                            type="FontAwesome5"
                            style={styles.contactIcons}
                        />
                        <Text selectable={true} style={styles.detailText}>
                            {arena.phone}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.mapBtn}
                        onPress={() => openGoogleMaps(arena.location)}>
                        <Text style={styles.mapText}>Maps</Text>
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

                <View style={styles.bookView}>
                    <TouchableOpacity
                        style={styles.bookBtn}
                        onPress={() => gotoSlots()}>
                        <Text style={styles.bookText}>Book slots</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.ratingTitle}>Rating & Reviews</Text>
                <View style={styles.ratingView}>
                    <View style={styles.ratingSubView}>
                        <View style={styles.infoSubView}>
                            <Image
                                source={require('../Assets/Icons/star.png')}
                                style={styles.starIcon}
                            />
                            {arena.rating.length === 0 ? (
                                <></>
                            ) : (
                                <Text style={styles.rating}>{arenaRating}</Text>
                            )}
                            <Text style={styles.numRating}>
                                ({ratingCount})
                            </Text>
                        </View>

                        <Button
                            style={{bottom: 2}}
                            disabled={arena.rating.length === 0 ? true : false}
                            labelStyle={{textDecorationLine: 'underline'}}
                            onPress={() => gotoCheckReviews()}>
                            See all
                        </Button>
                    </View>

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        data={arena.rating.slice(0, 3)}
                        renderItem={renderReviewList}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{paddingBottom: 10}}
                        ListEmptyComponent={() => (
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: 'grey',
                                    textAlign: 'center',
                                    marginTop: 10,
                                }}>
                                No reviews yet!
                            </Text>
                        )}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ViewArena;
