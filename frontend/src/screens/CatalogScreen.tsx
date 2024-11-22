import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Rating } from 'react-native-ratings';
import BASE_URL from '../config';
import axios from 'axios';
import { colorMap } from '../constants/colors';
import { Product, Ratings } from '../constants/types';

type RootStackParamList = {
  Catalog: { mainCategory: string; subCategoryName: string; subSubCategory: string; 
    filters?: {
      maxPrice?: number;
      selectedColor?: string;
      selectedSize?: string;
      selectedDiscount?: number;
      searchQuery?: string;
    };
   };
   Filter: {
    mainCategory: string;
    subCategoryName: string;
    subSubCategory: string;
    maxPrice: number;
    allColors: string[];
    allSizes: string[];
    allDiscounts: number[];
  };
  ProductDetails: { itemDetails: Product };
};

type CatalogScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Catalog'>;
type CatalogScreenRouteProp = RouteProp<RootStackParamList, 'Catalog'>;

interface CatalogScreenProps {
  route: CatalogScreenRouteProp;
}

const sortSizesAutomatically = (sizes) => {
  return sizes.sort((a, b) => {
    // Kiểm tra xem kích cỡ có phải là số
    const isANumeric = /^\d+$/.test(a);
    const isBNumeric = /^\d+$/.test(b);

    // Sắp xếp số trước
    if (isANumeric && isBNumeric) return parseInt(a) - parseInt(b);
    if (isANumeric) return -1;
    if (isBNumeric) return 1;

    // Sắp xếp các kích cỡ dạng chữ cái theo thứ tự tự nhiên (XS, S, M, L...)
    const order = ["XS", "S", "M", "L", "XL", "XXL", "Small", "Medium", "Large", "Extra Large"];
    const indexA = order.indexOf(a);
    const indexB = order.indexOf(b);

    // Nếu cả hai đều nằm trong danh sách order, sắp xếp theo thứ tự trong danh sách
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // Với các kích cỡ khác, sắp xếp theo thứ tự chữ cái
    return a.localeCompare(b);
  });
};

const sortOptions = ['Newest', 'Popular', 'Sort by rating', 'Price: lowest to high', 'Price: highest to low'];

const CatalogScreen: React.FC<CatalogScreenProps> = ({ route }) => {
  const { mainCategory, subCategoryName, subSubCategory, filters } = route.params;
  const navigation = useNavigation<CatalogScreenNavigationProp>();
  

  const [products, setProducts] = useState<Product[]>([]);
  const [isGridView, setIsGridView] = useState(false);
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>('Newest');

  const maxPrice = Math.max(...products.map((product) => product.salePrice * (1 - product.discount / 100)));
  const allDiscounts = Array.from(
    new Set(products.map((product) => product.discount))
  ).sort((a, b) => a - b);

  const allSizes = sortSizesAutomatically(
    Array.from(
      new Set(
        products.flatMap((product) =>
          product.variants.flatMap((variant) => variant.sizes.map((sizeObj) => sizeObj.size))
        )
      )
    )
  );
  const allColors = Array.from(
    new Set(
      products.flatMap((product) =>
        product.variants.map((variant) => variant.color)
      )
    )
  );

  const handleFilterPress = () => {
    navigation.navigate('Filter', {mainCategory, subCategoryName, subSubCategory, maxPrice, allColors, allSizes, allDiscounts });
  };

  console.log('mainCategory:', mainCategory);
  console.log('subCategoryName:', subCategoryName);
  console.log('subSubCategory:', subSubCategory);

  // Áp dụng filter nếu tồn tại
  const filteredProducts = products.filter((product) => {
    // Filter theo giá
    const price = product.salePrice * (1 - product.discount / 100);
    if (filters?.maxPrice && price > filters.maxPrice) {
      return false;
    }

    // Filter theo màu sắc
    const productColors = product.variants.map((variant) => variant.color);
    if (filters?.selectedColor && !productColors.includes(filters.selectedColor)) return false;

    // Filter theo kích thước
    const productSizes = product.variants.flatMap((variant) => variant.sizes.map((sizeObj) => sizeObj.size));
    if (filters?.selectedSize && !productSizes.includes(filters.selectedSize)) return false;

    if (filters?.selectedDiscount !== undefined && product.discount < filters.selectedDiscount) return false;

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (!product.name.toLowerCase().includes(query) && !product.description.toLowerCase().includes(query)) return false;
    }

    return true;
  });

  // Apply sorting
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (selectedSort === 'Popular') return b.reviews - a.reviews;
    if (selectedSort === 'Price: lowest to high') return (a.salePrice * (1 - a.discount / 100)) - (b.salePrice * (1 - b.discount / 100));
    if (selectedSort === 'Price: highest to low') return (b.salePrice * (1 - b.discount / 100)) - (a.salePrice * (1 - a.discount / 100));
    if (selectedSort === 'Sort by rating') {
      const avgRatingA = calculateAverageRating(a.ratings);
      const avgRatingB = calculateAverageRating(b.ratings);
      return avgRatingB - avgRatingA;
    }
    return 0; // Newest or no sorting
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(
          `${BASE_URL}/products/${mainCategory}/${subCategoryName}/${subSubCategory}/products`
        );
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
      }
    };

    fetchProducts();
  }, [mainCategory, subCategoryName, subSubCategory]);

  console.log('products:', products);

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

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { itemDetails: item })}
      className="flex-row bg-white p-4 my-2 rounded-lg shadow-sm"
    >
      {/* Product Image */}
      <Image source={{ uri: item.images[0] }} className="w-20 h-20 rounded-lg" />
  
      {/* Product Details */}
      <View className="ml-4 flex-1">
        <Text numberOfLines={1} className="text-lg font-semibold">{item.name}</Text>
        
        {/* Product Rating */}
        <View className="flex-row items-center mt-2">
          <Rating
            type="custom"
            ratingCount={5}
            imageSize={16}
            startingValue={
              calculateAverageRating(item.ratings)
            }
            readonly
            ratingBackgroundColor="#EEEEEE"
            style={{ marginRight: 8 }}
          />
          <Text className="text-gray-500 text-sm">({item.reviews} reviews)</Text>
        </View>
  
        {/* Description */}
        <Text numberOfLines={2} className="text-gray-500 text-xs mt-2">{item.description}</Text>
  
        {/* Price and Discount */}
        <View className="flex-row items-center mt-2">
          <Text className="text-lg font-bold text-black mr-2">${item.salePrice * (1 - item.discount / 100)}</Text>
          {item.discount > 0 && (
            <>
              <Text className="text-gray-500 text-sm line-through mr-2">${item.salePrice}</Text>
              <Text className="text-xs text-red-500">-{item.discount}% off</Text>
            </>
          )}
        </View>
  
        {/* Variants */}
        <View className="flex-row mt-2">
          <Text className="text-gray-500 text-xs mr-1">Sizes:</Text>
          <Text className="text-xs">{Array.from(new Set(item.variants.flatMap((variant) => variant.sizes.map((sizeObj) => sizeObj.size)))).join(', ')}</Text>
        </View>

        {/* Available Colors */}
        <View className="flex-row mt-2">
          <Text className="text-gray-500 text-xs mr-2">Colors:</Text>
          <View className="flex-row">
          {Array.from(new Set(item.variants.map((variant) => variant.color))).map((uniqueColor: string, index) => (
            <View
              key={index}
              style={{ backgroundColor: colorMap[uniqueColor as string] || "gray" }}
              className="w-4 h-4 rounded-full border border-gray-300 mr-1"
            />
          ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGridItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { itemDetails: item })}
      className="flex-1 m-2 bg-white p-4 rounded-lg shadow-sm"
    >
      {/* Product Image */}
      <Image source={{ uri: item.images[0] }} className="w-full h-40 rounded-lg" />
  
      {/* Product Details */}
      <Text numberOfLines={1} className="text-lg font-semibold mt-2">{item.name}</Text>
  
      {/* Product Rating */}
      <View className="flex-row items-center mt-1">
        <Rating
          type="custom"
          ratingCount={5}
          imageSize={16}
          startingValue={
            calculateAverageRating(item.ratings)
          }
          readonly
          ratingBackgroundColor="#EEEEEE"
          style={{ marginRight: 8 }}
        />
        <Text className="text-gray-500 text-xs">({item.reviews} reviews)</Text>
      </View>

      {/* Description */}
      <Text numberOfLines={2} className="text-gray-500 text-xs mt-2">{item.description}</Text>
  
      {/* Price and Discount */}
      <View className="flex-row items-center mt-2">
        <Text className="text-lg font-bold text-black mr-2">${item.salePrice * (1 - item.discount / 100)}</Text>
        {item.discount > 0 && (
          <>
            <Text className="text-gray-500 text-sm line-through mr-2">${item.salePrice}</Text>
            <Text className="text-xs text-red-500">-{item.discount}% off</Text>
          </>
        )}
      </View>

      {/* Available Sizes */}
      <View className="flex-row mt-2">
        <Text className="text-gray-500 text-xs mr-1">Sizes:</Text>
        <Text className="text-xs">{Array.from(new Set(item.variants.flatMap((variant) => variant.sizes.map((sizeObj) => sizeObj.size)))).join(', ')}</Text>
      </View>

      {/* Available Colors */}
      <View className="flex-row mt-2">
        <Text className="text-gray-500 text-xs mr-1">Colors:</Text>
        <View className="flex-row">
        {Array.from(new Set(item.variants.map((variant) => variant.color))).map((uniqueColor: string, index) => (
          <View
            key={index}
            style={{ backgroundColor: colorMap[uniqueColor as string] || "gray" }}
            className="w-4 h-4 rounded-full border border-gray-300 mr-1"
          />
        ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold ml-2">{subSubCategory === 'All' ? 'All Products' : subSubCategory}</Text>
      </View>

      <View className="flex-row justify-between items-center px-4 mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity onPress={() => setSortModalVisible(true)} className="flex-row items-center p-2 border border-gray-300 rounded-full mr-2">
            <Ionicons name="filter" size={18} color="black" />
            <Text className="ml-2">Sort By</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFilterPress} className="flex-row items-center p-2 border border-gray-300 rounded-full mr-2">
            <Ionicons name="options-outline" size={18} color="black" />
            <Text className="ml-2">Filter</Text>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity onPress={() => setIsGridView(!isGridView)}>
          <Ionicons name={isGridView ? "list" : "grid"} size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedProducts}
        // keyExtractor={(item) => item.id}
        renderItem={isGridView ? renderGridItem : renderListItem}
        numColumns={isGridView ? 2 : 1}
        key={isGridView ? 'grid' : 'list'}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        showsHorizontalScrollIndicator={false}
      />

      {/* Sort Modal */}
      <Modal visible={isSortModalVisible} animationType="slide" transparent>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => setSortModalVisible(false)} activeOpacity={1}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <TouchableOpacity activeOpacity={1}>
              <View className="bg-white p-4 rounded-t-lg">
                <Text className="text-xl font-bold mb-4">Sort By</Text>
                {sortOptions.map((option) => (
                  <TouchableOpacity key={option} onPress={() => { setSelectedSort(option); setSortModalVisible(false); }} className={`p-2 ${selectedSort === option ? 'bg-red-500 text-white' : 'text-black'}`}>
                    <Text className={`text-lg ${selectedSort === option ? 'text-white' : 'text-black'}`}>{option}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setSortModalVisible(false)} className="mt-4">
                  <Text className="text-red-500 text-lg font-bold">Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      
    </SafeAreaView>
  );
};

export default CatalogScreen;
