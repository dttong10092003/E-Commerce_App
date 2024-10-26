// src/screens/MyOrdersScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const orders = [
  {
    id: '1947034',
    date: '05-12-2019',
    trackingNumber: 'IW3475453455',
    quantity: 3,
    totalAmount: '112$',
    status: 'Delivered',
  },
  {
    id: '1947035',
    date: '05-02-2022',
    trackingNumber: 'IW3475425255',
    quantity: 5,
    totalAmount: '2232$',
    status: 'Delivered',
  },
  {
    id: '1947035',
    date: '05-02-2022',
    trackingNumber: 'IW3475425255',
    quantity: 5,
    totalAmount: '2232$',
    status: 'Cancelled',
  },
  {
    id: '1947035',
    date: '05-02-2022',
    trackingNumber: 'IW3475425255',
    quantity: 5,
    totalAmount: '2232$',
    status: 'Processing',
  },
];

const OrderCard = ({ order, onPress }) => (
    <View className="bg-white p-4 rounded-lg my-2 mx-4 shadow-md">
      <View className="flex-row justify-between">
        <Text className="text-lg font-semibold">Order №{order.id}</Text>
        <Text className="text-gray-400">{order.date}</Text>
      </View>
      <Text className="text-gray-600 mt-2">Tracking number: {order.trackingNumber}</Text>
      <View className="flex-row justify-between mt-2">
        <Text className="text-gray-600">
          Quantity: <Text className="text-black font-semibold">{order.quantity}</Text>
        </Text>
        <Text className="text-gray-600">
          Total Amount: <Text className="text-black font-semibold">{order.totalAmount}</Text>
        </Text>
      </View>
      <View className="flex-row justify-between items-center mt-4">
        <TouchableOpacity onPress={onPress} className="border border-gray-300 px-4 py-1 rounded-full">
          <Text className="text-black font-medium">Details</Text>
        </TouchableOpacity>
      <Text className={`font-semibold ${order.status === 'Delivered' ? 'text-green-500' : order.status === 'Processing' ? 'text-orange-500' : 'text-red-500'}`}>
        {order.status}
      </Text>
    </View>
  </View>
);

const MyOrdersScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Delivered');

  // Lọc đơn hàng theo trạng thái
  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 pt-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">My Orders</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-around py-2 bg-white">
        {['Delivered', 'Processing', 'Cancelled'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text className={`text-lg font-medium ${activeTab === tab ? 'text-black' : 'text-gray-400'}`}>
              {tab}
            </Text>
            {activeTab === tab && <View className="h-1 bg-black mt-1 rounded-full w-full" />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Order List using FlatList */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <OrderCard
            order={item}
            onPress={() => navigation.navigate('OrderDetail', { order: item })}
            />
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
        className="flex-1 mt-2"
        ListEmptyComponent={() => (
            <View className="items-center mt-10">
            <Text className="text-gray-500">No orders found for this status.</Text>
            </View>
        )}
    />
    </SafeAreaView>
  );
};

export default MyOrdersScreen;
