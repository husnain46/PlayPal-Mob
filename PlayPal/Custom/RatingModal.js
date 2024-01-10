import {Button, Text} from '@rneui/themed';
import React, {useState} from 'react';
import {
    Modal,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {AirbnbRating} from 'react-native-ratings';

const RatingModal = ({
    isVisible,
    toggleModal,
    handleRatingSubmission,
    arenaId,
    bookingId,
}) => {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    const submitRating = async () => {
        setSubmitLoading(true);
        await handleRatingSubmission(rating, review, arenaId, bookingId);
        setRating(0); // Resetting state after submission
        setReview('');
        toggleModal(false); // Close the modal after submission
        setSubmitLoading(false);
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent
            onRequestClose={() => toggleModal(!isVisible)}>
            <View style={styles.modalContainer}>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    accessible={false}>
                    <View style={styles.modalContent}>
                        {/* Rating component */}
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 16,
                                marginBottom: 10,
                            }}>
                            Give your review here...
                        </Text>

                        <AirbnbRating
                            count={5}
                            defaultRating={rating}
                            reviewSize={18}
                            reviewColor="orange"
                            showRating={true}
                            ratingContainerStyle={{marginBottom: 20}}
                            size={20}
                            onFinishRating={value => setRating(value)}
                        />
                        {/* Review input */}
                        <TextInput
                            mode="outlined"
                            numberOfLines={3}
                            outlineStyle={{borderRadius: 8}}
                            placeholder="Write your review..."
                            placeholderTextColor={'grey'}
                            multiline
                            style={styles.input}
                            value={review}
                            onChangeText={text => setReview(text)}
                        />
                        <Button
                            title="Submit"
                            color={'#1ac775'}
                            titleStyle={{fontWeight: '700', letterSpacing: 0.5}}
                            containerStyle={{borderRadius: 8}}
                            onPress={submitRating}
                            loading={submitLoading}
                            loadingProps={{color: 'white'}}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    input: {
        marginBottom: 30,
    },
});

export default RatingModal;
