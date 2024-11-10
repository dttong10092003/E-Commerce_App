import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, TextInput, Alert } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../constants/icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteStackParamList } from '../../App';
import { Rating } from 'react-native-ratings';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

const { width } = Dimensions.get('window');
type SubCategory = {
  name: string;
  image: string;
};

const WishlistTab = () => {
  const navigation = useNavigation<StackNavigationProp<RouteStackParamList, 'ProductDetails'>>();
  const ITEM_WIDTH = (width - 48) / 2;

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);
  const [subCategories, setSubCategories] = useState([{ name: 'All', image: '' }, { name: 'New', image: 'https://picsum.photos/200' }]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');

  const fetchWishlist = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Error', 'Missing authentication token');
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const products = (response.data as { products: any[] }).products || [];
      setWishlistData(products);
      setFilteredData(products);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      Alert.alert('Error', 'Failed to fetch wishlist');
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get<SubCategory[]>(`${BASE_URL}/products/sub-categories`);
      setSubCategories([{ name: 'All', image: '' }, ...response.data]);
    } catch (error) {
      console.error('Error fetching sub-categories:', error);
    }
  };

  const filterProductsBySubCategory = (categoryName: string) => {
    setSelectedSubCategory(categoryName);
    if (categoryName === 'All') {
      setFilteredData(wishlistData);
    } else {
      const filtered = wishlistData.filter((product) => product.subCategory?.name === categoryName);
      setFilteredData(filtered);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
      fetchSubCategories();
    }, [])
  );

  // const handleSearch = (text) => {
  //   setSearchQuery(text);
  //   if (text) {
  //     const filtered = wishlistData.filter((item) =>
  //       item.name?.toLowerCase().includes(text.toLowerCase())
  //     );
  //     setFilteredData(filtered);
  //   } else {
  //     setFilteredData(wishlistData);
  //   }
  // };

  const handleSearch = (text) => {
    setSearchQuery(text);
  
    // Lọc sản phẩm theo tên trong danh sách thuộc sub-category đã chọn
    if (text) {
      const filtered = filteredData.filter((item) =>
        item.name?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      // Nếu không có văn bản tìm kiếm, hiển thị lại sản phẩm theo sub-category đã chọn
      filterProductsBySubCategory(selectedSubCategory);
    }
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { itemDetails: item })}
      style={{ width: ITEM_WIDTH }}
      className="bg-white rounded-lg p-2 shadow-md relative"
    >
      {item?.images?.[0] ? (
        <Image
          source={{ uri: item.images[0] }}
          className="w-full h-56 rounded-lg"
          resizeMode="cover"
        />
      ) : (
        <Image
          source={{ uri: 'https://picsum.photos/200' }}
          className="w-full h-56 rounded-lg"
          resizeMode="cover"
        />
      )}
      {item?.discount > 0 && (
        <View className="absolute top-3 left-3 bg-red-500 rounded-full px-2 py-1">
          <Text className="text-white text-xs font-bold">{item.discount}%</Text>
        </View>
      )}
      <Text className="text-base font-bold mt-1" numberOfLines={1} ellipsizeMode="tail">
        {item?.name || 'No Name'}
      </Text>
      <Text className="text-lg font-bold text-black">
        ${((item.salePrice * (100 - item.discount)) / 100).toFixed(2)}
      </Text>
      {item.discount > 0 && (
        <View className="flex flex-row items-center gap-x-3">
          <Text className="text-sm line-through text-gray-400">${item.salePrice.toFixed(2)}</Text>
        </View>
      )}
      <View className="flex-row items-center mt-2">
        <Rating
          type="custom"
          ratingCount={5}
          imageSize={18}
          startingValue={item.ratings ? item.ratings.average : 0}
          readonly={true}
          tintColor="#fff"
          ratingBackgroundColor="#EEEEEE"
        />
        <Text className="text-base text-gray-500 ml-2">({item?.reviews || 0})</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between px-4 pb-4">
        <Text className="text-2xl font-bold">Favorites</Text>
      </View>
      <View className="flex-row items-center bg-gray-200 rounded-full px-4 mb-4 mx-4">
        <Image source={icons.search} className="w-5 h-5 mr-2" resizeMode="contain" />
        <TextInput
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
          className="flex-1 py-2"
        />
        <TouchableOpacity>
          <Image source={icons.mic} className="w-5 h-5 ml-2" resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Sub Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        style={{ maxHeight: 50, marginBottom: 8 }}
      >
        <View className="flex-row">
          {subCategories.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => filterProductsBySubCategory(item.name)}
              className={`py-2 px-4 mx-2 rounded-full flex-row items-center ${selectedSubCategory === item.name ? 'bg-red-200' : 'bg-gray-200'}`}
              style={{ flexShrink: 1 }}
            >
              <Text className="text-sm font-semibold">{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
        ListEmptyComponent={() => (
          <View className="flex items-center mt-10">
            <Text className="text-gray-500 mt-40">No favorite products found</Text>
          </View>
        )}
        style={{ flex: 1, marginBottom: 8 }}
      />
    </SafeAreaView>
  );
};

export default WishlistTab;
