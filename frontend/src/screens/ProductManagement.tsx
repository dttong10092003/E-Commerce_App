import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; 
import BASE_URL from '../config';
import { Product } from '../constants/types';


type RootStackParamList = {
    AddProduct: undefined;
    EditProduct: { product: Product };
};

const ProductManagement = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [subSubCategories, setSubSubCategories] = useState<string[]>([]);
    const [selectedSubSubCategory, setSelectedSubSubCategory] = useState<string>('All');

    // Fetch products from the server
    const fetchProducts = async () => {
        try {
            const response = await axios.get<Product[]>(`${BASE_URL}/products`);
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const fetchSubSubCategories = async () => {
        try {
            const response = await axios.get<string[]>(`${BASE_URL}/products/All/New/sub-subcategories`);
            setSubSubCategories(['All', ...response.data]);
        } catch (error) {
            console.error('Failed to fetch subsubcategories:', error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchSubSubCategories();
            fetchProducts();          
        }, [])
    );

    // Filter products based on selected subSubCategory
    const filterBySubSubCategory = (subSubCategory: string) => {
        setSelectedSubSubCategory(subSubCategory);
        if (subSubCategory !== 'All') {
            const filtered = products.filter((product) => product.subSubCategory === subSubCategory);
            setFilteredProducts(filtered);
        }
    };

    // Navigate to Add Product screen
    const navigateToAddProduct = () => {
        navigation.navigate('AddProduct');
    };

    // Navigate to Edit Product screen with product ID
    const navigateToEditProduct = (product: Product) => {
        navigation.navigate('EditProduct', { product });
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <View className="flex-row bg-white rounded-lg mb-3 items-center">
          {/* Product Image */}
          <Image source={{ uri: item.images[0] }} className="w-16 h-24 rounded-bl-lg rounded-tl-lg mr-4" />
      
          {/* Product Information */}
          <View className="flex-1">
            {/* Product Name */}
            <Text numberOfLines={1} className="text-lg font-semibold">{item.name}</Text>
            
            {/* SubSubCategory */}
            <Text className="text-sm text-gray-500">{item.subSubCategory}</Text>
            
            
            {/* Pricing Information */}
            <View className="flex-row items-center">
              <Text className="text-blue-600 font-semibold">Sale Price: ${item.salePrice.toFixed(2)}</Text>
              {item.discount > 0 && (
                <Text className="text-red-500 text-sm ml-2">({item.discount}% OFF)</Text>
              )}
            </View>
            
            {/* Original Price */}
            <Text className="text-gray-500 text-xs">Original Price: ${item.importPrice.toFixed(2)}</Text>
          </View>
      
          {/* Edit Icon */}
          <TouchableOpacity className='mr-2' onPress={() => navigateToEditProduct(item)}>
            <Ionicons name="pencil" size={24} color="blue" />
          </TouchableOpacity>
        </View>
      );

    return (
        <SafeAreaView className="flex-1 px-4 bg-gray-100">
            <View className='flex-row justify-between mb-2'>
                <View className="pb-2 flex-row items-center">
                    <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
                    <Text className="text-2xl font-bold ml-2">Product Management</Text>
                </View>
                <TouchableOpacity className="bg-blue-500 py-2 px-2 rounded-full" onPress={navigateToAddProduct}>
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* SubSubCategory Filter */}
            <View className="flex-row flex-wrap justify-center mb-4">
                {subSubCategories.map((subSubCategory) => (
                    <TouchableOpacity
                        key={subSubCategory}
                        className={`px-4 py-2 rounded-full mr-2 mb-2 ${selectedSubSubCategory === subSubCategory ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                        onPress={() => filterBySubSubCategory(subSubCategory)}
                    >
                        <Text
                            className={`${selectedSubSubCategory === subSubCategory ? 'text-white' : 'text-black'
                                }`}
                        >
                            {subSubCategory}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Product List */}
            <FlatList
                data={selectedSubSubCategory === 'All' ? products : filteredProducts}
                keyExtractor={(item) => item._id}
                renderItem={renderProduct}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default ProductManagement;
