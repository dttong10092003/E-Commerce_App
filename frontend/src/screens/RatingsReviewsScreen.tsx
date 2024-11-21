import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Image, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { AirbnbRating } from 'react-native-ratings';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { RootStackParamList } from '../constants/rootStackParamList';
import { Ratings } from '../constants/types';
import BASE_URL from '../config';
import icons from '../constants/icons';

interface Feedback {
    _id: string;
    user: {
        _id: string;
        username: string;
        avatar: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

type RatingsReviewsScreenRouteProp = RouteProp<RootStackParamList, 'RatingsReviews'>;

const RatingsReviewsScreen: React.FC<{ route: RatingsReviewsScreenRouteProp }> = ({ route }) => {
    const navigation = useNavigation();
    const { itemDetails } = route.params;
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async (productId: string) => {
        try {
            const response = await axios.get<Feedback[]>(`${BASE_URL}/feedback/product/${productId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const fetchedReviews = await fetchReviews(itemDetails._id);
            setReviews(fetchedReviews);
            setLoading(false);
        };
        fetchData();
    }, [itemDetails._id]);

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

    const starData = [
        { stars: 5, count: itemDetails?.ratings?.[5] || 0 },
        { stars: 4, count: itemDetails?.ratings?.[4] || 0 },
        { stars: 3, count: itemDetails?.ratings?.[3] || 0 },
        { stars: 2, count: itemDetails?.ratings?.[2] || 0 },
        { stars: 1, count: itemDetails?.ratings?.[1] || 0 },
    ];

    const totalRatings = Object.values(itemDetails?.ratings || {}).reduce((a, b) => a + b, 0); // Tổng số đánh giá

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

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
                        <Image
                            source={review.user.avatar
                                ? { uri: `data:image/jpeg;base64,${review.user.avatar}` }
                                : icons.profile // Avatar mặc định
                            }
                            className="w-12 h-12 rounded-full"
                        />
                        <View className="ml-4 flex-1">
                            <View className="flex flex-row justify-between">
                                <Text className="font-bold">{review.user.username}</Text>
                                <Text className="text-gray-400">{new Date(review.createdAt).toDateString()}</Text>
                            </View>
                            <View className="flex flex-row items-center mb-2">
                                <AirbnbRating count={5} defaultRating={review.rating} size={15} showRating={false} isDisabled />
                            </View>
                            <Text className="text-gray-700">{review.comment}</Text>
                            <View className="flex flex-row items-center mt-2">
                                {review.rating === 1 && (
                                    <>
                                        <Text className="text-gray-500">Poor</Text>
                                        <TouchableOpacity className="ml-2">
                                            <Text className="text-gray-500">👎</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {review.rating === 2 && (
                                    <>
                                        <Text className="text-gray-500">Fair</Text>
                                        <TouchableOpacity className="ml-2">
                                            <Text className="text-gray-500">🤔</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {review.rating === 3 && (
                                    <>
                                        <Text className="text-gray-500">PoAverage</Text>
                                        <TouchableOpacity className="ml-2">
                                            <Text className="text-gray-500">🙂</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {review.rating === 4 && (
                                    <>
                                        <Text className="text-gray-500">Good</Text>
                                        <TouchableOpacity className="ml-2">
                                            <Text className="text-gray-500">👍</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {review.rating === 5 && (
                                    <>
                                        <Text className="text-gray-500">Excellent</Text>
                                        <TouchableOpacity className="ml-2">
                                            <Text className="text-gray-500">🤩</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

        </SafeAreaView>
    );
};

export default RatingsReviewsScreen;