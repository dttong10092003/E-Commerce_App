import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native';
import icons from '../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const cartData = [
  { id: '1', title: 'Pullover', color: 'Black', size: 'L', price: 51, quantity: 1, image: 'https://picsum.photos/200' },
  { id: '2', title: 'T-Shirt', color: 'Gray', size: 'L', price: 30, quantity: 1, image: 'https://picsum.photos/200' },
  { id: '3', title: 'Sport Dress', color: 'Black', size: 'M', price: 43, quantity: 1, image: 'https://picsum.photos/200' },
];

const CartTab = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCartData, setFilteredCartData] = useState(cartData);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = cartData.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCartData(filtered);
    } else {
      setFilteredCartData(cartData);
    }
  };

  const totalAmount = filteredCartData.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleDotsPress = (item, position) => {
    setSelectedItem(item);
    setModalPosition(position);
    setModalVisible(true);
  };

  const renderCartItem = ({ item }) => (
    <View className="flex-row bg-white rounded-lg p-5 mb-4 items-center shadow-md relative">
      {/* Icon dấu ba chấm ở góc trên bên phải */}
      <TouchableOpacity
        className="absolute top-3 right-3"
        onPress={(event) => {
          const position = { top: event.nativeEvent.pageY - 60, right: 15 };
          handleDotsPress(item, position);
        }}
      >
        <Image source={icons.dots} className="w-5 h-5 opacity-60" resizeMode="contain" />
      </TouchableOpacity>

      {/* Hình ảnh sản phẩm */}
      <Image source={{ uri: item.image }} className="w-20 h-20 rounded-lg mr-4" resizeMode="cover" />

      {/* Thông tin sản phẩm */}
      <View className="flex-1">
        <Text className="text-lg font-bold">{item.title}</Text>
        <Text className="text-gray-500">
          Color: <Text className="font-bold">{item.color || 'Pink'}</Text>{' '}
          Size: <Text className="font-bold">{item.size || 'M'}</Text>
        </Text>

        <View className="flex-row items-center mt-2 space-x-2">
          <TouchableOpacity className="w-8 h-8 bg-gray-200 rounded-full justify-center items-center">
            <Text className="text-lg font-bold text-gray-600">-</Text>
          </TouchableOpacity>

          <Text className="text-lg font-semibold">{item.quantity}</Text>

          <TouchableOpacity className="w-8 h-8 bg-gray-200 rounded-full justify-center items-center">
            <Text className="text-lg font-bold text-gray-600">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Giá ở góc dưới bên phải */}
      <Text className="absolute bottom-3 right-3 text-lg font-bold">${item.price}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <Text className="text-2xl font-bold mb-4 px-4">My Bag</Text>

      {/* Search and Products Section */}
      <View className="flex-1 px-4">
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-200 rounded-full px-5 py-2 h-12 mb-3 shadow-md">
          <Image source={icons.search} className="w-5 h-5 mr-2 opacity-60" resizeMode="contain" />
          <TextInput
            placeholder="Search in cart..."
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={handleSearch}
            className="flex-1 text-base"
            style={{ color: '#374151' }}
          />
          <TouchableOpacity className="bg-black rounded-full p-2 ml-2">
            <Image source={icons.mic} className="w-5 h-5" />
          </TouchableOpacity>
        </View>

        {/* Cart Items List */}
        <FlatList
          data={filteredCartData}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {/* Footer Section */}
      <View className="px-4 pb-4">
        {/* Promo Code Section */}
        <View className="flex-row bg-white rounded-lg p-3 mb-2 items-center shadow-md">
          <TextInput placeholder="Enter your promo code" className="flex-1 text-base" />
          <TouchableOpacity className="bg-black rounded-full p-2 ml-2">
            <Image source={icons.next1} style={{ width: 16, height: 16 }} />
          </TouchableOpacity>
        </View>

        {/* Total Amount */}
        <View className="flex-row justify-between mb-4">
          <Text className="text-lg">Total amount:</Text>
          <Text className="text-lg font-bold">${totalAmount}</Text>
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
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              console.log('Add to favorites:', selectedItem?.title);
            }}
            className="py-2 px-4"
          >
            <Text className="text-base">Add to favorites</Text>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: '#E5E7EB' }} />
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              console.log('Delete from the list:', selectedItem?.title);
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
