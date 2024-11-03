import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BASE_URL from '../config';
import axios from 'axios';

// Định nghĩa RootStackParamList tại đây để đơn giản hoá
type RootStackParamList = {
  Categories: { mainCategory?: string; subCategoryName: string };
  Catalog: { mainCategory: string; subCategoryName: string; subSubCategory: string };
};

// Định nghĩa kiểu cho navigation và route
type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Categories'>;
type CategoriesScreenRouteProp = RouteProp<RootStackParamList, 'Categories'>;

interface CategoriesScreenProps {
  route: CategoriesScreenRouteProp;
}

// const subCategories = [
//   'Tops', 'Shirts & Blouses', 'Cardigans & Sweaters', 'Knitwear', 'Blazers', 'Outerwear', 'Pants', 'Jeans', 'Shorts', 'Skirts', 'Dresses'
// ];

const CategoriesScreen: React.FC<CategoriesScreenProps> = ({ route }) => {

  const navigation = useNavigation<CategoriesScreenNavigationProp>();
  const { mainCategory = 'All', subCategoryName } = route.params;
  // const { mainCategory, subCategoryName } = route.params;

  // State để lưu danh sách subSubCategory
  const [subSubCategories, setSubSubCategories] = useState<string[]>([]);

  useEffect(() => {
    // Hàm gọi API để lấy danh sách subSubCategory theo subCategoryName
    const fetchSubSubCategories = async () => {
      try {
        // const response = await axios.get<string[]>(`<API_URL>/subcategories/${subCategoryName}/sub-subcategories`);
        const response = await axios.get<string[]>(`${BASE_URL}/products/${mainCategory}/${subCategoryName}/sub-subcategories`);
        setSubSubCategories(response.data); // Giả sử API trả về một mảng các subSubCategory
      } catch (error) {
        console.error('Lỗi khi lấy subSubCategory:', error);
      }
    };

    fetchSubSubCategories();
  }, [mainCategory, subCategoryName]); // Chỉ gọi lại API khi subCategoryName thay đổi

  console.log('mainCategory:', mainCategory);
  console.log('subCategoryName:', subCategoryName);
  console.log('subSubCategories:', subSubCategories);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pb-4 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-3xl font-bold ml-2">{subCategoryName}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
        <TouchableOpacity className="bg-red-500 rounded-full py-3 mb-6 items-center">
          <Text className="text-white font-semibold">VIEW ALL ITEMS</Text>
        </TouchableOpacity>

        {subSubCategories.map((subSubCategory) => (
          <TouchableOpacity
            key={subSubCategory}
            className="bg-white p-4 border-b border-gray-200"
            onPress={() => navigation.navigate('Catalog', { mainCategory: mainCategory, subCategoryName: subCategoryName, subSubCategory: subSubCategory })}
          >
            <Text className="text-lg font-semibold">{subSubCategory}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoriesScreen;
