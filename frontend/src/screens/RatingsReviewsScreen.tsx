import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import {RouteProp, useNavigation } from '@react-navigation/native';
import { AirbnbRating } from 'react-native-ratings';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteStackParamList } from '../../App';
import { Ratings } from '../constants/types';


type RatingsReviewsScreenRouteProp = RouteProp<RouteStackParamList, 'RatingsReviews'>;

const RatingsReviewsScreen: React.FC<{route: RatingsReviewsScreenRouteProp}> = ({ route }) => {
    const navigation = useNavigation();
    const { itemDetails } = route.params; 

    function calculateAverageRating(ratings: Ratings): number {
        const totalRatings = ratings[1] + ratings[2] + ratings[3] + ratings[4] + ratings[5];
        const weightedSum =
          ratings[1] * 1 +
          ratings[2] * 2 +
          ratings[3] * 3 +
          ratings[4] * 4 +
          ratings[5] * 5;
      
        return totalRatings > 0 ? weightedSum / totalRatings : 0;
      }

    // Sample data for ratings and reviews
    const reviews = [
        {
            id: 1,
            user: 'Helene Moore',
            avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
            rating: 4,
            date: 'June 5, 2019',
            review:
                "The dress is great! Very classy and comfortable. It fit perfectly! I'm 5'7'' and 130 pounds. I am a 34B chest. This dress would be too long for those who are shorter but could be hemmed...",
            helpful: true,
        },
        {
            id: 2,
            user: 'Kate Doe',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            rating: 5,
            date: 'July 10, 2020',
            review: 'Loved this dress! Great quality and fit was perfect!',
            helpful: false,
        },
    ];

    const starData = [
        { stars: 5, count: itemDetails?.ratings?.[5] || 0 },
        { stars: 4, count: itemDetails?.ratings?.[4] || 0 },
        { stars: 3, count: itemDetails?.ratings?.[3] || 0 },
        { stars: 2, count: itemDetails?.ratings?.[2] || 0 },
        { stars: 1, count: itemDetails?.ratings?.[1] || 0 },
    ];

    const totalRatings = Object.values(itemDetails?.ratings || {}).reduce((a, b) => a + b, 0); // Tổng số đánh giá

    return (
        <SafeAreaView className="flex-1 bg-white px-4">
            {/* Header */}
            <View className="pb-2 flex-row items-center">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
                <Text className="text-2xl font-bold ml-2">Ratings & Reviews</Text>
            </View>

            {/* Ratings Summary */}
            <View className="my-4">               
                <View className="flex flex-row items-center mt-3">
                    <Text className="text-5xl font-bold">{calculateAverageRating(itemDetails.ratings).toFixed(1)}</Text>
                    <View className="ml-6">
                        {starData.map(({ stars, count }) => (
                            <View key={stars} className="flex flex-row items-center mb-1">
                                <AirbnbRating
                                    count={5}
                                    defaultRating={stars}
                                    size={10}
                                    showRating={false}
                                    isDisabled
                                    starContainerStyle={{ marginRight: 2 }}
                                />
                                <View className="w-40 h-2 bg-gray-200 ml-2">
                                    <View
                                        className="bg-red-500 h-full"
                                        style={{ width: `${(count / totalRatings) * 100}%` }} // Tính toán phần trăm dựa trên tổng số đánh giá
                                    />
                                </View>
                                <Text className="ml-2 text-gray-700">{count}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <Text className="text-gray-500 mt-2">{totalRatings} ratings</Text>
            </View>

            {/* Reviews Section */}
            <Text className="text-xl font-semibold mb-3">{itemDetails.reviews} reviews</Text>
            <ScrollView>
                {reviews.map((review) => (
                    <View key={review.id} className="flex flex-row items-start mb-6">
                        <Image source={{ uri: review.avatar }} className="w-12 h-12 rounded-full" />
                        <View className="ml-4 flex-1">
                            <View className="flex flex-row justify-between">
                                <Text className="font-bold">{review.user}</Text>
                                <Text className="text-gray-400">{review.date}</Text>
                            </View>
                            <View className="flex flex-row items-center mb-2">
                                <AirbnbRating count={5} defaultRating={review.rating} size={15} showRating={false} isDisabled />
                            </View>
                            <Text className="text-gray-700">{review.review}</Text>
                            <View className="flex flex-row items-center mt-2">
                                <Text className="text-gray-500">Helpful</Text>
                                <TouchableOpacity className="ml-2">
                                    <Text className="text-gray-500">{review.helpful ? '👍' : '👎'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Write Review Button */}
            <TouchableOpacity
                className="bg-red-500 py-3 px-5 rounded-full flex flex-row justify-center items-center absolute bottom-8 right-8 shadow-lg"
            >
                <Icon name="pencil" size={16} color="white" style={{ marginRight: 8 }} />
                <Text className="text-white text-center text-sm">Write a review</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
};

export default RatingsReviewsScreen;