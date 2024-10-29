import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../constants/icons';
import { CategoriesData, ProductData } from '../constants/data';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteStackParamList } from '../../App';
import { Rating } from 'react-native-ratings';

const { width } = Dimensions.get('window'); 

const WishlistTab = () => {
  const navigation = useNavigation<StackNavigationProp<RouteStackParamList, 'ProductDetails'>>();
  const ITEM_WIDTH = (width - 48) / 2;

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(ProductData);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = ProductData.filter((item) =>
        (item.title?.toLowerCase().includes(text.toLowerCase()) || item.brand?.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(ProductData);
    }
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('ProductDetails', { itemDetails: item })}
      style={{ width: ITEM_WIDTH }}
      className="bg-white rounded-lg p-2 shadow-md relative"
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-56 rounded-lg"
        resizeMode="cover"
      />

      {item.priceOff && (
        <View className="absolute top-3 left-3 bg-red-500 rounded-full px-2 py-1">
          <Text className="text-white text-xs font-bold">{item.priceOff}%</Text>
        </View>
      )}

      {item.soldOut && (
        <View className="absolute inset-0 bg-gray-200 bg-opacity-70 rounded-lg justify-center items-center">
          <Text className="text-gray-700 font-bold text-lg">Sorry, this item is currently sold out</Text>
        </View>
      )}

      <Text className="text-base font-bold mt-1" numberOfLines={1} ellipsizeMode="tail">
        {item.title}
      </Text>
      <Text className="text-sm text-gray-500">
        Color: <Text className="font-bold">{item.color || 'Pink'}</Text>{' '}
        Size: <Text className="font-bold">{item.size || 'M'}</Text>
      </Text>

      <Text className="text-lg font-bold text-black">${item.price}</Text>
      {item.priceBeforeDeal && (
        <Text className="text-sm line-through text-gray-400">${item.priceBeforeDeal}</Text>
      )}

      <View className="flex-row items-center mt-2">
        <Rating
          type="custom"
          ratingCount={5}
          imageSize={18}
          startingValue={item.stars}
          readonly={true}
          tintColor="#fff"
          ratingBackgroundColor="#EEEEEE"
        />
        <Text className="text-base text-gray-500 ml-2">({item.numberOfReview})</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between px-4 pb-4">
        <Text className="text-2xl font-bold">Favorites</Text>
      </View>

      {/* Search Bar */}
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

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        style={{ maxHeight: 50, marginBottom: 8 }}
      >
        <View className="flex-row">
          {CategoriesData.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-gray-200 py-2 px-4 mx-2 rounded-full flex-row items-center"
              style={{ flexShrink: 1 }}
            >
              <Text className="text-sm font-semibold">{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Filters */}
      <View className="flex-row justify-around items-center py-2 px-4 mb-4">
        <TouchableOpacity className="flex-row items-center space-x-2">
          <Image source={icons.filter} className="w-5 h-5" resizeMode="contain" />
          <Text className="text-sm">Filters</Text>
        </TouchableOpacity>

        <View className="flex-row items-center space-x-2">
          <Image source={icons.sort} className="w-4 h-4" resizeMode="contain" />
          <Text className="text-sm">Price: lowest to high</Text>
        </View>

        <TouchableOpacity>
          <Image source={icons.grid} className="w-5 h-5" resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        columnWrapperStyle={{ justifyContent: 'space-between',marginBottom:10 }}
        style={{ flex: 1, marginBottom: 8 }}
      />
    </SafeAreaView>
  );
};

export default WishlistTab;
