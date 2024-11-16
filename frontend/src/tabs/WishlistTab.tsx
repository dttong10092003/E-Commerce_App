import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, TextInput, Alert } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../constants/icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../constants/rootStackParamList';
import { Rating } from 'react-native-ratings';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import { Ratings } from '../constants/types';

const { width } = Dimensions.get('window');
type SubCategory = {
  name: string;
  image: string;
};

type WishlistType = {
  products: { _id: string }[];
};

const WishlistTab = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'ProductDetails'>>();
  const ITEM_WIDTH = (width - 48) / 2;

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);
  const [subCategories, setSubCategories] = useState([{ name: 'All', image: '' }, { name: 'New', image: 'https://picsum.photos/200' }]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [userID, setUserID] = useState<string | null>(null);

  const fetchWishlist = async (userId: string) => {
    try {
      const response = await axios.get<WishlistType>(`${BASE_URL}/wishlist/${userId}`);
      const wishlist = response.data.products || [];
      setWishlistData(wishlist);
      setFilteredData(wishlist);
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
              fetchWishlist(user._id);
            }
          }
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      };

      fetchUserID();
      fetchSubCategories();
    }, [])
  );

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

  function calculateAverageRating(ratings: Ratings): number {
    const totalRatings = ratings[1] + ratings[2] + ratings[3] + ratings[4] + ratings[5];
    const weightedSum =
      ratings[1] * 1 +
      ratings[2] * 2 +
      ratings[3] * 3 +
      ratings[4] * 4 +
      ratings[5] * 5;

    return totalRatings > 0 ? weightedSum / totalRatings : 0;
  }
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { itemDetails: item })}
      style={{ width: ITEM_WIDTH }}
      className="bg-white rounded-lg p-1 shadow-md relative"
    >
      <Image
        source={{ uri: item.images[0] }}
        className="w-full h-56 rounded-lg"
        resizeMode="cover"
      />

      {item?.discount > 0 && (
        <View className="absolute top-3 left-3 bg-red-500 rounded-full px-2 py-1">
          <Text className="text-white text-xs font-bold">{item.discount}%</Text>
        </View>
      )}
      <Text className="text-base font-bold mt-1" numberOfLines={1} ellipsizeMode="tail">
        {item?.name}
      </Text>

      <View className='flex-row '>

        <Text className="text-lg font-bold text-black">
          ${((item.salePrice * (100 - item.discount)) / 100).toFixed(2)}
        </Text>
        {item.discount > 0 && (
          <View className="flex flex-row items-center gap-x-3 ml-1">
            <Text className="text-sm line-through text-gray-400">${item.salePrice.toFixed(2)}</Text>
          </View>
        )}
      </View>


      <View className="flex-row items-center mt-2">
        <Rating
          type="custom"
          ratingCount={5}
          imageSize={18}
          startingValue={calculateAverageRating(item.ratings)}
          readonly={true}
          tintColor="#fff"
          ratingBackgroundColor="#EEEEEE"
        />
        <Text className="text-sm text-gray-500 ml-1">({item?.reviews} reviews)</Text>
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
