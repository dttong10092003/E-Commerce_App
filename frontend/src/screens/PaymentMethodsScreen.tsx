import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import icons from '../constants/icons';

const PaymentMethodsScreen = ({ navigation }) => {
  const [cards, setCards] = useState([
    {
      id: '1',
      cardType: 'mastercard',
      cardNumber: '3947',
      cardHolder: 'Jennyfer Doe',
      expiryDate: '05/23',
      cvv: '123',
      logo: icons.mastercard2,
      isDefault: true,
    },
    {
      id: '2',
      cardType: 'visa',
      cardNumber: '4546',
      cardHolder: 'Thanh Tong',
      expiryDate: '11/22',
      cvv: '456',
      logo: icons.visa,
      isDefault: false,
    },
  ]);

  // Hàm để đặt thẻ mặc định
  const setDefaultCard = (cardId) => {
    const updatedCards = cards.map(card => ({
      ...card,
      isDefault: card.id === cardId, // Chỉ thẻ được chọn mới đặt là mặc định
    }));
    setCards(updatedCards);
  };

  // Hàm render các tùy chọn thẻ thanh toán
  const renderCardOption = (card) => (
    <TouchableOpacity
      key={card.id}
      onPress={() => navigation.navigate('EditCard', { card })}
      className="mb-6"
    >
      <View
        style={{
          backgroundColor: card.cardType === 'mastercard' ? '#1c1c1e' : '#f5f5f5',
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
        {/* Background Circles */}
        <View style={{
          position: 'absolute',
          width: 200,
          height: 200,
          backgroundColor: '#333333',
          borderRadius: 100,
          top: -70,
          left: -70,
          opacity: 0.5,
        }} />
        <View style={{
          position: 'absolute',
          width: 200,
          height: 200,
          backgroundColor: '#333333',
          borderRadius: 100,
          bottom: -70,
          right: -70,
          opacity: 0.2,
        }} />

        {/* Chip */}
        <Image source={icons.chip} style={{ width: 40, height: 40, marginBottom: 20 }} resizeMode="contain" />

        {/* Card Number */}
        <Text style={{
          color: card.cardType === 'mastercard' ? 'white' : '#333',
          fontSize: 18,
          letterSpacing: 3,
          fontWeight: '500',
          marginBottom: 20
        }}>
          {`**** **** **** ${card.cardNumber}`}
        </Text>

        {/* Card Holder & Expiry Date */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: card.cardType === 'mastercard' ? '#9e9e9e' : '#757575', fontSize: 12 }}>Card Holder Name</Text>
            <Text style={{ color: card.cardType === 'mastercard' ? 'white' : '#333', fontSize: 16, fontWeight: 'bold' }}>{card.cardHolder}</Text>
          </View>
          <View style={{ marginRight: 100 }}>
            <Text style={{ color: card.cardType === 'mastercard' ? '#9e9e9e' : '#757575', fontSize: 12 }}>Expiry Date</Text>
            <Text style={{ color: card.cardType === 'mastercard' ? 'white' : '#333', fontSize: 16, fontWeight: 'bold' }}>{card.expiryDate}</Text>
          </View>
        </View>

        {/* Card Logo */}
        <Image source={card.logo} style={{ width: 60, height: 60, position: 'absolute', bottom: 10, right: 20 }} resizeMode="contain" />
      </View>

      {/* Set as default checkbox */}
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}
        onPress={() => setDefaultCard(card.id)} // Đặt thẻ này làm mặc định
      >
        <View style={{
          width: 20,
          height: 20,
          borderRadius: 3,
          borderWidth: 1,
          borderColor: card.isDefault ? 'black' : '#757575',
          backgroundColor: card.isDefault ? 'black' : 'transparent',
          marginRight: 8
        }}>
          {card.isDefault && (
            <Image source={icons.check} style={{ width: 17, height: 20 }} resizeMode="contain" />
          )}
        </View>
        <Text style={{ color: '#333', fontSize: 14 }}>Use as default payment method</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 pt-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Payment Methods</Text>
      </View>

      {/* List of Payment Cards */}
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <Text className="text-lg font-semibold mb-4">Your Payment Cards</Text>

        {/* Render cards from array */}
        {cards.map((card) => renderCardOption(card))}

        {/* Add New Card Button */}
        <View className="flex-row justify-center mt-6">
          <TouchableOpacity onPress={() => navigation.navigate('AddNewCard')} className="bg-blue-500 py-3 px-4 rounded-full flex-row items-center">
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text className="text-white font-medium ml-2">Add New Card</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentMethodsScreen;
