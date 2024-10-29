import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Định nghĩa RootStackParamList tại đây để đơn giản hoá
type RootStackParamList = {
  Categories: { mainCategory: string };
  Catalog: { category: string };
};

// Định nghĩa kiểu cho navigation và route
type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Categories'>;
type CategoriesScreenRouteProp = RouteProp<RootStackParamList, 'Categories'>;

interface CategoriesScreenProps {
  route: CategoriesScreenRouteProp;
}

const subCategories = [
  'Tops', 'Shirts & Blouses', 'Cardigans & Sweaters', 'Knitwear', 'Blazers', 'Outerwear', 'Pants', 'Jeans', 'Shorts', 'Skirts', 'Dresses'
];

const CategoriesScreen: React.FC<CategoriesScreenProps> = ({ route }) => {


    // type RootStackParamList = {
    //     Categories: { mainCategory: string };
    //     Catalog: { category: string };
    // };
    // const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const navigation = useNavigation<CategoriesScreenNavigationProp>();
  const { mainCategory } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pb-4 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-3xl font-bold ml-2">{mainCategory}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
        <TouchableOpacity className="bg-red-500 rounded-full py-3 mb-6 items-center">
          <Text className="text-white font-semibold">VIEW ALL ITEMS</Text>
        </TouchableOpacity>

        {subCategories.map((category) => (
          <TouchableOpacity
            key={category}
            className="bg-white p-4 border-b border-gray-200"
            onPress={() => navigation.navigate('Catalog', { category })}
          >
            <Text className="text-lg font-semibold">{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoriesScreen;
