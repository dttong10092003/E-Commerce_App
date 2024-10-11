import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AirbnbRating } from 'react-native-ratings';
import { SafeAreaView } from 'react-native-safe-area-context';
// Import icon (sử dụng react-native-vector-icons hoặc thay bằng ảnh cây viết)
import Icon from 'react-native-vector-icons/FontAwesome';

const RatingsReviewsScreen: React.FC = () => {
    const navigation = useNavigation();

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
        { stars: 5, count: 12 },
        { stars: 4, count: 5 },
        { stars: 3, count: 4 },
        { stars: 2, count: 2 },
        { stars: 1, count: 0 },
    ];

    const totalRatings = 23; // Tổng số đánh giá

    return (
        <SafeAreaView className="flex-1 bg-white px-4 py-6">
            {/* Header */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text className="text-lg font-semibold">{"<"}</Text>
            </TouchableOpacity>

            {/* Ratings Summary */}
            <View className="my-4">
                <Text className="text-3xl font-bold">Ratings & Reviews</Text>
                <View className="flex flex-row items-center mt-3">
                    <Text className="text-5xl font-bold">4.3</Text>
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
            <Text className="text-xl font-semibold mb-3">8 reviews</Text>
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