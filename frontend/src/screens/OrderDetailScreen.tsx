import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProductItem = ({ product }) => (
  <View className="flex-row items-center bg-white p-4 rounded-lg my-2 mx-4 shadow-sm">
    <Image source={{ uri: product.image }} className="w-16 h-16 rounded-lg" />
    <View className="ml-4 flex-1">
      <Text className="text-lg font-semibold">{product.productName}</Text>
      <Text className="text-gray-500">Brand: <Text className="font-semibold text-black">{product.brand}</Text></Text>
      <Text className="text-gray-500">
        Color: <Text className="font-semibold text-black">{product.color}  </Text>   
        Size: <Text className="font-semibold text-black">{product.size}</Text>
      </Text>
      <Text className="text-gray-500">Units: <Text className="font-semibold text-black">{product.quantity}</Text></Text>
    </View>
    <Text className="text-lg font-semibold">{product.price}</Text>
  </View>
);

const OrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 pt-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Order Details</Text>
        <Ionicons name="search" size={24} color="black" style={{ marginLeft: 'auto' }} />
      </View>

      <ScrollView className="flex-1">
        {/* Order ID and Status */}
        <View className="bg-white p-4 mx-4 mt-4 rounded-lg shadow-md">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold">Order №{order.id}</Text>
            <Text className="text-gray-400">{order.date}</Text>
          </View>
          <Text className="text-gray-600 mt-2">
            Tracking number: <Text className="font-semibold text-black">{order.trackingNumber}</Text>
          </Text>
          <Text className={`font-semibold mt-2 ${order.status === 'Delivered' ? 'text-green-500' : order.status === 'Processing' ? 'text-orange-500' : 'text-red-500'}`}>
            {order.status}
          </Text>
        </View>

        {/* Product List */}
        <View className="bg-white mt-4 mx-4 p-4 rounded-lg shadow-md">
          <Text className="text-lg font-semibold mb-4">{order.products.length} items</Text>
          <FlatList
            data={order.products}
            keyExtractor={(item) => item.productId}
            renderItem={({ item }) => <ProductItem product={item} />}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          />
        </View>

        {/* Order Information */}
        <View className="bg-white p-4 mx-4 mt-4 rounded-lg shadow-md">
          <Text className="text-lg font-semibold">Order Information</Text>
          <Text className="text-gray-600 mt-2">
            Shipping Address: <Text className="font-semibold text-black">{order.shippingAddress}</Text>
          </Text>
          <Text className="text-gray-600 mt-2">
            Payment Method: <Text className="font-semibold text-black">**** **** **** {order.paymentMethod}</Text>
          </Text>
          <Text className="text-gray-600 mt-2">
            Delivery Method: <Text className="font-semibold text-black">{order.deliveryMethod}</Text>
          </Text>
          <Text className="text-gray-600 mt-2">
            Discount: <Text className="font-semibold text-black">{order.discount}</Text>
          </Text>
          <Text className="text-gray-600 mt-2">
            Total Amount: <Text className="font-semibold text-black">{order.totalAmount}</Text>
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-around p-4 mt-4">
          <TouchableOpacity className="border border-gray-300 px-4 py-2 rounded-full">
            <Text className="text-black font-medium">Reorder</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-red-500 px-4 py-2 rounded-full">
            <Text className="text-white font-medium">Leave feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailScreen;
