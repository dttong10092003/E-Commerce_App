import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Product } from '../constants/types';
import { colorMap } from '../constants/colors';

type RootStackParamList = {
  Catalog: {
    mainCategory: string; subCategoryName: string; subSubCategory: string;
    filters?: {
      maxPrice: number;
      selectedColor: string | null;
      selectedSize: string | null;
    };
  };
  Filter: {
    mainCategory: string; subCategoryName: string; subSubCategory: string;
    maxPrice: number;
    allColors: string[];
    allSizes: string[];
  };
  ProductDetails: {
    itemDetails: Product;
  };
};

type FilterRouteProp = RouteProp<RootStackParamList, 'Filter'>;
type FilterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Filter'>;

const FilterScreen: React.FC = () => {
  const route = useRoute<FilterRouteProp>();
  const navigation = useNavigation<FilterScreenNavigationProp>();

  // Nhận giá trị maxPrice, minPrice, allColors, và allSizes từ route
  const { maxPrice, allColors, allSizes, mainCategory, subCategoryName, subSubCategory } = route.params;

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  // const [selectedCategory, setSelectedCategory] = useState<string | null>('All');
  const [priceRange, setPriceRange] = useState(maxPrice/2);

  const handleApplyFilters = () => {
    navigation.navigate('Catalog', {
      mainCategory,
      subCategoryName,
      subSubCategory,
      filters: {
        maxPrice: priceRange,
        selectedColor,
        selectedSize,
      },
    });
  };

  const handleDiscardFilters = () => {
    setSelectedColor(null);
    setSelectedSize(null);
    setPriceRange(maxPrice);
    navigation.navigate('Catalog');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-4 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold ml-2">Filters</Text>
      </View>
      
      <ScrollView className="px-4">
        {/* Price Range */}
        <Text className="text-lg font-semibold mt-4">Price range</Text>
        <Slider
          minimumValue={0}
          maximumValue={maxPrice}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value)}
          className="mt-2"
          minimumTrackTintColor="#FF3E3E"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#FF3E3E"
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text className="text-gray-1000">$0</Text>
          <Text className="text-gray-1000">${priceRange.toFixed(0)}</Text>
        </View>

        {/* Colors */}
        <Text className="text-lg font-semibold mt-4">Colors</Text>
        <View className="flex-row mt-2">
        {allColors.map((color) => (
            <TouchableOpacity
              key={color}
              style={{
                backgroundColor: colorMap[color] || '#ddd',
                width: 30,
                height: 30,
                borderRadius: 15,
                margin: 4,
                borderWidth: selectedColor === color ? 2 : 0,
                borderColor: 'red',
              }}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>

        {/* Sizes */}
        <Text className="text-lg font-semibold mt-4">Sizes</Text>
        <View className="flex-row mt-2">
          {allSizes.map((size) => (
            <TouchableOpacity
              key={size}
              onPress={() => setSelectedSize(size)}
              style={{
                padding: 8,
                borderWidth: 1,
                borderRadius: 8,
                borderColor: selectedSize === size ? 'red' : '#ddd',
                backgroundColor: selectedSize === size ? 'red' : 'white',
                marginRight: 8,
              }}
            >
              <Text style={{ color: selectedSize === size ? 'white' : 'black' }}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category */}
        {/* <Text className="text-lg font-semibold mt-4">Category</Text>
        <View className="flex-row mt-2 flex-wrap">
          {['All', 'Women', 'Men', 'Boys', 'Girls'].map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={{
                padding: 8,
                borderWidth: 1,
                borderRadius: 8, // Giảm độ tròn của border
                borderColor: selectedCategory === category ? 'red' : '#ddd',
                backgroundColor: selectedCategory === category ? 'red' : 'white',
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: selectedCategory === category ? 'white' : 'black' }}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View> */}

        {/* Discard and Apply Buttons */}
        <View className="flex-row mt-6 mb-4">
          <TouchableOpacity className="flex-1 bg-gray-300 py-4 rounded-full mr-2" onPress={handleDiscardFilters}>
            <Text className="text-center text-black">Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-red-500 py-4 rounded-full ml-2" onPress={handleApplyFilters}>
            <Text className="text-center text-white">Apply</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FilterScreen;
