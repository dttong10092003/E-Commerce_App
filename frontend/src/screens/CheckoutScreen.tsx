import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, Image, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../constants/icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
const formatAddress = (address) => {
    const { street, district, city, country } = address;
    return `${street}, ${district}, ${city}, ${country}`;
};

const CheckoutScreen = ({ navigation }) => {
    const [promoModalVisible, setPromoModalVisible] = useState(false);
    const [availableVouchers, setAvailableVouchers] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        fetchAvailableVouchers();
    }, []);
    const fetchAvailableVouchers = async () => {
        const token = await AsyncStorage.getItem('authToken');
        try {
            const response = await axios.get(`${BASE_URL}/user-rewards`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { availableVouchers } = response.data as any || {};
            const updatedAvailableVouchers = (availableVouchers || []).map(voucher => ({
                ...voucher,
                icon: voucher.type === 'deliver' ? icons.deliver : icons.coupon,
                name: voucher.name || (voucher.type === 'deliver' ? 'Delivery Voucher' : 'Discount Voucher')
            })).sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());

            setAvailableVouchers(updatedAvailableVouchers);
        } catch (error) {
            console.error('Error fetching available vouchers:', error);
            Alert.alert('Error', 'Failed to fetch available vouchers');
        }
    };
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
        cardNumber: '123456789012',
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
                        <TouchableOpacity
                            className="bg-black rounded-full p-2 ml-2"
                            onPress={() => setPromoModalVisible(true)}
                        >
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

                {/* Promo Code Modal */}
                <Modal
                    visible={promoModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setPromoModalVisible(false)}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Làm mờ nền
                        }}
                    >
                        <View className="bg-white rounded-t-2xl p-5 w-full shadow-xl max-h-[80%]">
                            {/* Nút đóng modal */}
                            <TouchableOpacity
                                onPress={() => setPromoModalVisible(false)}
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 15,
                                    zIndex: 1,
                                }}
                            >
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>✕</Text>
                            </TouchableOpacity>

                            <Text className="text-2xl font-bold mb-5 text-center">Your Promo Codes</Text>

                            {/* Hiển thị 7 voucher đầu tiên nếu không nhấn View More */}
                            {(showAll ? availableVouchers : availableVouchers.slice(0, 7)).map((voucher, index) => (
                                <View
                                    key={index}
                                    className="flex-row justify-between items-center p-4 bg-gray-100 rounded-xl mb-3"
                                >
                                    <View className="w-12 h-12 flex items-center justify-center">
                                        <Image
                                            source={voucher.type === 'deliver' ? icons.deliver : icons.coupon}
                                            style={{ width: 48, height: 48 }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <View className="flex-1 ml-4">
                                        <Text className="text-base font-semibold">{voucher.name}</Text>
                                        <Text className="text-sm text-gray-500">{voucher.code}</Text>
                                        <Text className="text-sm text-gray-500">{voucher.daysRemaining} days remaining</Text>
                                    </View>
                                    <TouchableOpacity className="bg-red-500 rounded-lg px-4 py-2">
                                        <Text className="text-white font-semibold">Apply</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {/* Nút "View More" */}
                            {!showAll && availableVouchers.length > 7 && (
                                <TouchableOpacity
                                    onPress={() => setShowAll(true)}
                                    className="bg-blue-500 rounded-lg px-4 py-2 mt-3"
                                >
                                    <Text className="text-white font-semibold text-center">View More</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </Modal>




            </View>
        </SafeAreaView>
    );
};

export default CheckoutScreen;
