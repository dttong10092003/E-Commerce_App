import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

const AddNewCardScreen = ({ navigation }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState('');

  const saveCard = () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv || !cardType) {
      alert("Please fill in all the fields.");
      return;
    }

    const newCard = { id: Date.now().toString(), cardNumber, cardHolder, expiryDate, cvv, cardType, isDefault: false };
    navigation.navigate('PaymentMethods', { newCard });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-4 pt-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Add New Card</Text>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="bg-white p-4 mt-4 rounded-lg shadow-md">
          <Text className="text-lg font-semibold">Card Number</Text>
          <TextInput value={cardNumber} onChangeText={setCardNumber} className="bg-gray-100 p-3 rounded-md mt-2" placeholder="Enter card number" keyboardType="number-pad" />
          <Text className="text-lg font-semibold mt-4">Card Holder Name</Text>
          <TextInput value={cardHolder} onChangeText={setCardHolder} className="bg-gray-100 p-3 rounded-md mt-2" placeholder="Enter card holder name" />
          <Text className="text-lg font-semibold mt-4">Expiry Date</Text>
          <TextInput value={expiryDate} onChangeText={setExpiryDate} className="bg-gray-100 p-3 rounded-md mt-2" placeholder="MM/YY" keyboardType="number-pad" />
          <Text className="text-lg font-semibold mt-4">CVV</Text>
          <TextInput value={cvv} onChangeText={setCvv} className="bg-gray-100 p-3 rounded-md mt-2" placeholder="Enter CVV" secureTextEntry keyboardType="number-pad" />
          <Text className="text-lg font-semibold mt-4">Card Type</Text>
          <Picker selectedValue={cardType} onValueChange={setCardType} className="bg-gray-100 mt-2 rounded-md">
            <Picker.Item label="Select card type" value="" />
            <Picker.Item label="Mastercard" value="mastercard" />
            <Picker.Item label="Visa" value="visa" />
          </Picker>
        </View>
        <TouchableOpacity onPress={saveCard} className="bg-blue-500 py-3 rounded-full flex-row items-center justify-center mt-4">
          <Text className="text-white font-medium">Save Card</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddNewCardScreen;
