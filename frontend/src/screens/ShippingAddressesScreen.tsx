import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ShippingAddress = {
  _id: string;
  name: string;
  phoneNumber: string;
  street: string;
  district: string;
  city: string;
  country: string;
  isDefault: boolean;
};

const ShippingAddressesScreen = ({ navigation }) => {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);

  useEffect(() => {
    fetchShippingAddresses();
  }, []);

  const fetchShippingAddresses = async () => {
    const token = await AsyncStorage.getItem('authToken');
    try {
      const response = await axios.get<ShippingAddress[]>(`${BASE_URL}/shipping-addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(response.data); 
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch shipping addresses');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchShippingAddresses();
    });

    return unsubscribe;
  }, [navigation]);

  const addNewAddress = () => {
    navigation.navigate('AddNewAddress');
  };

  const deleteAddress = async (addressId) => {
    Alert.alert("Delete Address", "Are you sure you want to delete this address?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const token = await AsyncStorage.getItem('authToken');
          try {
            await axios.delete(`${BASE_URL}/shipping-addresses/${addressId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            Alert.alert("Success", "Address deleted successfully");
            fetchShippingAddresses(); 
          } catch (error) {
            Alert.alert("Error", "Failed to delete shipping address");
          }
        },
      },
    ]);
  };

  const editAddress = (address) => {
    navigation.navigate('EditAddress', { address });
  };

  // Hàm đặt địa chỉ làm mặc định
  const setDefaultAddress = async (addressId) => {
    const token = await AsyncStorage.getItem('authToken');
    try {
      await axios.patch(
        `${BASE_URL}/shipping-addresses/${addressId}/set-default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchShippingAddresses(); // Cập nhật danh sách địa chỉ sau khi thay đổi
    } catch (error) {
      console.error("Failed to set default address:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "Failed to set default address");
    }
  };
  

  const AddressItem = ({ address }) => (
    <TouchableOpacity
      onPress={() => editAddress(address)} 
      className="bg-white p-4 rounded-lg my-2 mx-4 shadow-sm flex-row justify-between items-center"
    >
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="text-lg font-semibold">{address.name}</Text>
          <Ionicons name="call-outline" size={16} color="gray" style={{ marginHorizontal: 6 }} />
          <Text className="text-lg">{address.phoneNumber}</Text>
        </View>
        <Text className="text-gray-600 mt-1">{`${address.street}, ${address.district}, ${address.city}, ${address.country}`}</Text>
        {address.isDefault && <Text className="text-green-500 font-medium mt-2">Default</Text>}
      </View>

      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => setDefaultAddress(address._id)}>
          <Ionicons
            name={address.isDefault ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={address.isDefault ? "green" : "gray"}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteAddress(address._id)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Shipping Addresses</Text>
      </View>

      <FlatList
        data={addresses}
        renderItem={({ item }) => <AddressItem address={item} />}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={() => (
          <View className="items-center mt-10">
            <Text className="text-gray-500">No addresses found.</Text>
          </View>
        )}
      />

      <View className="p-4">
        <TouchableOpacity
          onPress={addNewAddress}
          className="bg-blue-500 py-3 rounded-full flex-row items-center justify-center"
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text className="text-white font-medium ml-2">Add New Address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ShippingAddressesScreen;
