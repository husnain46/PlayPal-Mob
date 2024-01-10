import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import {ActivityIndicator} from 'react-native';
import {Button, Card, Divider, Icon} from '@rneui/themed';
import RatingModal from '../Custom/RatingModal';

const Reviews = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const [pendlingReviews, setPendingReviews] = useState([]);
    const [bookingsData, setBookingsData] = useState([]);
    const myId = auth().currentUser.uid;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refreshData, setRefreshData] = useState(false);

    const currentDate = new Date();

    const toggleModal = isVisible => {
        setIsModalVisible(isVisible);
    };

    const handleRatingSubmission = async (
        rating,
        review,
        arenaId,
        bookingId,
    ) => {
        try {
            const userRef = await firestore()
                .collection('users')
                .doc(myId)
                .get();

            const firstName = userRef.data().firstName;
            const lastName = userRef.data().lastName;
            const myName = `${firstName} ${lastName}`;

            const reviewData = {
                ratingValue: rating,
                review: review,
                reviewerName: myName,
                timestamp: currentDate,
            };

            await firestore().collection('bookings').doc(bookingId).update({
                reviewed: true,
            });

            await firestore()
                .collection('arenas')
                .doc(arenaId)
                .update({
                    rating: firestore.FieldValue.arrayUnion(reviewData),
                });
            // Toggle the control variable to trigger useEffect
            setRefreshData(prev => !prev);
        } catch (error) {
            Toast.show({
                type: 'error',
                text2: 'Error submitting review! Please try again.',
            });
        }
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);

                const bookingRef = await firestore()
                    .collection('bookings')
                    .where('userId', '==', myId)
                    .where('bookingDate', '<', currentDate)
                    .where('reviewed', '==', false)
                    .where('type', '==', 'inApp')
                    .get();

                const fetchedBookings = bookingRef.docs.map(async doc => {
                    const bookingData = {
                        id: doc.id,
                        ...doc.data(),
                    };

                    if (!bookingRef.empty) {
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

                setBookingsData(resolvedBookings);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
                Toast.show({
                    type: 'error',
                    text2: 'Error loading bookings data!',
                });
            }
        };

        fetchBookings();
    }, [refreshData]);

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
    };

    const openReviewModal = () => {
        toggleModal(true);
        setIsModalVisible(true);
    };

    const renderItem = ({item, index}) => {
        let arena = item.arenaData;
        return (
            <Card containerStyle={styles.cardContainer}>
                <View style={styles.cardHeader}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                            source={{uri: arena.arenaPics[0]}}
                            resizeMode="contain"
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 8,
                                borderWidth: 2,
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '500',
                                color: 'black',
                                left: 10,
                            }}>
                            {arena.name}
                        </Text>
                    </View>
                    <Button
                        title={'Review'}
                        containerStyle={{borderRadius: 8}}
                        color={'warning'}
                        onPress={() => openReviewModal()}
                    />
                </View>

                <RatingModal
                    isVisible={isModalVisible}
                    toggleModal={toggleModal}
                    handleRatingSubmission={handleRatingSubmission}
                    arenaId={item.arenaId}
                    bookingId={item.id}
                />

                <Divider width={1} color="black" style={styles.divider} />
                <View style={{marginBottom: 5}}>
                    <Text
                        style={{
                            fontWeight: '500',
                            fontSize: 16,
                            color: 'grey',
                        }}
                        selectable>
                        Booking#: {item.id}
                    </Text>
                </View>
                <View style={styles.cardFooter}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Icon
                            name="time-slot"
                            color={'black'}
                            size={17}
                            type="entypo"
                            style={{marginRight: 10, marginLeft: 1}}
                        />
                        <Text style={styles.timeText}>
                            {`${item.slotData.startTime}  ➔  ${item.slotData.endTime}`}
                        </Text>
                    </View>

                    <Text style={styles.priceText}>
                        {item.bookingDate
                            .toDate()
                            .toLocaleDateString('en-GB', options)}
                    </Text>
                </View>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerView}>
                <Text style={styles.title}>Arena Reviews</Text>
            </View>

            {loading ? (
                <ActivityIndicator size={'large'} style={{marginTop: 50}} />
            ) : (
                <View style={{width: '100%'}}>
                    <FlatList
                        data={bookingsData}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{paddingBottom: 30}}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={{fontSize: 16, color: 'grey'}}>
                                    No pending reviews!
                                </Text>
                            </View>
                        )}
                    />
                </View>
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    cardContainer: {
        width: '90%',
        alignSelf: 'center',
        marginBottom: 5,
        borderRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'darkgrey',
        paddingVertical: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    cardFooter: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 1,
        justifyContent: 'space-between',
    },
    slotTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2d5091',
    },
    divider: {
        width: '100%',
        marginTop: 5,
        marginBottom: 10,
        alignSelf: 'center',
    },
    timeText: {
        fontSize: 16,
        color: '#2d5091',
        fontWeight: '500',
        marginVertical: 5,
    },
    priceText: {
        fontSize: 16,
        color: 'black',
        textAlign: 'right',
        fontWeight: '700',
    },
});

export default Reviews;
