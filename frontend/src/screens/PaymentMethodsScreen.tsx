import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import icons from '../constants/icons';
import BASE_URL from '../config';
import { useIsFocused } from '@react-navigation/native';

type PaymentCard = {
  _id: string;
  cardType: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  isDefault: boolean;
};

const PaymentMethodsScreen = ({ navigation }) => {
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused(); // Dùng hook isFocused để kiểm tra khi trang được focus

  // Hàm lấy danh sách thẻ thanh toán từ backend
  const fetchPaymentMethods = async () => {
    const token = await AsyncStorage.getItem('authToken');
    try {
      const response = await axios.get<PaymentCard[]>(`${BASE_URL}/payment-methods`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCards(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch payment methods');
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchPaymentMethods();
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPaymentMethods();
    setRefreshing(false);
  };

  // Đặt thẻ mặc định và cập nhật MongoDB
  const setDefaultCard = async (cardId: string) => {
    const token = await AsyncStorage.getItem('authToken');
    try {
      await axios.patch(
        `${BASE_URL}/payment-methods/${cardId}/set-default`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedCards = cards.map((card) => ({
        ...card,
        isDefault: card._id === cardId,
      }));
      setCards(updatedCards);
    } catch (error) {
      Alert.alert('Error', 'Failed to set default card');
    }
  };
  const formatExpiryDate = (expiryDate) => {
    // Tách tháng và năm từ chuỗi expiryDate nếu có độ dài 4 hoặc hơn
    if (expiryDate && expiryDate.length >= 4) {
      return `${expiryDate.slice(0, 2)}/${expiryDate.slice(2, 4)}`;
    }
    return expiryDate; // Trả lại nguyên giá trị nếu không phù hợp
  };
  const renderCardOption = (card) => {
    const maskedCardNumber = `**** **** **** ${card.cardNumber.slice(-4)}`;
    const cardLogo = card.cardType === 'mastercard' ? icons.mastercard : icons.visa;
    const cardBackgroundColor = card.cardType === 'mastercard' ? '#000000' : '#f5f5f5';

    return (
      <TouchableOpacity
        key={card._id}
        onPress={() => navigation.navigate('EditCard', { card })}
        className="mb-6"
      >
        <View
          style={{
            backgroundColor: cardBackgroundColor,
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

          <Image source={icons.chip} style={{ width: 40, height: 40, marginBottom: 20 }} resizeMode="contain" />

          <Text style={{
            color: card.cardType === 'mastercard' ? 'white' : '#333',
            fontSize: 18,
            letterSpacing: 3,
            fontWeight: '500',
            marginBottom: 20
          }}>
            {maskedCardNumber}
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: card.cardType === 'mastercard' ? '#9e9e9e' : '#757575', fontSize: 12 }}>Card Holder Name</Text>
              <Text style={{ color: card.cardType === 'mastercard' ? 'white' : '#333', fontSize: 16, fontWeight: 'bold' }}>{card.cardHolder}</Text>
            </View>
            <View style={{ marginRight: 100 }}>
              <Text style={{ color: card.cardType === 'mastercard' ? '#9e9e9e' : '#757575', fontSize: 12 }}>Expiry Date</Text>
              <Text style={{ color: card.cardType === 'mastercard' ? 'white' : '#333', fontSize: 16, fontWeight: 'bold' }}>{formatExpiryDate(card.expiryDate)}</Text>
            </View>
          </View>

          <Image source={cardLogo} style={{ width: 60, height: 60, position: 'absolute', bottom: 10, right: 20 }} resizeMode="contain" />
        </View>

        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}
          onPress={() => setDefaultCard(card._id)}
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
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Payment Methods</Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text className="text-lg font-semibold mb-4">Your Payment Cards</Text>

        {cards.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: '#757575', fontSize: 16 }}>No payment methods found</Text>
          </View>
        ) : (
          cards.map((card) => renderCardOption(card))
        )}

        {/* Add New Card Button */}
        <View className="absolute bottom-5 left-5 right-5">
          <TouchableOpacity
            onPress={() => navigation.navigate('AddNewCard')}
            className="bg-blue-500 py-3 px-4 rounded-full flex-row items-center justify-center"
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text className="text-white font-medium ml-2">Add New Card</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

export default PaymentMethodsScreen;
