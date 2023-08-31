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
} from 'react-native';
import {Button, Chip} from 'react-native-paper';
import {Divider, Icon} from '@rneui/themed';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import getPlayerData from '../Functions/getPlayerData';
import getTimeAgo from '../Functions/getTimeAgo';
import getSportsByIds from '../Functions/getSportsByIds';

const ViewArena = ({navigation, route}) => {
    const {arena, arenaRating, ratingCount, arenaId} = route.params;
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
        navigation.navigate('Slots', {slots: arena.slots, arenaId});
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
                    <TouchableOpacity style={styles.mapBtn}>
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

export default ViewArena;
