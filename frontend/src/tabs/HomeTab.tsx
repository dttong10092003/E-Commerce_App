import {View, Text, Image, TouchableOpacity, ImageSourcePropType, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import icons from '../constants/icons';
import images from '../constants/images';
import { CustomSearch, ProductItem } from '../components';
import { CategoriesData, ProductData } from '../constants/data';
import BASE_URL from '../config';
import axios from 'axios';

type SubCategory = {
  name: string;
  image: string;
};

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
  reviews: number;
  ratings: Ratings;
  createdAt: string;
};

type Props = {};

const HomeTab = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  type RootStackParamList = {
    Setting: undefined;
    ProductDetails: { itemDetails: Product };
    Categories: { subCategoryName: string };
  };

  const NavigateToProfile = () => {
    navigation.navigate('Setting');
  };

  const handleSelectCategory = (subCategory: SubCategory) => {
    // Xu ly chuyen sang trang category duoc chon
    navigation.navigate('Categories', { subCategoryName: subCategory.name });
  }

  const handleDealOff = () => {
    // Xu ly chuyen sang trang deal off
  }

  const handleViewAllNewArrival = () => {
    // Xu ly chuyen sang trang new arrival
  };

  const [categories, setCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<SubCategory[]>(`${BASE_URL}/products/sub-categories`);
        // const response = await axios.get<SubCategory[]>("http://192.168.1.2:4000/api/products/sub-categories");
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(`${BASE_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  console.log('categoriesData:', categories);

  const renderItem = ({item}: { item: SubCategory}) => (
      <TouchableOpacity onPress={() => handleSelectCategory(item)}>
        <Image
          source={{uri: item.image}}
          className='w-24 h-24 rounded-full'              

        />
        <Text className='text-black-100/80 text-center text-lg font-medium'>{' '}{item.name}{' '}</Text>
      </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <ScrollView>
        {/* Header */}
        <View className='flex flex-row items-center justify-between mx-5'>
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
              source={icons.profile}
              className='w-8 h-8'
              resizeMode='contain'>         
            </Image>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <CustomSearch initialQuery="" />

        {/* Features */}
        <Text className='text-2xl font-bold my-5 mx-5'>All Categories</Text>          

        {/* Categories */}
        <View>
        <FlatList
            data={categories}
            renderItem={renderItem}
            // keyExtractor={(item) => `${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className='w-5'/>}
            contentContainerStyle={{paddingHorizontal: 20}}
          />
        </View>

        {/* Offer */}
        <View className='pb-5 mx-5'> 
          <TouchableOpacity onPress={handleDealOff}>
            <Image
                source={images.deal_off}
                className='w-full mt-6 rounded-lg'
                resizeMode='cover'
            />
          </TouchableOpacity>
        </View>

        {/* New Product Banner */}
        <View className="bg-[#4392F9] rounded-xl justify-between flex flex-row mx-5 pl-5 py-5">
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
            renderItem={({item}) => (
            <ProductItem
              itemDetails={item}
            />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-8" />}
            contentContainerStyle={{paddingHorizontal: 20}}
          />
        </View>

        {/* special Offer */}
        <View className="flex justify-between bg-white flex-row items-center py-3 px-4 mx-5 rounded-lg">
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

        {/* Flat Shoes Offer */}
        <TouchableOpacity>
          <View className="my-5 mx-5">
            <Image
              source={images.flat}
              className="self-center w-full rounded-lg"
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>

        {/* Product */}
        <View className="my-6">
          <FlatList
            data={products}
            renderItem={({item}) => (
            <ProductItem
              itemDetails={item}
            />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-8" />}
            contentContainerStyle={{paddingHorizontal: 20}}
          />
        </View>

        {/* Hot Summer */}
        <TouchableOpacity>
          <View className="my-5 mx-5">
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