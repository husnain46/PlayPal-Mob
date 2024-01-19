import React, {useCallback, useEffect, useState} from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import {Button, Card, Divider, Icon} from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import {Picker} from '@react-native-picker/picker';

const Slots = ({navigation, route}) => {
    const {arenaId, sportsList} = route.params;

    const [selectedDate, setSelectedDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [dateBool, setDateBool] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bookingData, setBookingData] = useState([]);
    const [selectedSport, setSelectedSport] = useState(null);
    const [filteredSlots, setFilteredSlots] = useState([]);

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
    };

    const gotoPaymentScreen = (slot_id, price) => {
        navigation.navigate('PaymentScreen', {
            arena_id: arenaId,
            slot_id,
            slot_price: price * 100,
            slot_date: selectedDate.getTime(),
        });
    };

    useFocusEffect(
        useCallback(() => {
            const clearSlots = () => {
                setAvailableSlots([]);
                setSelectedDate('');
                setDateBool(false);
            };

            clearSlots();
        }, [navigation]),
    );

    useEffect(() => {
        const fetchBookingsData = firestore()
            .collection('bookings')
            .where('arenaId', '==', arenaId)
            .onSnapshot(snapshot => {
                const bookedSlots = [];
                snapshot.forEach(doc => {
                    const bookingData = doc.data();
                    bookedSlots.push(bookingData);
                });

                setBookingData(bookedSlots);
            });

        // Cleanup the listener when the component unmounts
        return () => fetchBookingsData();
    }, [arenaId]);

    const handleDateChange = async (event, selected) => {
        setShowDatePicker(false);

        if (event.type === 'dismissed') {
            // User canceled the date picker, no need to update the state.
            return;
        }
        if (selected) {
            setSelectedDate(selected);
            setLoading(true);
            const available = await filterAvailableSlots(selected);

            setFilteredSlots(available);
            setAvailableSlots(available);
            setDateBool(true);
            setLoading(false);
        }
    };

    const handleSportsFilter = value => {
        setSelectedSport(value);
        console.log(value);

        const filtered = availableSlots.filter(slot => {
            const isSportsMatched = !value || slot.game === value;
            return isSportsMatched;
        });
        console.log(filtered);

        setFilteredSlots(filtered);
    };

    const filterAvailableSlots = async dateSelected => {
        try {
            const formattedDate = dateSelected.toLocaleDateString('en-GB', {
                weekday: 'long',
            });

            const day = formattedDate.split(',')[0];

            const slotsSnapshot = await firestore()
                .collection('arenas')
                .doc(arenaId)
                .get();

            if (slotsSnapshot.exists) {
                const slots = slotsSnapshot.data().slots;

                const bookedSlots = bookingData.filter(
                    doc =>
                        doc.bookingDate.toDate().toDateString() ===
                            dateSelected.toDateString() &&
                        doc.arenaId === arenaId,
                );

                const available = slots.filter(
                    slot =>
                        slot.days.includes(day) &&
                        !bookedSlots.some(
                            booking => booking.slotId === slot.slotId,
                        ),
                );

                return available;
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text2: 'Error loading slots!',
            });
        }
    };

    const renderItem = ({item, index}) => {
        let slotNumber = index + 1;
        return (
            <Card containerStyle={styles.cardContainer}>
                <View style={styles.cardHeader}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.slotTitle}>Slot {slotNumber}</Text>

                        <Text style={styles.sportText}>({item.game})</Text>
                    </View>
                    <Text style={styles.priceText}>PKR {item.price}</Text>
                </View>
                <Divider width={1} color="black" style={styles.divider2} />

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'space-between',
                    }}>
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
                            {`${item.startTime}  ➔  ${item.endTime}`}
                        </Text>
                    </View>
                    <Button
                        title={'Book'}
                        disabled={true}
                        titleStyle={styles.bookBtnText}
                        color={'#19bd89'}
                        style={{alignItems: 'center'}}
                        containerStyle={styles.bookBtnContainer}
                        onPress={() =>
                            gotoPaymentScreen(item.slotId, item.price)
                        }
                    />
                </View>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerView}>
                <Text style={styles.titleScreen}>Search Slots</Text>

                <TouchableOpacity
                    style={styles.dateBtn}
                    onPress={() => setShowDatePicker(true)}>
                    <View style={{flexDirection: 'row'}}>
                        <Icon
                            name="calendar"
                            color={'black'}
                            size={18}
                            type="feather"
                            style={{marginRight: 10, marginLeft: 15}}
                        />
                        {!selectedDate ? (
                            <Text style={styles.dateText}>
                                ________________
                            </Text>
                        ) : (
                            <Text style={styles.dateText}>
                                {selectedDate.toLocaleDateString(
                                    'en-US',
                                    options,
                                )}
                            </Text>
                        )}
                    </View>
                    <Text style={styles.selectText}>Select date</Text>
                </TouchableOpacity>

                <View style={styles.pickerView}>
                    <Picker
                        selectedValue={selectedSport}
                        onValueChange={handleSportsFilter}
                        enabled={dateBool}
                        selectionColor={'#11867F'}
                        style={
                            dateBool
                                ? styles.pickerStyle
                                : styles.disabledPicker
                        }
                        mode="dropdown"
                        dropdownIconColor={dateBool ? '#143B63' : 'darkgrey'}
                        dropdownIconRippleColor={'#11867F'}>
                        <Picker.Item
                            style={styles.pickerBox}
                            label="Select sports"
                            value=""
                            enabled={false}
                            color="grey"
                        />
                        {sportsList.map((sport, index) => (
                            <Picker.Item
                                key={index}
                                style={styles.pickerBox}
                                label={sport}
                                value={sport}
                                color="black"
                            />
                        ))}
                    </Picker>
                </View>
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={!selectedDate ? new Date() : selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}
            <View style={styles.listView}>
                {!dateBool ? (
                    <Text style={styles.promptText}>
                        Select a date to see available slots
                    </Text>
                ) : loading ? (
                    <ActivityIndicator
                        style={{marginTop: 30}}
                        size={35}
                        color={'darkblue'}
                    />
                ) : (
                    <FlatList
                        data={filteredSlots}
                        keyExtractor={item => item.slotId}
                        renderItem={renderItem}
                        ListEmptyComponent={() => {
                            return (
                                <Text style={styles.emptyText}>
                                    No slot available for the selected date!
                                </Text>
                            );
                        }}
                        contentContainerStyle={{paddingBottom: 30}}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    headerView: {
        width: '100%',
        height: 200,
        backgroundColor: '#385c96',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        alignItems: 'center',
    },
    titleScreen: {
        fontSize: 22,
        fontWeight: '500',
        color: 'white',
        textAlign: 'center',
        marginTop: 15,
        letterSpacing: 0.5,
        fontStyle: 'italic',
    },
    dateBtn: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        height: 45,
        elevation: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    dateText: {
        fontSize: 15,
        color: 'black',
    },
    selectText: {
        color: '#2e4a7d',
        fontSize: 15,
        fontWeight: '500',
        marginRight: 20,
    },
    pickerView: {
        width: '80%',
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        textAlignVertical: 'center',
        overflow: 'hidden',
        marginTop: 25,
    },
    pickerStyle: {
        height: 40,
        color: 'black',
        backgroundColor: 'white',
    },
    disabledPicker: {
        height: 40,
        opacity: 0.6,
        color: 'darkgrey',
        backgroundColor: 'white',
    },
    pickerBox: {
        fontSize: 16,
        backgroundColor: 'white',
    },
    listView: {
        marginTop: 20,
        width: '100%',
    },
    promptText: {
        fontSize: 15,
        color: 'grey',
        textAlign: 'center',
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    cardContainer: {
        width: '85%',
        alignSelf: 'center',
        marginBottom: 15,
        borderRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'darkgrey',
        paddingVertical: 12,
    },
    cardHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    slotTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2d5091',
    },
    sportText: {
        fontSize: 14,
        color: 'black',
        left: 5,
    },
    divider2: {
        width: '100%',
        marginTop: 5,
        marginBottom: 10,
        alignSelf: 'center',
    },
    timeText: {
        fontSize: 16,
        color: 'black',
    },
    priceText: {
        fontSize: 16,
        color: 'black',
        textAlign: 'right',
        fontWeight: '700',
    },
    bookBtnContainer: {
        width: 60,
        justifyContent: 'center',
        borderRadius: 8,
    },
    bookBtnText: {
        fontSize: 15,
        color: 'white',
        margin: -3,
    },
});

export default Slots;
