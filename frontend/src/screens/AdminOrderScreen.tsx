import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import BASE_URL from '../config';

interface ShippingAddress {
    name: string;
    phoneNumber: string;
    street: string;
    district: string;
    city: string;
    country: string;
  }
  
  interface PaymentMethod {
    cardType: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
  }
  
  interface Product {
    product: string; // Assuming this is the Product ID
    quantity: number;
    selectedSize: string;
    selectedColor: string;
    subTotal: number;
  }
  
  type OrderStatus = 'Processing' | 'Shipping' | 'Delivered' | 'Canceled';
  type DeliveryMethod = 'fedex' | 'usps' | 'dhl';
  
  interface Order {
    _id: string;
    user: string; // User ID reference
    products: Product[];
    totalAmount: number;
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
    deliveryMethod: DeliveryMethod;
    shippingCost: number;
    discountAmount: number;
    orderStatus: OrderStatus;
    orderDate: Date;
    canceledDate?: Date | null;
    deliveredDate?: Date | null;
  }

const AdminOrderCard = ({ order, onPress }) => {
  const { _id, user, totalAmount, orderStatus, products } = order;
  const formattedDate = new Date(
    orderStatus === 'Delivered' ? order.deliveredDate :
    orderStatus === 'Canceled' ? order.canceledDate :
    order.orderDate
  ).toLocaleString();

  return (
    <View className="bg-white p-4 rounded-lg my-2 mx-4 shadow-md">
      <Text className="absolute right-2 top-1 text-gray-400">{formattedDate}</Text>
      <Text className="text-lg font-semibold mt-1">Order: {_id}</Text>
      <Text className="text-lg font-semibold mt-1">User: {user}</Text>
      <View className="flex-row justify-between mt-2">
        <Text className="text-gray-600">
          Items: <Text className="text-black font-semibold">{products.length}</Text>
        </Text>
        <Text className="text-gray-600">
          Total Amount: <Text className="text-black font-semibold">${totalAmount.toFixed(2)}</Text>
        </Text>
      </View>
      <View className="flex-row justify-between items-center mt-4">
        <TouchableOpacity onPress={onPress} className="border border-gray-300 px-4 py-1 rounded-full">
          <Text className="text-black font-medium">Details</Text>
        </TouchableOpacity>
        <Text
          className={`font-semibold ${
            orderStatus === 'Delivered'
              ? 'text-green-500'
              : orderStatus === 'Processing'
              ? 'text-orange-500'
              : orderStatus === 'Shipping'
              ? 'text-yellow-500'
              : 'text-red-500'
          }`}
        >
          {orderStatus}
        </Text>
      </View>
    </View>
  );
};

const AdminOrderScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Processing');
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get<Order[]>(`${BASE_URL}/orders`);
      console.log("Fetched orders:", response.data); // Log dữ liệu
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Error", "Failed to fetch orders.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders(); // Fetch lại dữ liệu khi quay lại màn hình
    }, [])
  );

  const filteredOrders = orders
    .filter((order) => order.orderStatus === activeTab)
    .sort((a, b) => {
      const dateA = new Date(
        activeTab === 'Delivered' ? a.deliveredDate :
        activeTab === 'Canceled' ? a.canceledDate :
        a.orderDate
      );
      const dateB = new Date(
        activeTab === 'Delivered' ? b.deliveredDate :
        activeTab === 'Canceled' ? b.canceledDate :
        b.orderDate
      );
      return dateB.getTime() - dateA.getTime(); // Sắp xếp từ mới tới cũ
    });

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Manage Orders</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-around py-2 bg-white">
        {['Processing', 'Shipping', 'Delivered', 'Canceled'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text className={`text-lg font-medium ${activeTab === tab ? 'text-black' : 'text-gray-400'}`}>
              {tab}
            </Text>
            {activeTab === tab && <View className="h-1 bg-black mt-1 rounded-full w-full" />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Order List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <AdminOrderCard
            order={item}
            onPress={() => navigation.navigate('AdminOrderDetail', { order: item })}
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

export default AdminOrderScreen;
