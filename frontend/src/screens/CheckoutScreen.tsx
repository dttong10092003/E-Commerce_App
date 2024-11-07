// CheckoutScreen.js
import React from 'react';
import {TextInput, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../constants/icons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const formatAddress = (address) => {
    const { street, district, city, country } = address;
    return `${street}, ${district}, ${city}, ${country}`;
};

const CheckoutScreen = ({ navigation }) => {

    const address = {
        name: 'Jane Doe',
        phoneNumber: '+1 234 567 890',
        street: '3 Newbridge Court',
        district: 'Chino Hills',
        city: 'CA 91709',
        country: 'United States'
    };

    const card = {
        cardType: 'mastercard',
        cardNumber: '123456789012', // 12 chữ số mẫu
        cardHolder: 'Jennyfer Doe',
        expiryDate: '05/23',
        cvv: '122223',
        logo: icons.mastercard2,
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 flex-1">
                {/* Header */}
                <View className="flex-row items-center mb-2">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
                    <Text className="text-2xl font-bold ml-2">Checkout</Text>
                </View>


                {/* Content Scrollable Area */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}>
                    {/* Shipping Address Section */}
                    <Text className="text-lg font-semibold mb-3">Shipping address</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ShippingAddresses')}
                        className="bg-white p-4 rounded-lg mb-6 shadow-sm flex-row justify-between items-center border border-gray-200"
                    >
                        <View className="flex-1">
                            <View className="flex-row items-center">
                                <Text className="text-lg font-semibold">{address.name}</Text>
                                <Ionicons name="call-outline" size={16} color="gray" style={{ marginHorizontal: 6 }} />
                                <Text className="text-lg">{address.phoneNumber}</Text>
                            </View>
                            <Text className="text-gray-600 mt-1">{formatAddress(address)}</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('EditAddress', { address })}>
                            <Text className="text-red-500 font-medium">Change</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                    {/* Payment Section */}
                    <Text className="text-lg font-semibold mb-3">Payment</Text>
                    <View className="flex-row items-center justify-between bg-white p-4 rounded-lg mb-6 shadow-sm border border-gray-200">
                        <View className="flex-row items-center space-x-4">
                            <Image source={icons.mastercard} className="w-10 h-10" resizeMode="contain" />
                            <Text className="text-gray-600">**** **** **** {card.cardNumber.slice(-4)}</Text>
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
                            <Text className="text-gray-600">1-2 days</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-white rounded-lg p-3 shadow-sm items-center mx-1 border border-gray-200">
                            <Image source={icons.usps} className="w-20 h-8 mb-2" resizeMode="contain" />
                            <Text className="text-gray-600">2-3 days</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-white rounded-lg p-3 shadow-sm items-center mx-1 border border-gray-200">
                            <Image source={icons.dhl} className="w-20 h-8 mb-2" resizeMode="contain" />
                            <Text className="text-gray-600">5-7 days</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Promo Code Section */}
                    <View className="flex-row bg-white rounded-lg p-3 mb-2 items-center shadow-md">
                    <TextInput placeholder="Enter your promo code" className="flex-1 text-base" />
                    <TouchableOpacity className="bg-black rounded-full p-2 ml-2">
                        <Image source={icons.next1} style={{ width: 16, height: 16 }} />
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
