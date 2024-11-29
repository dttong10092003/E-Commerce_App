import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import BASE_URL from '../config';
import axios from 'axios';

type SubCategory = {
  name: string;
  image: string;
};


const SearchTab: React.FC = () => {

    type RootStackParamList = {
      Categories: { subCategoryName: string, mainCategory: string };
    };
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [selectedMainCategory, setSelectedMainCategory] = useState<string>('All');
    const [mainCategories, setMainCategories] = useState<string[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchMainCategories = async () => {
          try {
              const response = await axios.get<string[]>(`${BASE_URL}/products/main-categories`);
              setMainCategories(['All', ...response.data]); // Add 'All' to the beginning of the list
          } catch (error) {
              console.error('Error fetching main categories:', error);
          }
      };

      const fetchSubCategories = async () => {
          try {
              const response = await axios.get<SubCategory[]>(`${BASE_URL}/products/sub-categories`);
              // setSubCategories(response.data);
              setSubCategories([{ name: 'New', image: 'https://i.postimg.cc/pLS9CRYM/new.png' }, ...response.data]);
          } catch (error) {
              console.error('Error fetching sub-categories:', error);
          }
      };

      const fetchData = async () => {
          // setLoading(true);
          await Promise.all([fetchMainCategories(), fetchSubCategories()]);
          // setLoading(false);
      };
      
      fetchData();
  }, []);
  

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="text-2xl font-bold px-4">Shop</Text>

      {/* Filter Categories (All, Men, Women, Kids) */}
      <View className="flex-row justify-around p-4">
        {mainCategories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedMainCategory(category)} // chỉ set bộ lọc mà không điều hướng
            style={{ borderBottomWidth: selectedMainCategory === category ? 2 : 0, borderBottomColor: 'red' }}
          >
            <Text className={`text-lg font-semibold ${selectedMainCategory === category ? 'text-red-500' : 'text-black'}`}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sub Categories with Navigation (New, Clothes, Shoes, Accessories) */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
        {subCategories.map((item) => (
          <TouchableOpacity
            key={item.name}
            className="bg-white rounded-lg shadow-sm mb-4 flex-row items-center border border-gray-200"
            style={{ padding: 16 }}
            onPress={() => navigation.navigate('Categories', { subCategoryName: item.name, mainCategory: selectedMainCategory })}
          >
            <Image source={{ uri: item.image }} className="w-16 h-16 rounded-md mr-4" />
            <Text className="text-lg font-semibold">{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchTab;
