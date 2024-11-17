import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import BASE_URL from '../config';

const AdminOrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;

  const handleUpdateStatus = async (status: string) => {
    try {
      if (status === 'Canceled') {
        await restoreStock(); // Restock trước khi cập nhật trạng thái
      }
      await axios.patch(`${BASE_URL}/orders/${order._id}/status`, { orderStatus: status });
      Alert.alert('Success', `Order status updated to ${status}.`);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status.');
    }
  };

  const restoreStock = async () => {
    const stockUpdatePromises = order.products.map(async (item) => {
      try {
        await axios.patch(`${BASE_URL}/products/${item.product._id}/update-stock`, {
          color: item.selectedColor,
          size: item.selectedSize,
          quantity: item.quantity,
          action: 'add', // Restock sản phẩm
        });
      } catch (error) {
        console.error('Error restoring stock for canceled order:', error);
      }
    });

    await Promise.all(stockUpdatePromises);
  };

  const handleConfirmUpdateStatus = (status: string, actionText: string) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${actionText} this order?`,
      [
        { text: 'No' },
        {
          text: 'Yes',
          onPress: () => handleUpdateStatus(status),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Order Details</Text>
      </View>

      <ScrollView className="flex-1 bg-white mx-4 my-4 p-4 rounded-lg shadow-md">
        <Text className="text-lg font-semibold">Order ID: {order._id}</Text>
        <Text className="text-lg font-semibold">User ID: {order.user}</Text>
        <View className="flex-row items-center">
            <Text className='text-lg'>{order.shippingAddress.name}</Text>
            <Ionicons name="call-outline" size={16} color="gray" style={{ marginHorizontal: 6 }} />
            <Text className='text-lg'>{order.shippingAddress.phoneNumber}</Text>
        </View>
        <Text className="text-gray-400 mt-2">Date: {new Date(order.orderDate).toLocaleString()}</Text>
        <Text className={`font-semibold mt-2 ${order.orderStatus === 'Delivered' ? 'text-green-500' : 'text-orange-500'}`}>
          Status: {order.orderStatus}
        </Text>

        <Text className="text-lg font-semibold mt-4">Products</Text>
        {order.products.map((item, index) => (
          <View key={index} className="flex-row justify-between mt-2">
            <Text className='flex-1'>{item.product.name} {`(${item.selectedSize}, ${item.selectedColor})`}</Text>
            <Text>{(item.subTotal/item.quantity).toFixed(2)} x {item.quantity}</Text>
          </View>
        ))}

        <View className="mt-4 flex-row justify-between items-center">
        <Text className="font-semibold">Subtotal: </Text>
        <Text>
            ${order.products.reduce((acc, item) => acc + item.subTotal, 0).toFixed(2)}
        </Text>
        </View>

        <View className="mt-2 flex-row justify-between items-center">
          <Text className="font-semibold">Discount Amount: </Text>
          <Text>-${order.discountAmount.toFixed(2)}</Text>
        </View>

        <View className="mt-2 flex-row justify-between items-center">
          <Text className="font-semibold">Shipping Cost: </Text>
          <Text>${order.shippingCost.toFixed(2)}</Text>
        </View>

        <View className="mt-2 flex-row justify-between items-center">
          <Text className="font-semibold">Total Amount: </Text>
          <Text className='color-red-500'>${order.totalAmount.toFixed(2)}</Text>
        </View>

        <View className="mt-4 flex-row justify-between">
          <Text className="font-semibold">Shipping Address: </Text>
          <Text className='flex-1'>{`${order.shippingAddress.street}, ${order.shippingAddress.district}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`}</Text>
        </View>

        {/* Admin Actions */}
        <View className="mt-6 flex-row justify-around">
        {order.orderStatus === 'Processing' && (
            <>
            <TouchableOpacity
                onPress={() => handleConfirmUpdateStatus('Shipping', 'mark as Shipping')}
                className="bg-yellow-500 px-4 py-2 rounded-lg"
            >
                <Text className="text-white font-bold">Mark as Shipping</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleConfirmUpdateStatus('Canceled', 'cancel')}
                className="bg-red-500 px-4 py-2 rounded-lg"
            >
                <Text className="text-white font-bold">Cancel Order</Text>
            </TouchableOpacity>
            </>
        )}
        {order.orderStatus === 'Shipping' && (
            <TouchableOpacity
            onPress={() => handleConfirmUpdateStatus('Delivered', 'mark as Delivered')}
            className="bg-green-500 px-4 py-2 rounded-lg"
            >
            <Text className="text-white font-bold">Mark as Delivered</Text>
            </TouchableOpacity>
        )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminOrderDetailScreen;
