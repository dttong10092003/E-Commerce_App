import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const initialAddresses = [
  {
    id: '1',
    name: 'John Doe',
    phoneNumber: '+1 234 567 890',
    street: '3 Newbridge Court',
    district: 'Chino Hills',
    city: 'CA 91709',
    country: 'United States',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    phoneNumber: '+1 987 654 321',
    street: '1200 West 7th Street',
    district: 'Los Angeles',
    city: 'CA 90017',
    country: 'United States',
    isDefault: false,
  },
  {
    id: '3',
    name: 'Michael Johnson',
    phoneNumber: '+1 555 123 456',
    street: '15 Oak Lane',
    district: 'Irvine',
    city: 'CA 92620',
    country: 'United States',
    isDefault: false,
  },
];

const ShippingAddressesScreen = ({ navigation }) => {
  const [addresses, setAddresses] = useState(initialAddresses);

  const addNewAddress = () => {
    navigation.navigate('AddNewAddress');
  };

  // Hàm tạo chuỗi địa chỉ từ các phần nhỏ
  const formatAddress = (address) => {
    const { street, district, city, country } = address;
    return `${street}, ${district}, ${city}, ${country}`;
  };

  // Component hiển thị từng địa chỉ
  const AddressItem = ({ address }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('EditAddress', { address })}
      className="bg-white p-4 rounded-lg my-2 mx-4 shadow-sm flex-row justify-between items-center"
    >
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="text-lg font-semibold">{address.name}</Text>
          <Ionicons name="call-outline" size={16} color="gray" style={{ marginHorizontal: 6 }} />
          <Text className="text-lg">{address.phoneNumber}</Text>
        </View>
        <Text className="text-gray-600 mt-1">{formatAddress(address)}</Text>
        {address.isDefault && <Text className="text-green-500 font-medium mt-2">Default</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Shipping Addresses</Text>
      </View>

      {/* Danh sách địa chỉ */}
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AddressItem address={item} />}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={() => (
          <View className="items-center mt-10">
            <Text className="text-gray-500">No addresses found.</Text>
          </View>
        )}
      />

      {/* Nút thêm địa chỉ mới */}
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
