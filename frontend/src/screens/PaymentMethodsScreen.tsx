// PaymentMethodsScreen.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../constants/icons';

const PaymentMethodsScreen = ({ navigation }) => {
    const [selectedMethod, setSelectedMethod] = useState('mastercard');

    const renderCardOption = (cardType, cardNumber, cardHolder, expiryDate, logo) => (
        <View style={{ marginBottom: 20 }}>
            {/* Thẻ thanh toán */}
            <View
                style={{
                    backgroundColor: cardType === 'mastercard' ? '#1c1c1e' : '#f5f5f5',
                    borderRadius: 12,
                    padding: 20,
                    position: 'relative',
                    overflow: 'hidden',
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    elevation: 5,
                }}
            >
                {/* Gradient và hình tròn nền */}
                <View
                    style={{
                        position: 'absolute',
                        width: 200,
                        height: 200,
                        backgroundColor: '#333333',
                        borderRadius: 100,
                        top: -70,
                        left: -70,
                        opacity: 0.5,
                    }}
                />
                <View
                    style={{
                        position: 'absolute',
                        width: 200,
                        height: 200,
                        backgroundColor: '#333333',
                        borderRadius: 100,
                        bottom: -70,
                        right: -70,
                        opacity: 0.2,
                    }}
                />

                {/* Chip */}
                <Image source={icons.chip} style={{ width: 40, height: 40, marginBottom: 20 }} resizeMode="contain" />

                {/* Số thẻ */}
                <Text style={{ color: cardType === 'mastercard' ? 'white' : '#333', fontSize: 18, letterSpacing: 3, fontWeight: '500', marginBottom: 20 }}>
                    {`**** **** **** ${cardNumber}`}
                </Text>

                {/* Tên chủ thẻ và ngày hết hạn */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ color: cardType === 'mastercard' ? '#9e9e9e' : '#757575', fontSize: 12 }}>Card Holder Name</Text>
                        <Text style={{ color: cardType === 'mastercard' ? 'white' : '#333', fontSize: 16, fontWeight: 'bold' }}>{cardHolder}</Text>
                    </View>
                    <View style={{ marginRight: 100 }}>
                        <Text style={{ color: cardType === 'mastercard' ? '#9e9e9e' : '#757575', fontSize: 12 }}>Expiry Date</Text>
                        <Text style={{ color: cardType === 'mastercard' ? 'white' : '#333', fontSize: 16, fontWeight: 'bold' }}>{expiryDate}</Text>
                    </View>
                </View>

                {/* Logo thẻ */}
                <Image source={logo} style={{ width: 60, height: 60, position: 'absolute', bottom: 10, right: 20 }} resizeMode="contain" />
            </View>

            {/* Checkbox bên dưới thẻ */}
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}
                onPress={() => setSelectedMethod(cardType)}
            >
                <View style={{ width: 20, height: 20, borderRadius: 3, borderWidth: 1, borderColor: cardType === selectedMethod ? 'black' : '#757575', backgroundColor: cardType === selectedMethod ? 'black' : 'transparent', marginRight: 8 }}>
                    {cardType === selectedMethod && (
                        <Image source={icons.check} style={{ width: 17, height: 20 }} resizeMode="contain" />
                    )}
                </View>
                <Text style={{ color: '#333', fontSize: 14 }}>Use as default payment method</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 pt-4 flex-1">
                {/* Header */}
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={icons.back} className="w-6 h-6 mr-3" resizeMode="contain" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold">Payment methods</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                    <Text className="text-lg font-semibold mb-4">Your payment cards</Text>

                    {/* Mastercard */}
                    {renderCardOption('mastercard', '3947', 'Jennyfer Doe', '05/23', icons.mastercard2)}

                    {/* Visa */}
                    {renderCardOption('visa', '4546', 'Jennyfer Doe', '11/22', icons.visa)}

                    {/* Add New Card Button */}
                    <TouchableOpacity style={{ alignItems: 'center', marginTop: 16 }}>
                        <View style={{
                            width: 56,
                            height: 56,
                            backgroundColor: 'black',
                            borderRadius: 28,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{ color: 'white', fontSize: 24 }}>+</Text>
                        </View>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default PaymentMethodsScreen;
