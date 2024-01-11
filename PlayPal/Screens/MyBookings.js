import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    SectionList,
    TouchableOpacity,
    Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import {ActivityIndicator} from 'react-native';
import {Tab, TabView, Card, Divider, Icon} from '@rneui/themed';

const MyBookings = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const [bookingsData, setBookingsData] = useState([]);
    const myId = auth().currentUser.uid;
    const [tabIndex, setTabIndex] = useState(0);

    const gotoArena = (arena, arenaRating, ratingCount, arenaId) => {
        navigation.navigate('ViewArena', {
            arena,
            arenaRating,
            ratingCount,
            arenaId,
        });
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

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const bookingSnap = await firestore()
                    .collection('bookings')
                    .where('userId', '==', myId)
                    .where('type', '==', 'inApp')
                    .get();

                const fetchedBookings = bookingSnap.docs.map(async doc => {
                    const bookingData = {
                        id: doc.id,
                        ...doc.data(),
                    };

                    if (!bookingSnap.empty) {
                        const arenaRef = await firestore()
                            .collection('arenas')
                            .doc(bookingData.arenaId)
                            .get();

                        if (arenaRef.exists) {
                            const slotsArray = arenaRef.data().slots;

                            bookingData.slotData = slotsArray.find(
                                slot => slot.slotId === doc.data().slotId,
                            );
                            bookingData.arenaData = arenaRef.data();
                        }
                    }

                    return bookingData;
                });

                const resolvedBookings = await Promise.all(fetchedBookings);
                resolvedBookings.sort((a, b) => {
                    return b.createdAt.toDate() - a.createdAt.toDate();
                });
                setBookingsData(resolvedBookings);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                Toast.show({
                    type: 'error',
                    text2: 'Error loading bookings data!',
                });
            }
        };

        fetchBookings();
    }, []);

    const sectionedData = () => {
        const currentDate = new Date(); // Get the current date

        const currentBookings = [];
        const previousBookings = [];

        // Loop through bookingsData and separate current and previous bookings
        bookingsData.forEach(booking => {
            const bookingDate = booking.createdAt.toDate();
            if (bookingDate <= currentDate) {
                currentBookings.push(booking);
            } else {
                previousBookings.push(booking);
            }
        });

        const currentSections = {};
        const previousSections = {};

        // Create sections for current bookings
        currentBookings.forEach(booking => {
            const date = booking.createdAt.toDate().toLocaleDateString('en-GB');
            if (!currentSections[date]) {
                currentSections[date] = [];
            }
            currentSections[date].push(booking);
        });

        // Create sections for previous bookings
        previousBookings.forEach(booking => {
            const date = booking.createdAt.toDate().toLocaleDateString('en-GB');
            if (!previousSections[date]) {
                previousSections[date] = [];
            }
            previousSections[date].push(booking);
        });

        return {
            current: Object.keys(currentSections).map(date => ({
                title: date,
                data: currentSections[date],
            })),
            previous: Object.keys(previousSections).map(date => ({
                title: date,
                data: previousSections[date],
            })),
        };
    };

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
    };

    const renderItem = ({item, index}) => {
        // let slotNumber = index + 1;
        let arena = item.arenaData;
        let arenaRating = getAverageRating(arena.rating);
        let ratingCount = getRatingCount(arena.rating.length);

        return (
            <Card containerStyle={styles.cardContainer}>
                <View style={{marginBottom: 10}}>
                    <Text
                        style={{fontWeight: '300', fontSize: 15, color: 'grey'}}
                        selectable>
                        Booking# {item.id}
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            color: 'black',
                            marginTop: 5,
                        }}>
                        Slot: {item.slotData.game}
                    </Text>
                </View>
                <View style={styles.cardHeader}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '57%',
                        }}>
                        <Icon
                            name="time-slot"
                            color={'black'}
                            size={15}
                            type="entypo"
                            style={{marginRight: 5}}
                        />
                        <Text style={styles.timeText}>
                            {`${item.slotData.startTime}  ➔  ${item.slotData.endTime}`}
                        </Text>
                    </View>

                    <Text style={styles.dateText}>
                        {item.bookingDate
                            .toDate()
                            .toLocaleDateString('en-GB', options)}
                    </Text>
                </View>
                <Divider width={1} color="black" style={styles.divider} />

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'space-between',
                    }}
                    onPress={() =>
                        gotoArena(arena, arenaRating, ratingCount, item.arenaId)
                    }>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {arena.hasOwnProperty('arenaPics') ? (
                            <Image
                                source={{uri: arena.arenaPics[0]}}
                                resizeMode="stretch"
                                style={{
                                    width: 50,
                                    height: 45,
                                    borderRadius: 10,
                                    marginRight: 10,
                                }}
                            />
                        ) : (
                            <Image
                                source={require('../Assets/Icons/no-image.png')}
                                resizeMode="stretch"
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 10,
                                    marginRight: 10,
                                }}
                            />
                        )}

                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '500',
                                color: 'black',
                            }}>
                            {arena.name}
                        </Text>
                    </View>
                    <Icon
                        name="chevron-with-circle-right"
                        color={'black'}
                        size={28}
                        type="entypo"
                        style={{}}
                    />
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerView}>
                <Text style={styles.title}>My Bookings</Text>
            </View>

            <View>
                <Tab
                    value={tabIndex}
                    style={{width: '80%', alignSelf: 'center'}}
                    onChange={setTabIndex}
                    titleStyle={{color: '#4a5a96', fontSize: 17}}
                    indicatorStyle={{backgroundColor: '#4a5a96', height: 3}}>
                    <Tab.Item title="Current" />
                    <Tab.Item title="Previous" />
                </Tab>
            </View>
            {loading ? (
                <ActivityIndicator size={'large'} style={{marginTop: 50}} />
            ) : (
                <TabView
                    value={tabIndex}
                    onChange={setTabIndex}
                    animationType="spring">
                    <TabView.Item style={{width: '100%'}}>
                        <SectionList
                            sections={sectionedData().current}
                            keyExtractor={item => item.id}
                            renderItem={renderItem}
                            renderSectionHeader={({section: {title}}) => (
                                <Text style={styles.sectionHeaderText}>
                                    {title}
                                </Text>
                            )}
                            contentContainerStyle={{paddingBottom: 40}}
                            ListEmptyComponent={() => (
                                <View style={styles.emptyContainer}>
                                    <Text style={{fontSize: 16, color: 'grey'}}>
                                        No current bookings yet!
                                    </Text>
                                </View>
                            )}
                        />
                    </TabView.Item>

                    <TabView.Item
                        style={{backgroundColor: 'lightgrey', width: '100%'}}>
                        <SectionList
                            sections={sectionedData().previous}
                            keyExtractor={item => item.id}
                            renderItem={renderItem}
                            renderSectionHeader={({section: {title}}) => (
                                <Text style={styles.sectionHeaderText}>
                                    {title}
                                </Text>
                            )}
                            contentContainerStyle={{paddingBottom: 40}}
                            ListEmptyComponent={() => (
                                <View style={styles.emptyContainer}>
                                    <Text style={{fontSize: 16, color: 'grey'}}>
                                        No previous bookings available!
                                    </Text>
                                </View>
                            )}
                        />
                    </TabView.Item>
                </TabView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerView: {
        width: '100%',
        marginBottom: 15,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        backgroundColor: '#4a5a96',
        alignItems: 'center',
        height: 70,
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        fontStyle: 'italic',
        color: 'white',
    },
    sectionHeaderText: {
        fontSize: 18,
        color: '#325a6e',
        textAlign: 'center',
        letterSpacing: 0.5,
        textDecorationLine: 'underline',
        fontWeight: '500',
        marginTop: 30,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    cardContainer: {
        width: '95%',
        alignSelf: 'center',
        marginBottom: 5,
        borderRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'darkgrey',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    cardHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    divider: {
        width: '100%',
        marginTop: 5,
        marginBottom: 10,
        alignSelf: 'center',
    },
    timeText: {
        fontSize: 15,
        color: '#2d5091',
        fontWeight: '500',
        bottom: 1,
    },
    dateText: {
        fontSize: 15,
        width: '43%',
        color: 'black',
        textAlign: 'right',
        fontWeight: '600',
    },
});

export default MyBookings;
