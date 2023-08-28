import {SafeAreaView, StyleSheet, Text, View, FlatList} from 'react-native';
import React from 'react';
import getPlayerData from '../Functions/getPlayerData';
import getTimeAgo from '../Functions/getTimeAgo';
import {Divider} from '@rneui/themed';

const Reviews = ({route}) => {
    const {reviews, arenaRating, ratingCount} = route.params;

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
            <Text style={styles.ratingTitle}>Rating & Reviews</Text>
            <Divider width={1} color="grey" style={styles.divider} />
            <View style={{width: '90%', marginTop: 30}}>
                <Text style={styles.arenaRatingText}>
                    Arena Rating: {arenaRating}
                </Text>
            </View>

            <View style={styles.ratingView}>
                <Text style={styles.numRating}>({ratingCount})</Text>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={reviews}
                    renderItem={renderReviewList}
                    keyExtractor={item => item.ratingId}
                    contentContainerStyle={{paddingBottom: 10}}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    ratingTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#4a5a96',
        textAlign: 'center',
        width: 250,
        marginTop: 15,
    },
    divider: {
        width: '91%',
        marginTop: 10,
        alignSelf: 'center',
    },
    arenaRatingText: {
        fontSize: 17,
        color: 'black',
        fontWeight: '500',
        textAlign: 'left',
    },
    ratingView: {
        width: '90%',
        marginTop: 30,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        marginBottom: 20,
        padding: 10,
    },
    numRating: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
        marginBottom: 10,
    },
    ratingItem: {
        marginTop: 20,
        width: '95%',
        borderWidth: 1.5,
        borderColor: 'grey',
        borderRadius: 10,
        padding: 10,
        alignSelf: 'center',
    },
    reviewUserText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'black',
    },
    timeElapsed: {
        fontSize: 14,
        marginLeft: 15,
        textAlignVertical: 'center',
    },
    ratingValue: {
        fontSize: 16,
        color: 'black',
        marginRight: 10,
    },
    reviewText: {
        fontSize: 16,
        marginTop: 8,
    },
});

export default Reviews;
