import { View, Text, Image, TouchableOpacity, ImageSourcePropType, FlatList, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import icons from '../constants/icons';
import images from '../constants/images';
import { CustomSearch, ProductItem } from '../components';
import BASE_URL from '../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../constants/types';

type SubCategory = {
  name: string;
  image: string;
};

type User = {
  username: string;
  email: string;
  avatar: string;
};
type Props = {};

const HomeTab = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();


  type RootStackParamList = {
    Setting: undefined;
    ProductDetails: { itemDetails: Product };
    Categories: { subCategoryName: string };
    Catalog: {
      mainCategory: string;
      subCategoryName: string;
      subSubCategory: string;
      filters?: {
        selectedDiscount?: number;
        searchQuery?: string;
      };
    };
  };

  const NavigateToProfile = () => {
    navigation.navigate('Setting');
  };

  const handleSelectCategory = (subCategory: SubCategory) => {
    navigation.navigate('Categories', { subCategoryName: subCategory.name });
  }

  // Có thể có sản phẩm hoặc không
  const handleDealOff = () => {
    navigation.navigate('Catalog', {
      mainCategory: 'All',
      subCategoryName: 'New',
      subSubCategory: 'All',
      filters: {
        selectedDiscount: 40,
      },
    });
  }

  const handleViewAllNewArrival = () => {
    navigation.navigate('Catalog', {
      mainCategory: 'All',
      subCategoryName: 'New',
      subSubCategory: 'All',
    });
  };

  const handleSneaker = () => {
    navigation.navigate('Catalog', {
      mainCategory: 'All',
      subCategoryName: 'New',
      subSubCategory: 'Sneakers',
    });
  };

  const handleSummer = () => {
    navigation.navigate('Catalog', {
      mainCategory: 'All',
      subCategoryName: 'New',
      subSubCategory: 'All',
      filters: {
        searchQuery: 'Summer',
      },
    });
  }

  const [categories, setCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null); // Thêm state cho thông tin người dùng

  // Lấy thông tin người dùng (bao gồm avatar) từ server khi component tải

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const response = await axios.get(`${BASE_URL}/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const { username, email, avatar } = response.data as User;
          setUser({
            username,
            email,
            avatar: avatar ? `data:image/png;base64,${avatar}` : '', // Xử lý avatar với chuỗi Base64
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    }
  };


  const fetchCategories = async () => {
    try {
      const response = await axios.get<SubCategory[]>(`${BASE_URL}/products/sub-categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    }
  };



  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>(`${BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };


  console.log('categoriesData:', categories);

  const renderItem = ({ item }: { item: SubCategory }) => (
    <TouchableOpacity onPress={() => handleSelectCategory(item)}>
      <Image
        source={{ uri: item.image }}
        className='w-24 h-24 rounded-full'

      />
      <Text className='text-black-100/80 text-center text-lg font-medium'>{' '}{item.name}{' '}</Text>
    </TouchableOpacity>
  );
  // Hàm refresh toàn bộ trang
  const refreshHomePage = async () => {
    await fetchUserData();
    await fetchCategories();
    await fetchProducts();
  };

  // Gọi refreshHomePage khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      refreshHomePage();
    }, [])
  );
  return (
    <SafeAreaView>
      <ScrollView>
        {/* Header */}
        <View className='flex flex-row items-center justify-between mx-4'>
          <TouchableOpacity>
            <Image
              source={icons.menu}
              className='w-8 h-8'
              resizeMode='contain'>
            </Image>
          </TouchableOpacity>

          <Image
            source={images.logo}
            className='w-14 h-14'
            resizeMode='contain'>
          </Image>

          <TouchableOpacity onPress={NavigateToProfile}>
            <Image
              source={user?.avatar ? { uri: user.avatar } : icons.profile}
              className="w-8 h-8 rounded-full"
              resizeMode='cover'>
            </Image>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <CustomSearch initialQuery="" placeholder='Search any Product...' />

        {/* Features */}
        <Text className='text-2xl font-bold my-5 mx-4'>All Categories</Text>

        {/* Categories */}
        <View>
          <FlatList
            data={categories}
            renderItem={renderItem}
            // keyExtractor={(item) => `${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className='w-5' />}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </View>

        {/* Offer */}
        <View className='pb-5 mx-4'>
          <TouchableOpacity onPress={handleDealOff}>
            <Image
              source={images.deal_off}
              className='w-full mt-6 rounded-lg'
              resizeMode='cover'
            />
          </TouchableOpacity>
        </View>

        {/* New Product Banner */}
        <View className="bg-[#4392F9] rounded-xl justify-between flex flex-row mx-4 pl-5 py-5">
          <View>
            <Text className="text-white text-2xl font-semibold">
              New Product
            </Text>
            <Text className="text-white">
              Check out our latest products!
            </Text>
          </View>
          <TouchableOpacity onPress={handleViewAllNewArrival}>
            <View className="rounded-lg border-white border-2 mr-3 h-12 px-3 flex flex-row gap-x-px items-center">
              <Text className="text-white font-medium text-lg">View all</Text>
              <Image
                source={icons.show_all}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* New Product */}
        <View className="my-6">
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <ProductItem
                itemDetails={item}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-8" />}
            contentContainerStyle={{ paddingHorizontal: 17 }}
          />
        </View>

        {/* special Offer */}
        <View className="flex justify-between bg-white flex-row items-center py-3 px-4 mx-4 rounded-lg">
          <Image
            source={icons.offer}
            className="w-24 h-24"
            resizeMode="contain"
          />
          <View className="">
            <Text className="text-2xl mb-1 text-black-100 font-bold">
              Special Offers
            </Text>
            <Text className="text-neutral-500 text-base w-52">
              We make sure you get the offer you need at best prices
            </Text>
          </View>
        </View>

        {/* Sneaker */}
        <TouchableOpacity onPress={handleSneaker}>
          <View className="mt-6 mx-4">
            <Image
              source={images.sneaker}
              className="self-center w-full rounded-lg"
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>

        {/* Sneakers & Boots */}
        <View className="my-4">
          <FlatList
            data={products.filter(product => 
              product.subSubCategory === 'Sneakers' || product.subSubCategory === 'Boots'
            )}
            renderItem={({ item }) => (
              <ProductItem
                itemDetails={item}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-8" />}
            contentContainerStyle={{ paddingHorizontal: 17 }}
          />
        </View>

        {/* Hot Summer */}
        <TouchableOpacity onPress={handleSummer}>
          <View className="my-4 mx-4">
            <Image
              source={images.hot_summer}
              className="self-center w-full rounded-lg"
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeTab;