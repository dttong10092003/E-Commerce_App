import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import BASE_URL from '../config';
import { Product } from '../constants/types';
import { RootStackParamList } from '../constants/rootStackParamList';

const ProductManagement = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [subSubCategories, setSubSubCategories] = useState<string[]>([]);
    const [selectedSubSubCategory, setSelectedSubSubCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

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

    // Lọc sản phẩm theo danh mục và từ khóa
    const filterProducts = useCallback(() => {
        let filtered = products;

        if (selectedSubSubCategory !== 'All') {
            filtered = filtered.filter((product) => product.subSubCategory === selectedSubSubCategory);
        }

        if (searchQuery.trim() !== '') {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    }, [products, selectedSubSubCategory, searchQuery]);

    // Gọi lại hàm filter mỗi khi state thay đổi
    useEffect(() => {
        filterProducts();
    }, [filterProducts]);

    // Navigate to Add Product screen
    const navigateToAddProduct = () => {
        navigation.navigate('AddProduct');
    };

    const navigateToEditProduct = () => {
        navigation.navigate('EditProduct', { product: selectedProduct });
        closeModal();
    };

    const navigateToEditVariantProduct = () => {
        if (selectedProduct) {
            navigation.navigate('EditVariantProduct', { product: selectedProduct });
        }
        closeModal();
    };

    const openModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setIsModalVisible(false);
        
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
            <TouchableOpacity className="mr-2" onPress={() => openModal(item)}>
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

            {/* Input tìm kiếm */}
            <TextInput
                placeholder="Search by product name"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="bg-white px-4 py-2 rounded-lg mb-4"
            />

            {/* SubSubCategory Filter */}
            <View className="flex-row flex-wrap justify-center mb-4">
                {subSubCategories.map((subSubCategory) => (
                    <TouchableOpacity
                        key={subSubCategory}
                        className={`px-4 py-2 rounded-full mr-2 mb-2 ${selectedSubSubCategory === subSubCategory ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                        onPress={() => setSelectedSubSubCategory(subSubCategory)}
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
                data={selectedSubSubCategory === 'All' && searchQuery.trim() === '' ? products : filteredProducts}
                keyExtractor={(item) => item._id}
                renderItem={renderProduct}
                showsVerticalScrollIndicator={false}
            />

            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableWithoutFeedback>
                            <View className="bg-white p-6 rounded-lg w-4/5">
                                <Text className="text-lg font-bold mb-4">Choose Action</Text>
                                <TouchableOpacity
                                    className="bg-blue-500 p-3 rounded-lg mb-4"
                                    onPress={navigateToEditProduct}
                                >
                                    <Text className="text-white text-center">Edit Product</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-green-500 p-3 rounded-lg"
                                    onPress={navigateToEditVariantProduct}
                                >
                                    <Text className="text-white text-center">Edit Variant Product</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="mt-4"
                                    onPress={closeModal}
                                >
                                    <Text className="text-center text-red-500">Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

export default ProductManagement;
