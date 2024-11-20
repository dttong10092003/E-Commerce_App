import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import icons from '../constants/icons';
import BASE_URL from '../config';

const ProductItem = ({ item }) => (
  <View className="flex-row items-center bg-white rounded-lg my-2 mx-4 shadow-sm">
    <Image source={{ uri: item.product.images[0] }} className="w-20 h-20 rounded-tl-lg rounded-bl-lg" />
    <View className="ml-4 flex-1">
      <Text numberOfLines={1} className="text-lg font-semibold">{item.product.name}</Text>
      <Text className="text-gray-500">
        Color: <Text className="font-semibold text-black">{item.selectedColor}  </Text>
        Size: <Text className="font-semibold text-black">{item.selectedSize}</Text>
      </Text>
      <Text className="text-gray-500">Units: <Text className="font-semibold text-black">{item.quantity}</Text></Text>
    </View>
    {/* <Text className="text-lg font-semibold">{item.product.salePrice}$</Text> */}
    <View className="h-20 justify-end items-end p-2">
      <Text className="text-lg font-semibold">{(item.product.salePrice * (1 - item.product.discount / 100)).toFixed(2)}$</Text>
    </View>
  </View>
);

const OrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const [userID, setUserID] = useState<string | null>(null);

  const formattedDate = new Date(
    order.orderStatus === 'Delivered' ? order.deliveredDate :
      order.orderStatus === 'Canceled' ? order.canceledDate :
        order.orderDate
  ).toLocaleString();

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const response = await axios.get<{ _id: string }>(`${BASE_URL}/auth/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            const user = response.data;  // Chỉ lấy _id từ response
            setUserID(user._id);
          }
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserID();
  }, []);

  // Hàm lấy số lượng sản phẩm hiện tại trong giỏ hàng cho sản phẩm cụ thể
  const getCurrentCartItemQuantity = async (userId, productId, selectedSize, selectedColor) => {
    try {
      const response = await axios.get<{quantity: number}>(
        `${BASE_URL}/cart/${userId}/item-quantity`,
        { params: { productId, selectedSize, selectedColor } }
      );
      return response.data.quantity || 0;
    } catch (error) {
      console.error("Error fetching cart item quantity:", error);
      return 0;
    }
  };

  const addToCart = async (product, quantity, selectedSize, selectedColor) => {
    if (!userID) {
      alert("User not logged in.");
      return;
    }
    
    const selectedVariant = product.variants.find(variant => variant.color === selectedColor);
    if (!selectedVariant) {
      alert("Selected color is unavailable");
      return;
    }

    const sizeOption = selectedVariant.sizes.find(size => size.size === selectedSize);
    if (!sizeOption) {
      alert("Selected size is unavailable");
      return;
    }

    const currentCartItemQuantity = await getCurrentCartItemQuantity(userID, product._id, selectedSize, selectedColor);
    const newQuantity = currentCartItemQuantity + quantity;

    if (newQuantity > sizeOption.stock) {
      // alert(`Only ${sizeOption.stock - currentCartItemQuantity} items available in stock`);
      alert(`Name: ${product.name}\nColor: ${selectedColor}\nSize: ${selectedSize}\nOnly ${sizeOption.stock - currentCartItemQuantity} items available in stock`);
      return;
    }

    try {
      await axios.post(`${BASE_URL}/cart/${userID}/add`, {
        productId: product._id,
        quantity,
        selectedSize,
        selectedColor,
      });
  
      } catch (error) {
        alert("Failed to add product to cart");
        console.error("Error adding product to cart:", error);
      }
  };

  const handleReorder = async () => {
    for (const item of order.products) {
      await addToCart(item.product, item.quantity, item.selectedSize, item.selectedColor);
    }
    alert("All items have been added to your cart.");
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Order Details</Text>
      </View>

      <View className="flex-1">
        {/* Order ID and Status */}
        <View className="bg-white p-4 mx-4 mt-4 rounded-lg shadow-md">
          <Text className="text-lg font-semibold">Order: {order._id}</Text>
          <Text className="text-gray-400">Date: {formattedDate}</Text>
          <Text className={`font-semibold mt-2 ${order.orderStatus === 'Delivered' ? 'text-green-500' : order.orderStatus === 'Processing' ? 'text-orange-500' : order.orderStatus === 'Shipping' ? 'text-yellow-500' : 'text-red-500'}`}>
            {order.orderStatus}
          </Text>
        </View>

        {/* Product List */}
        <Text className="text-lg font-semibold mx-4 mt-2">{order.products.length} items</Text>
        <ScrollView className="flex-1">
          <FlatList
            data={order.products}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <ProductItem item={item} />}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          />
        </ScrollView>

        {/* Order Information */}
        <View className="bg-white p-4 mx-4 mt-4 rounded-lg shadow-md">
          <Text className="text-lg font-semibold">Order information</Text>

          {/* Shipping Address */}
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-gray-600" style={{ minWidth: 120 }}>Shipping Address:</Text>
            <Text className="font-semibold text-black flex-1">
              {`${order.shippingAddress.street}, ${order.shippingAddress.district}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`}
            </Text>
          </View>

          {/* Payment Method */}
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-gray-600" style={{ minWidth: 120 }}>Payment method:</Text>
            <View className="flex-1 flex-row items-center">
              <Image
                source={order.paymentMethod.cardType === 'mastercard' ? icons.mastercard : icons.visa}
                className="w-6 h-4 mr-2 bg-sky-100"
                resizeMode="contain"
              />
              <Text className="font-semibold text-black">
                **** **** **** {order.paymentMethod.cardNumber.slice(-4)}
              </Text>
            </View>
          </View>

          {/* Delivery Method */}
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-gray-600" style={{ minWidth: 120 }}>Delivery method:</Text>
            <Text className="font-semibold text-black flex-1">
              {`${order.deliveryMethod}, ${order.deliveryMethod === 'fedex'
                ? '1 day'
                : order.deliveryMethod === 'usps'
                  ? '3 days'
                  : order.deliveryMethod === 'dhl'
                    ? '7 days'
                    : ''
                }, ${order.shippingCost}$`}
            </Text>
          </View>

          {/* Discount */}
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-gray-600" style={{ minWidth: 120 }}>Discount:</Text>
            <Text className="font-semibold text-black flex-1">
              {order.discountAmount}$
            </Text>
          </View>

          {/* Total Amount */}
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-gray-600" style={{ minWidth: 120 }}>Total Amount:</Text>
            <Text className="font-semibold text-black flex-1">
              {order.totalAmount.toFixed(2)}$
            </Text>
          </View>
        </View>


        {/* Action Buttons */}
        <View className="flex-row justify-around p-4 mt-4">
          <TouchableOpacity onPress={handleReorder} className="bg-blue-200 border border-black-500 px-6 py-3 rounded-full">
            <Text className="font-medium">Reorder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderDetailScreen;
