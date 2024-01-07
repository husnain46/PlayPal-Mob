import React, {useState} from 'react';
import {Modal, View, TextInput, Button, StyleSheet} from 'react-native';

const RatingModal = ({isVisible, toggleModal, handleRatingSubmission}) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    const submitRating = () => {
        handleRatingSubmission(rating, review);
        setRating(0); // Resetting state after submission
        setReview('');
        toggleModal(false); // Close the modal after submission
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.input}
                        placeholder="Rating"
                        keyboardType="numeric"
                        value={rating.toString()}
                        onChangeText={value => setRating(value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Review"
                        multiline
                        value={review}
                        onChangeText={text => setReview(text)}
                    />
                    <Button title="Submit" onPress={submitRating} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
        padding: 8,
        borderRadius: 5,
    },
});

export default RatingModal;
