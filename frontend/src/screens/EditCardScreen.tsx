import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

const EditCardScreen = ({ route, navigation }) => {
  const { card } = route.params;
  
  const [cardNumber, setCardNumber] = useState(card.cardNumber);
  const [cardHolder, setCardHolder] = useState(card.cardHolder);
  const [expiryDate, setExpiryDate] = useState(card.expiryDate);
  const [cvv, setCvv] = useState(card.cvv);
  const [cardType, setCardType] = useState(card.cardType);

  const updateCard = () => {
    const updatedCard = { ...card, cardNumber, cardHolder, expiryDate, cvv, cardType };
    navigation.navigate('PaymentMethods', { updatedCard });
  };

  const deleteCard = () => {
    Alert.alert(
      "Delete Card",
      "Are you sure you want to delete this card?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => navigation.navigate('PaymentMethods', { deletedCardId: card.id }),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Edit Card</Text>
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
        <TouchableOpacity onPress={updateCard} className="bg-blue-500 py-3 rounded-full flex-row items-center justify-center mt-4">
          <Text className="text-white font-medium">Update Card</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteCard} className="bg-red-500 py-3 rounded-full flex-row items-center justify-center mt-4">
          <Text className="text-white font-medium">Delete Card</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditCardScreen;
