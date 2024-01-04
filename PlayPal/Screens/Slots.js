import React, {useState} from 'react';
import {
    SafeAreaView,
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    FlatList,
    StyleSheet,
} from 'react-native';
import {Button, Card, Divider, Icon} from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import bookingData from '../Assets/bookingData.json';

const Slots = ({navigation, route}) => {
    const {slots, arenaId} = route.params;

    const [selectedDate, setSelectedDate] = useState();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [dateBool, setDateBool] = useState(false);

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
    };

    const gotoPaymentScreen = () => {
        navigation.navigate('PaymentScreen');
    };

    const handleDateChange = async (event, selected) => {
        setShowDatePicker(false);

        if (event.type === 'dismissed') {
            // User canceled the date picker, no need to update the state.
            return;
        }
        if (selected) {
            setSelectedDate(selected);

            const available = await filterAvailableSlots(selected);
            setAvailableSlots(available);
            setDateBool(true);
        }
    };

    const filterAvailableSlots = async date => {
        const dateSelected = date.toLocaleDateString('en-GB');

        const formattedDate = date.toLocaleDateString('en-GB', {
            weekday: 'long',
        });

        const day = formattedDate.split(',')[0];

        const bookedSlots = Object.values(bookingData).filter(
            booking =>
                booking.date === dateSelected && booking.arenaId === arenaId,
        );

        const a = slots.filter(
            slot =>
                slot.days.includes(day) &&
                !bookedSlots.some(booking => booking.slotId === slot.slotId),
        );
        return a;
    };

    const renderItem = ({item, index}) => {
        let slotNumber = index + 1;
        return (
            <Card containerStyle={styles.cardContainer}>
                <View style={styles.cardHeader}>
                    <Text style={styles.slotTitle}>Slot {slotNumber}</Text>

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
                        titleStyle={styles.bookBtnText}
                        color={'#19bd89'}
                        style={{alignItems: 'center'}}
                        containerStyle={styles.bookBtnContainer}
                        onPress={() => gotoPaymentScreen()}
                    />
                </View>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerView}>
                <Text style={styles.titleScreen}>Search Slots</Text>

                <Divider width={1} color="white" style={styles.divider} />

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
                ) : (
                    <FlatList
                        data={availableSlots}
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
        height: 150,
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
    },
    divider: {
        width: '91%',
        marginTop: 5,
        alignSelf: 'center',
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
        marginTop: 30,
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
