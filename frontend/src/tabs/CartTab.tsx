import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native';
import icons from '../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../config';

type CartItem = {
  product: {
    _id: string;
    name: string;
    images: string[];
    salePrice: number;
    variants: {
      size: string;
      colors: { color: string; stock: number; image: string }[];
    }[];
  };
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  subTotal: number;
};

type CartData = {
  products: CartItem[];
  totalAmount: number;
};

const CartTab = ({navigation}) => {
  const [userID, setUserID] = useState<string | null>(null);
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch userID from token and then fetch cart data
  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const response = await axios.get<{ _id: string }>(`${BASE_URL}/auth/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            const user = response.data;
            setUserID(user._id);
            fetchCartData(user._id); // Fetch cart data once userID is obtained
          }
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    fetchUserID();
  }, []);

  // Fetch cart data from backend
  const fetchCartData = async (userId) => {
    try {
      const response = await axios.get<CartData>(`${BASE_URL}/cart/${userId}`);
      if (response.status === 200) {
        setCartData(response.data.products); // Set products from cart
        setTotalAmount(response.data.totalAmount);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  console.log('Selected Item:', selectedItem?._id, selectedItem?.product.name, selectedItem?.selectedColor, selectedItem?.selectedSize);

  const increaseQuantity = async (item: CartItem) => {
    if (!userID) return; // Kiểm tra userID
    console.log('productID:', item.product._id);
    const variant = item.product.variants.find(v => v.size === item.selectedSize);
    const colorOption = variant?.colors.find(c => c.color === item.selectedColor);
  
    console.log(`${BASE_URL}/cart/${userID}/update`);
    if (colorOption && item.quantity < colorOption.stock) {
      try {
        const updatedQuantity = item.quantity + 1;
        await axios.patch(`${BASE_URL}/cart/${userID}/update`, {
          productId: item.product._id,
          quantity: updatedQuantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        });
        fetchCartData(userID); // Refresh cart data nếu thành công
      } catch (error) {
        console.error("Error updating cart quantity:", error);
      }
    } else {
      alert("Not enough stock available");
    }
  };

  const decreaseQuantity = async (item: CartItem) => {
    if (item.quantity > 1) {
      try {
        const updatedQuantity = item.quantity - 1;
        await axios.patch(`${BASE_URL}/cart/${userID}/update`, {
          productId: item.product._id,
          quantity: updatedQuantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        });
        fetchCartData(userID);
      } catch (error) {
        console.error("Error updating cart quantity:", error);
      }
    } else {
      handleDelete(item);
    }
  };
  
  const handleDelete = async (item: CartItem) => {
    if (!userID) return; 
    
    try {
      await axios.post(`${BASE_URL}/cart/${userID}/remove`, {
        productId: item.product._id,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      });
      fetchCartData(userID); 
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const renderCartItem = ({ item }) => {
    const selectedVariant = item.product.variants.find(variant =>
      variant.colors.some(colorObj => colorObj.color === item.selectedColor)
    );

    const colorImage = selectedVariant
    ? selectedVariant.colors.find(colorObj => colorObj.color === item.selectedColor)?.image
    : item.product.images[0];
    const discountedPrice = item.product.salePrice * (1 - item.product.discount / 100);
    const originalSubTotal = item.product.salePrice * item.quantity;
    return (
      <View className="flex-row bg-white rounded-lg p-5 mb-4 items-center shadow-md relative">
        {/* Icon dấu ba chấm ở góc trên bên phải */}
        <TouchableOpacity
          className="absolute top-3 right-3"
          onPress={(event) => {
            const position = { top: event.nativeEvent.pageY - 60, right: 15 };
            setSelectedItem(item);
            setModalPosition(position);
            setModalVisible(true);
          }}
        >
          <Image source={icons.dots} className="w-5 h-5 opacity-60" resizeMode="contain" />
        </TouchableOpacity>
  
        {/* Hình ảnh sản phẩm */}
        <Image source={{ uri: colorImage  }} className="w-20 h-20 rounded-lg mr-4" resizeMode="cover" />
  
        {/* Thông tin sản phẩm */}
        <View className="flex-1">
          <Text numberOfLines={1} className="text-lg font-bold">{item.product.name}</Text>
          <Text className="text-gray-500">
            Color: <Text className="font-bold">{item.selectedColor}</Text>{' '}
            Size: <Text className="font-bold">{item.selectedSize}</Text>
          </Text>

          {/* Hiển thị giá với gạch ngang nếu có giảm giá */}
        <View className="flex-row items-center mt-2">          
          <Text className="font-bold mr-2">${discountedPrice}</Text>
          {item.product.discount > 0 && (
            <Text style={{ textDecorationLine: 'line-through', fontSize: 12}}>
              ${item.product.salePrice}
            </Text>
          )}
        </View>
  
          <View className="flex-row items-center mt-2 space-x-2">
            <TouchableOpacity onPress={() => decreaseQuantity(item)} className="w-8 h-8 bg-gray-200 rounded-full justify-center items-center">
              <Text className="text-lg font-bold text-gray-600">-</Text>
            </TouchableOpacity>
  
            <Text className="text-lg font-semibold">{item.quantity}</Text>
  
            <TouchableOpacity onPress={() => increaseQuantity(item)} className="w-8 h-8 bg-gray-200 rounded-full justify-center items-center">
              <Text className="text-lg font-bold text-gray-600">+</Text>
            </TouchableOpacity>
          </View>
        </View>
  
        {/* Giá ở góc dưới bên phải */}
        {/* <Text className="absolute bottom-3 right-3 text-lg font-bold">${item.subTotal}</Text> */}
        <View className='absolute bottom-3 right-3'>
        {item.product.discount > 0 && (
          <Text style={{ textDecorationLine: 'line-through', color: 'gray', fontSize: 14 }}>
            ${originalSubTotal.toFixed(1)}
          </Text>
        )}
        <Text className="text-lg font-bold">${item.subTotal.toFixed(1)}</Text>
      </View>
        
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <Text className="text-2xl font-bold mb-4 px-4">My Bag</Text>

      {/* Search and Products Section */}
      <View className="flex-1 px-4">
        {/* Cart Items List */}
        <FlatList
          data={cartData}
          renderItem={renderCartItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {/* Footer Section */}
      <View className="px-4 pb-4">

        {/* Total Amount */}
        <View className="flex-row justify-between mb-4">
          <Text className="text-lg">Total amount:</Text>
          {/* <Text className="text-lg font-bold">${totalAmount}</Text> */}
          <View>
            {totalAmount < cartData.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0) && (
              <Text className='line-through text-gray-500'>
                ${cartData.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0).toFixed(1)}
              </Text>
            )}
            <Text className="text-lg font-bold text-red-500">${totalAmount.toFixed(1)}</Text>
          </View>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity className="bg-red-500 rounded-full py-4 items-center shadow-md"  onPress={() => navigation.navigate('Checkout')}>
          <Text className="text-white font-bold text-lg">CHECK OUT</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Menu bên cạnh dấu ba chấm */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        />
        <View
          style={{
            position: 'absolute',
            top: modalPosition.top,
            right: modalPosition.right,
            backgroundColor: 'white',
            borderRadius: 8,
            paddingVertical: 4,
            width: 180,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          {/* <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              console.log('Add to favorites:', selectedItem?.title);
            }}
            className="py-2 px-4"
          >
            <Text className="text-base">Add to favorites</Text>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: '#E5E7EB' }} /> */}
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              if (selectedItem) {
                handleDelete(selectedItem);
              } 
              console.log('Delete from the list:', selectedItem?._id);
            }}
            className="py-2 px-4"
          >
            <Text className="text-base">Delete from the list</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CartTab;
