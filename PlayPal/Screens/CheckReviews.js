import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
} from 'react-native';
import React from 'react';
import getPlayerData from '../Functions/getPlayerData';
import getTimeAgo from '../Functions/getTimeAgo';
import {Divider} from '@rneui/themed';
import {Rating} from 'react-native-ratings';

const CheckReviews = ({route}) => {
    const {reviews, arenaRating, ratingCount} = route.params;

    const renderReviewList = ({item}) => {
        let user = getPlayerData(item.userId);

        let reviewTime = getTimeAgo(item.timestamp);
        return (
            <View style={styles.ratingItem}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '62%',
                        }}>
                        <Rating
                            readonly={true}
                            startingValue={item.ratingValue}
                            imageSize={15}
                        />

                        <Text style={styles.ratingValue}>
                            {item.ratingValue}
                        </Text>
                        <Text
                            style={styles.reviewUserText}
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {item.reviewerName}
                        </Text>
                    </View>

                    <Text style={styles.timeElapsed}>({reviewTime})</Text>
                </View>
                {item.review === '' ? (
                    <></>
                ) : (
                    <Text style={styles.reviewText}>{item.review}</Text>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.ratingTitle}>Rating & Reviews</Text>
            <Divider width={1} color="grey" style={styles.divider} />
            <View style={styles.infoSubView}>
                <Image
                    source={require('../Assets/Icons/star.png')}
                    style={styles.starIcon}
                />
                <Text style={styles.rating}>{arenaRating}</Text>
                <Text style={styles.numRating}>({ratingCount})</Text>
            </View>

            <View style={styles.ratingView}>
                <FlatList
                    data={reviews}
                    renderItem={renderReviewList}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{paddingBottom: 10}}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={{fontSize: 16, color: 'grey'}}>
                                No reviews yet!
                            </Text>
                        </View>
                    )}
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
    ratingView: {
        width: '90%',
        marginTop: 30,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        marginBottom: 20,
        paddingTop: 5,
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    infoSubView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    starIcon: {
        width: 18,
        height: 18,
    },
    rating: {
        marginLeft: 10,
        fontSize: 17,
        fontWeight: '600',
        color: 'darkblue',
    },
    numRating: {
        marginLeft: 10,
        fontSize: 14,
        color: 'grey',
    },
    ratingItem: {
        width: '95%',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        padding: 8,
        alignSelf: 'center',
        marginTop: 15,
    },
    reviewUserText: {
        fontSize: 14,
        width: 80,
        color: 'grey',
    },
    timeElapsed: {
        fontSize: 14,
        textAlignVertical: 'center',
        color: 'grey',
    },
    ratingValue: {
        fontSize: 15,
        color: 'black',
        marginRight: 10,
        marginLeft: 10,
    },
    reviewText: {
        fontSize: 15,
        marginTop: 8,
        color: 'black',
    },
});

export default CheckReviews;
