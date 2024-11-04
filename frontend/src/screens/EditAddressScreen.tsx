import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
const EditAddressScreen = ({ route, navigation }) => {
  const { address } = route.params;
  
  // Tạo các trạng thái để lưu trữ thông tin địa chỉ
  const [recipientName, setRecipientName] = useState(address.name);
  const [phoneNumber, setPhoneNumber] = useState(address.phoneNumber);
  const [street, setStreet] = useState(address.street);
  const [district, setDistrict] = useState(address.district);
  const [city, setCity] = useState(address.city);
  const [country, setCountry] = useState(address.country);
  const [isDefault, setIsDefault] = useState(address.isDefault);

// Hàm cập nhật địa chỉ
const updateAddress = async () => {
  const token = await AsyncStorage.getItem('authToken');
  const updatedAddress = {
    name: recipientName,
    phoneNumber,
    street,
    district,
    city,
    country,
    isDefault
  };

  try {
    await axios.patch(`${BASE_URL}/shipping-addresses/${address._id}`, updatedAddress, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    Alert.alert("Success", "Address updated successfully!");
    navigation.goBack(); // Quay lại màn hình ShippingAddressesScreen
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to update address");
  }
};

// Hàm xóa địa chỉ
const deleteAddress = async () => {
  Alert.alert("Delete Address", "Are you sure you want to delete this address?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        const token = await AsyncStorage.getItem('authToken');
        try {
          await axios.delete(`${BASE_URL}/shipping-addresses/${address._id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          Alert.alert("Deleted", "Address has been deleted.");
          navigation.goBack(); // Quay lại màn hình ShippingAddressesScreen
        } catch (error) {
          console.error(error);
          Alert.alert("Error", "Failed to delete address");
        }
      },
    },
  ]);
};

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Edit Address</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Form chỉnh sửa địa chỉ */}
        <View className="bg-white p-4 mx-4 mt-4 rounded-lg shadow-md">
          <Text className="text-lg font-semibold">Recipient Name</Text>
          <TextInput
            value={recipientName}
            onChangeText={setRecipientName}
            className="bg-gray-100 p-3 rounded-md mt-2"
            placeholder="Enter recipient name"
          />

          <Text className="text-lg font-semibold mt-4">Phone Number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            className="bg-gray-100 p-3 rounded-md mt-2"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />

          {/* Địa chỉ chi tiết */}
          <Text className="text-lg font-semibold mt-4">Street</Text>
          <TextInput
            value={street}
            onChangeText={setStreet}
            className="bg-gray-100 p-3 rounded-md mt-2"
            placeholder="Enter street address"
          />

          <Text className="text-lg font-semibold mt-4">District</Text>
          <TextInput
            value={district}
            onChangeText={setDistrict}
            className="bg-gray-100 p-3 rounded-md mt-2"
            placeholder="Enter district"
          />

          <Text className="text-lg font-semibold mt-4">City</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            className="bg-gray-100 p-3 rounded-md mt-2"
            placeholder="Enter city"
          />

          <Text className="text-lg font-semibold mt-4">Country</Text>
          <TextInput
            value={country}
            onChangeText={setCountry}
            className="bg-gray-100 p-3 rounded-md mt-2"
            placeholder="Enter country"
          />
        </View>

        {/* Toggle Set as Default */}
        <View className="bg-white p-4 mx-4 mt-4 rounded-lg shadow-md flex-row items-center justify-between">
          <Text className="text-lg font-semibold">Set as Default Address</Text>
          <TouchableOpacity onPress={() => setIsDefault(!isDefault)}>
            <Ionicons
              name={isDefault ? "checkbox-outline" : "square-outline"}
              size={24}
              color={isDefault ? "blue" : "gray"}
            />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View className="p-4">
          <TouchableOpacity
            onPress={updateAddress}
            className="bg-blue-500 py-3 rounded-full flex-row items-center justify-center mt-4"
          >
            <Text className="text-white font-medium">Update Address</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={deleteAddress}
            className="bg-red-500 py-3 rounded-full flex-row items-center justify-center mt-4"
          >
            <Text className="text-white font-medium">Delete Address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditAddressScreen;
