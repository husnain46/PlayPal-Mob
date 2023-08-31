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
import {Card, Divider, Icon} from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import bookingData from '../Assets/bookingData.json';

const Slots = ({navigation, route}) => {
    const {slots, arenaId} = route.params;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [dateBool, setDateBool] = useState(false);

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    const handleDateChange = async (event, selected) => {
        setShowDatePicker(false);
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

    const renderItem = ({item}) => {
        return (
            <Card containerStyle={styles.cardContainer}>
                <View style={styles.cardHeader}>
                    <Text style={styles.slotTitle}>Slot {item.slotNumber}</Text>

                    <Text style={styles.priceText}>PKR {item.price}</Text>
                </View>
                <Divider width={1} color="black" style={styles.divider2} />

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 25,
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
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{alignItems: 'center'}}
                style={{width: '100%'}}>
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
                                size={20}
                                type="feather"
                                style={{marginRight: 10, marginLeft: 15}}
                            />
                            <Text style={styles.dateText}>
                                {selectedDate.toLocaleDateString(
                                    'en-US',
                                    options,
                                )}
                            </Text>
                        </View>
                        <Text style={styles.selectText}>Select date</Text>
                    </TouchableOpacity>
                </View>
                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        minimumDate={new Date()}
                    />
                )}
                {dateBool ? (
                    <FlatList
                        data={availableSlots}
                        keyExtractor={item => item.slotId}
                        renderItem={renderItem}
                        scrollEnabled={false}
                        contentContainerStyle={{paddingBottom: 30}}
                    />
                ) : (
                    <View style={{marginTop: 20}}>
                        <Text style={{fontSize: 18}}>
                            {availableSlots.length > 0
                                ? 'No slot available!'
                                : 'Select a date to see available slots'}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerView: {
        width: '100%',
        height: 150,
        backgroundColor: '#385c96',
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    titleScreen: {
        fontSize: 23,
        fontWeight: '700',
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
        fontSize: 16,
        color: 'black',
    },
    selectText: {
        color: '#2e4a7d',
        fontSize: 16,
        fontWeight: '500',
        marginRight: 20,
    },
    listView: {
        paddingTop: 20,
    },
    cardContainer: {
        width: 350,
        marginTop: 15,
        borderRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'darkgrey',
        paddingVertical: 12,
    },
    cardHeader: {
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
        width: 321,
        marginTop: 5,
        marginBottom: 15,
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
});

export default Slots;
