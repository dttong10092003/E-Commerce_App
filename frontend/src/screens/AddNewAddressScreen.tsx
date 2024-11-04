import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
const AddNewAddressScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [street, setStreet] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Hàm lưu địa chỉ mới
  const saveAddress = async () => {
    // Kiểm tra nếu có trường nào bị bỏ trống
    if (!name || !phoneNumber || !street || !district || !city || !country) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    // Lấy token từ AsyncStorage
    const token = await AsyncStorage.getItem('authToken');

    // Tạo đối tượng địa chỉ mới
    const newAddress = {
      name,
      phoneNumber,
      street,
      district,
      city,
      country,
      isDefault,
    };

    try {
      // Gửi yêu cầu POST đến API để lưu địa chỉ
      await axios.post(`${BASE_URL}/shipping-addresses`, newAddress, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      Alert.alert("Success", "Address added successfully");
      
      // Điều hướng trở lại màn hình ShippingAddressesScreen và tự động làm mới dữ liệu
      navigation.navigate('ShippingAddresses');
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save address");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Add New Address</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Form thêm địa chỉ mới */}
        <View className="bg-white p-4 mx-4 mt-4 rounded-lg shadow-md">
          <Text className="text-lg font-semibold">Recipient Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
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

        {/* Nút lưu địa chỉ */}
        <View className="p-4">
          <TouchableOpacity
            onPress={saveAddress}
            className="bg-blue-500 py-3 rounded-full flex-row items-center justify-center mt-4"
          >
            <Text className="text-white font-medium">Save Address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddNewAddressScreen;
