// CheckoutScreen.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../constants/icons';

const CheckoutScreen = ({ navigation }) => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 pt-4 flex-1">
                {/* Header */}
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={icons.back} className="w-6 h-6 mr-2" resizeMode="contain" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold">Checkout</Text>
                </View>


                {/* Content Scrollable Area */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}>
                    {/* Shipping Address Section */}
                    <Text className="text-lg font-semibold mb-3">Shipping address</Text>
                    <View className="bg-white p-4 rounded-lg mb-6 shadow-sm border border-gray-200">
                        <View className="flex-row justify-between">
                            <View>
                                <Text className="font-semibold text-base">Jane Doe</Text>
                                <Text className="text-gray-600">3 Newbridge Court</Text>
                                <Text className="text-gray-600">Chino Hills, CA 91709, United States</Text>
                            </View>
                            <TouchableOpacity>
                                <Text className="text-red-500 font-medium">Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Payment Section */}
                    <Text className="text-lg font-semibold mb-3">Payment</Text>
                    <View className="flex-row items-center justify-between bg-white p-4 rounded-lg mb-6 shadow-sm border border-gray-200">
                        <View className="flex-row items-center space-x-4">
                            <Image source={icons.mastercard} className="w-10 h-10" resizeMode="contain" />
                            <Text className="text-gray-600">**** **** **** 3947</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('PaymentMethods')}>
                            <Text className="text-red-500 font-medium">Change</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Delivery Method Section */}
                    <Text className="text-lg font-semibold mb-3">Delivery method</Text>
                    <View className="flex-row justify-between mb-6">
                        <TouchableOpacity className="flex-1 bg-white rounded-lg p-3 shadow-sm items-center mx-1 border border-gray-200">
                            <Image source={icons.fedex} className="w-20 h-8 mb-2" resizeMode="contain" />
                            <Text className="text-gray-600">2-3 days</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-white rounded-lg p-3 shadow-sm items-center mx-1 border border-gray-200">
                            <Image source={icons.usps} className="w-20 h-8 mb-2" resizeMode="contain" />
                            <Text className="text-gray-600">2-3 days</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-white rounded-lg p-3 shadow-sm items-center mx-1 border border-gray-200">
                            <Image source={icons.dhl} className="w-20 h-8 mb-2" resizeMode="contain" />
                            <Text className="text-gray-600">2-3 days</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Order Summary Section and Submit Button */}
                <View className="px-4 pb-4">
                    <View className="mt-4 mb-6">
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-base text-gray-600">Order:</Text>
                            <Text className="text-base font-semibold">$112</Text>
                        </View>
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-base text-gray-600">Delivery:</Text>
                            <Text className="text-base font-semibold">$15</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-base text-gray-600">Summary:</Text>
                            <Text className="text-base font-bold text-red-500">$127</Text>
                        </View>
                    </View>

                    {/* Submit Order Button */}
                    <TouchableOpacity className="bg-red-500 rounded-full py-4 items-center shadow-md">
                        <Text className="text-white font-bold text-lg">SUBMIT ORDER</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default CheckoutScreen;
