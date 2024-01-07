import React, {useRef, useState} from 'react';
import {
    Keyboard,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {CardField, useConfirmPayment} from '@stripe/stripe-react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Button, Divider} from '@rneui/themed';
import AlertPro from 'react-native-alert-pro';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';
import {CommonActions} from '@react-navigation/native';

const PaymentScreen = ({navigation, route}) => {
    const {arena_id, slot_id, slot_price, slot_date} = route.params;
    const selectedDate = new Date(slot_date);

    const {confirmPayment} = useConfirmPayment();
    const [name, setName] = useState('');
    const [cardDetails, setCardDetails] = useState();
    const myId = auth().currentUser.uid;
    const currentDate = new Date();
    const [loading, setLoading] = useState(false);

    const [errorTitle, setErrorTitle] = useState('Incomplete Card Details');
    const [errorMessage, setErrorMessage] = useState(
        'Please fill in all card details.',
    );

    const [emptyError, setEmptyError] = useState('');

    const alertRefs = useRef([]);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const gotoMyBookings = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1, // Navigate to MyBookings and set it as the only screen in the stack
                routes: [
                    {name: 'BottomTab'}, // Set Home as the initial route
                    {name: 'MyBookings'}, // MyBookings will be second in the stack
                ],
            }),
        );
    };

    const renderAlert = () => {
        return (
            <AlertPro
                ref={ref => (alertRefs.current = ref)}
                title={errorTitle}
                message={errorMessage}
                onConfirm={() => alertRefs.current.close()}
                showCancel={false}
                textConfirm={'Ok'}
                customStyles={{
                    buttonConfirm: {backgroundColor: '#2bad8b'},
                    container: {borderWidth: 2, borderColor: 'lightgrey'},
                }}
            />
        );
    };

    const fetchPaymentIntentClientSecret = async amount => {
        try {
            const response = await fetch(
                'http://192.168.1.5:3000/payment-intent',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: amount,
                        currency: 'pkr',
                    }),
                },
            );
            const {clientSecret} = await response.json();

            return clientSecret;
        } catch (error) {
            return null;
        }
    };

    const handlePayment = async () => {
        if (!cardDetails?.complete || name.trim() === '') {
            if (!cardDetails?.complete && name.trim() === '') {
                setEmptyError(
                    'Please fill in all card details and enter cardholder name!',
                );
            } else if (!cardDetails?.complete) {
                setEmptyError('Please fill in all card details!');
            } else {
                setEmptyError('Please enter cardholder name!');
            }
            console.log(cardDetails?.complete);
        } else {
            setEmptyError('');
            try {
                setLoading(true);

                const clientSecret = await fetchPaymentIntentClientSecret(
                    slot_price,
                );

                // Confirm the payment with the card details
                const {paymentIntent, error} = await confirmPayment(
                    clientSecret,
                    {
                        paymentMethodType: 'Card',
                        paymentMethodData: {
                            card: {
                                number:
                                    cardDetails?.complete &&
                                    cardDetails?.number,
                                expMonth:
                                    cardDetails?.complete &&
                                    cardDetails?.expMonth,
                                expYear:
                                    cardDetails?.complete &&
                                    cardDetails?.expYear,
                                cvc: cardDetails?.complete && cardDetails?.cvc,
                            },
                            billingDetails: {
                                name: name,
                                email: auth().currentUser.email,
                            },
                        },
                    },
                );

                if (error) {
                    console.log(error);
                    // Check the error code to determine a more specific title
                    if (
                        error.code === 'payment_intent_authentication_failure'
                    ) {
                        setErrorTitle('Authentication Failure');
                        setErrorMessage(
                            'The payment authentication failed. Please check your authentication details.',
                        );
                    } else if (error.code === 'card_declined') {
                        setErrorTitle('Card Declined');
                        setErrorMessage(
                            'The card was declined. Please use a different card or contact your card issuer.',
                        );
                    } else if (error.code === 'incorrect_cvc') {
                        setErrorTitle('Incorrect CVC');
                        setErrorMessage('The CVC code provided is incorrect.');
                    } else if (error.code === 'expired_card') {
                        setErrorTitle('Expired Card');
                        setErrorMessage(
                            'The card has expired. Please use a different card.',
                        );
                    } else if (error.code === 'processing_error') {
                        setErrorTitle('Processing Error');
                        setErrorMessage(
                            'An error occurred while processing the payment.',
                        );
                    }
                    setLoading(false);

                    alertRefs.current.open();
                } else if (paymentIntent) {
                    const bookingData = {
                        userId: myId,
                        arenaId: arena_id,
                        paymentIntentId: paymentIntent.id,
                        slotId: slot_id,
                        createdAt: currentDate,
                        amount: slot_price,
                        type: 'inApp',
                        bookingDate: selectedDate,
                        reviewed: false,
                    };

                    // Send booking data to Firestore immediately
                    await firestore().collection('bookings').add(bookingData);

                    setIsConfirmed(true);

                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                Toast.show({
                    type: 'error',
                    text2: 'An unexpected error occurred!',
                });
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {!isConfirmed ? (
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    accessible={false}>
                    <View style={styles.cardDetailsView}>
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
                                    if (cardDetails?.complete) {
                                        // Card is complete and valid
                                        setCardDetails(cardDetails);
                                        setErrorTitle('Payment Error!');
                                        setErrorMessage(
                                            'An error occurred during payment processing.',
                                        );
                                    }
                                }}
                            />
                        </View>

                        {renderAlert()}

                        <View style={styles.cardDetailsContainer}>
                            <Text style={styles.cardDetailLabel}>
                                Cardholder Name:
                            </Text>
                            <TextInput
                                style={styles.outlinedInput}
                                value={name}
                                onChangeText={text => setName(text.trim())}
                                placeholder="Enter cardholder name"
                                placeholderTextColor={'grey'}
                            />
                        </View>
                        {emptyError ? (
                            <Text style={styles.emptyText}>{emptyError}</Text>
                        ) : (
                            <></>
                        )}

                        <Button
                            title="Pay Now"
                            onPress={handlePayment}
                            containerStyle={styles.button}
                            loading={loading}
                            loadingProps={{color: 'blue'}}
                            disabled={loading}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ) : (
                <View
                    style={{
                        alignItems: 'center',
                        flex: 0.9,
                        justifyContent: 'center',
                    }}>
                    <Text style={styles.thanksText}>
                        Thank You For booking our arena.
                    </Text>
                    <LottieView
                        source={require('../Assets/Animations/checked.json')}
                        autoPlay
                        loop={false}
                        style={{
                            flexShrink: 1,
                            width: 200,
                            height: 200,
                            marginTop: 20,
                        }}
                    />
                    <Text style={styles.confirmText}>Booking confirmed!</Text>

                    <View style={{marginTop: 100}}>
                        <Button
                            title="Check My Bookings"
                            onPress={gotoMyBookings}
                            color={'#1db56c'}
                            containerStyle={styles.bookingBtn}
                        />
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    cardDetailsView: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    cardDetailsContainer: {
        marginTop: 20,
        width: '90%',
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 20,
    },
    cardDetailLabel: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
        width: '40%',
        fontSize: 16,
    },
    outlinedInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 16,
        width: '60%',
        textAlign: 'justify',
        color: '#0b5187',
    },
    cardForm: {
        marginBottom: 20,
        height: 55,
    },
    emptyText: {
        color: 'red',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 20,
    },
    button: {
        width: '90%',
        backgroundColor: '#007bff',
        borderRadius: 10,
    },
    thanksText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
    },
    confirmText: {
        fontSize: 20,
        color: 'darkblue',
        fontWeight: '600',
    },
    bookingBtn: {
        width: 200,
        backgroundColor: '#007bff',
        borderRadius: 10,
    },
});

export default PaymentScreen;
