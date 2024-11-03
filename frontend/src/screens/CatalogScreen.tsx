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

type Variant = {
  size: string;
  colors: {
    color: string;
    stock: number;
    image: string; // Single image for each color
  }[];
};

type Ratings = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

type Product = {
  name: string;
  description: string;
  importPrice: number;
  salePrice: number;
  discount: number;
  mainCategory: string;
  subCategory: {
    name: string;
    image: string;
  };
  subSubCategory: string;
  images: string[]; // Array of 5 images for the main product images
  variants: Variant[];
  isHeart: boolean;
  reviews: number;
  ratings: Ratings;
  createdAt: string;
};

type RootStackParamList = {
  CatalogScreen: { mainCategory: string; subCategoryName: string, subSubCategory: string };
  Filter: undefined;
  ProductDetails: { itemDetails: Product };
};

type CatalogScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CatalogScreen'>;
type CatalogScreenRouteProp = RouteProp<RootStackParamList, 'CatalogScreen'>;

interface CatalogScreenProps {
  route: CatalogScreenRouteProp;
}


// const products = [
//   { id: '1', name: 'Pullover', price: '51$', image: 'https://picsum.photos/200', rating: 4.5 },
//   { id: '2', name: 'Blouse', price: '34$', image: 'https://picsum.photos/200', rating: 4.0 },
//   { id: '3', name: 'T-shirt', price: '12$', image: 'https://picsum.photos/200', rating: 4.2 },
//   { id: '4', name: 'Shirt', price: '51$', image: 'https://picsum.photos/200', rating: 3.5 },
//   { id: '5', name: 'Sweater', price: '70$', image: 'https://picsum.photos/200', rating: 4.8 },
// ];

const sortOptions = ['Popular', 'Newest', 'Customer review', 'Price: lowest to high', 'Price: highest to low'];

const CatalogScreen: React.FC<CatalogScreenProps> = ({ route }) => {
  const { mainCategory, subCategoryName, subSubCategory } = route.params;
  const navigation = useNavigation<CatalogScreenNavigationProp>();

  const [products, setProducts] = useState<Product[]>([]);
  const [isGridView, setIsGridView] = useState(false);
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);

  console.log('mainCategory:', mainCategory);
  console.log('subCategoryName:', subCategoryName);
  console.log('subSubCategory:', subSubCategory);

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
          <Text className="text-xs">{item.variants.map(variant => variant.size).join(', ')}</Text>
        </View>

        {/* Available Colors */}
        <View className="flex-row mt-2">
          <Text className="text-gray-500 text-xs mr-2">Colors:</Text>
          <View className="flex-row">
            {item.variants.slice(0, 3).map((variant, index) => (
              <View key={index} className="mr-2 flex-row">
                {variant.colors.map((colorObj, colorIndex) => (
                  <View
                    key={colorIndex}
                    style={{ backgroundColor: colorMap[colorObj.color] || "gray" }}
                    className="w-4 h-4 rounded-full border border-gray-300 mr-1"
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
  
      {/* Favorite Icon */}
      <TouchableOpacity>
        <Ionicons name={item.isHeart ? "heart" : "heart-outline"} size={24} color={item.isHeart ? "red" : "gray"} />
      </TouchableOpacity>
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
        <Text className="text-xs">{item.variants.map(variant => variant.size).join(', ')}</Text>
      </View>

      {/* Available Colors */}
      <View className="flex-row mt-2">
        <Text className="text-gray-500 text-xs mr-1">Colors:</Text>
        <View className="flex-row">
          {item.variants.slice(0, 3).map((variant, index) => (
            <View key={index} className="mr-1 flex-row">
              {variant.colors.map((colorObj, colorIndex) => (
                <View
                  key={colorIndex}
                  style={{ backgroundColor: colorMap[colorObj.color] || "gray" }}
                  className="w-4 h-4 rounded-full border border-gray-300 mr-1"
                />
              ))}
            </View>
          ))}
        </View>
      </View>
  
      {/* Favorite Icon */}
      <TouchableOpacity>
        <Ionicons name={item.isHeart ? "heart" : "heart-outline"} size={24} color={item.isHeart ? "red" : "gray"} style={{ alignSelf: 'flex-end' }}/>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center p-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">{subSubCategory}</Text>
        <Ionicons name="search" size={24} color="black" />
      </View>

      <View className="flex-row justify-between items-center px-4 mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity onPress={() => setSortModalVisible(true)} className="flex-row items-center p-2 border border-gray-300 rounded-full mr-2">
            <Ionicons name="filter" size={18} color="black" />
            <Text className="ml-2">Sort By</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Filter')} className="flex-row items-center p-2 border border-gray-300 rounded-full mr-2">
            <Ionicons name="options-outline" size={18} color="black" />
            <Text className="ml-2">Filter</Text>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity onPress={() => setIsGridView(!isGridView)}>
          <Ionicons name={isGridView ? "list" : "grid"} size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        // keyExtractor={(item) => item.id}
        renderItem={isGridView ? renderGridItem : renderListItem}
        numColumns={isGridView ? 2 : 1}
        key={isGridView ? 'grid' : 'list'}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        showsHorizontalScrollIndicator={false}
      />

      {/* Sort Modal */}
      <Modal visible={isSortModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black bg-opacity-50 justify-end">
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
        </View>
      </Modal>

      
    </SafeAreaView>
  );
};

export default CatalogScreen;
