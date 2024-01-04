import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import {CardField, useStripe} from '@stripe/stripe-react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Button, Divider} from '@rneui/themed';

const PaymentScreen = ({navigation}) => {
    // const stripe = useStripe();
    const {confirmPayment} = useStripe();
    const [name, setName] = useState('');
    const [cardDetails, setCardDetails] = useState();

    const handlePayment = async () => {
        try {
            let clientSecret = '';
            let totalPrice;

            const {paymentIntent, error} = await confirmPayment({
                amount: totalPrice,
                currency: 'pkr',
                payment_method_types: ['card'],
                client_secret: clientSecret,
            });
            if (paymentIntent) {
                // Successful payment
                const bookingData = {
                    userId: 'user123',
                    bookingId: 'booking456',
                    paymentIntentId: paymentIntent.id,
                    // ... other booking details
                };
                // Send booking data to Firestore immediately
                firestore().collection('bookings').add(bookingData);
            } else {
                // Handle error
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <Text
                style={{
                    fontSize: 22,
                    fontWeight: '600',
                    color: 'darkblue',
                    marginTop: 20,
                }}>
                Payment
            </Text>
            <Divider
                width={1}
                style={{width: '90%', marginTop: 5}}
                color={'grey'}
            />
            <View style={{width: '90%', marginTop: 50}}>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: '600',
                        color: 'black',
                        marginBottom: 10,
                    }}>
                    Enter card details:
                </Text>
                <CardField
                    style={styles.cardForm}
                    cardStyle={{
                        backgroundColor: 'white',
                        placeholderColor: 'gray',
                        borderRadius: 8,
                        textColor: '#1660d9',
                        borderWidth: 1,
                        fontSize: 16,
                    }}
                    postalCodeEnabled={false}
                    placeholders={{
                        number: 'XXXX XXXX XXXX XXXX',
                    }}
                    requiredBillingAddressFields={['name']}
                    onCardChange={cardDetails => {
                        console.log(cardDetails);
                        setCardDetails(cardDetails);
                    }}
                />
            </View>

            <View style={styles.cardDetailsContainer}>
                <View style={styles.carDetailSubView}>
                    <Text style={styles.cardDetailLabel}>Card Number:</Text>
                    <TextInput
                        style={styles.outlinedInput}
                        value={cardDetails?.validNumber}
                        editable={false}
                    />
                </View>

                <View style={styles.carDetailSubView}>
                    <Text style={styles.cardDetailLabel}>Expiry Date:</Text>
                    <TextInput
                        style={styles.outlinedInput2}
                        value={
                            !cardDetails?.validExpiryDate
                                ? cardDetails?.validExpiryDate
                                : cardDetails?.validExpiryDate === 'Incomplete'
                                ? cardDetails?.validExpiryDate
                                : `${cardDetails?.expiryMonth}/${cardDetails?.expiryYear}`
                        }
                        editable={false}
                    />
                </View>

                <View style={styles.carDetailSubView}>
                    <Text style={styles.cardDetailLabel}>CVV:</Text>
                    <TextInput
                        style={styles.outlinedInput2}
                        value={cardDetails?.validCVC}
                        editable={false}
                    />
                </View>
            </View>

            <Button
                title="Pay Now"
                onPress={handlePayment}
                containerStyle={styles.button}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    cardDetailsContainer: {
        marginTop: 20,
        borderWidth: 1,
        width: '85%',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 40,
    },
    carDetailSubView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '70%',
        marginVertical: 5,
    },
    cardDetailLabel: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',

        width: '45%',
    },
    outlinedInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 16,
        width: '50%',
        textAlign: 'center',
        color: '#0b5187',
    },
    outlinedInput2: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 16,
        color: '#0b5187',
        width: '50%',

        textAlign: 'center',
    },
    cardForm: {
        marginBottom: 20,
        height: 55,
    },
    button: {
        width: '90%',
        backgroundColor: '#007bff',
        borderRadius: 10,
    },
});

export default PaymentScreen;
