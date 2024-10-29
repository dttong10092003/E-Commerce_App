import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// type RootStackParamList = {
//     Categories: { mainCategory: string };
// };

// type SearchTabNavigationProp = StackNavigationProp<RootStackParamList, 'Categories'>;

const filterCategories = ['All', 'Men', 'Women', 'Kids'];
const subCategories = [
  { name: 'New', image: 'https://picsum.photos/200' },
  { name: 'Clothes', image: 'https://picsum.photos/200' },
  { name: 'Shoes', image: 'https://picsum.photos/200' },
  { name: 'Accessories', image: 'https://picsum.photos/200' },
];

const SearchTab: React.FC = () => {

    type RootStackParamList = {
        Categories: { mainCategory: string };
    };
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [selectedFilter, setSelectedFilter] = useState<string>('All');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="text-2xl font-bold px-4">Shop</Text>

      {/* Filter Categories (All, Men, Women, Kids) */}
      <View className="flex-row justify-around p-4">
        {filterCategories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedFilter(category)} // chỉ set bộ lọc mà không điều hướng
            style={{ borderBottomWidth: selectedFilter === category ? 2 : 0, borderBottomColor: 'red' }}
          >
            <Text className={`text-lg font-semibold ${selectedFilter === category ? 'text-red-500' : 'text-black'}`}>
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
            onPress={() => navigation.navigate('Categories', { mainCategory: item.name })}
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
