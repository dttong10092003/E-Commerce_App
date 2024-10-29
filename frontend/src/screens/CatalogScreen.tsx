import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Rating } from 'react-native-ratings';
import {ItemDetails} from '../constants/types';

type RootStackParamList = {
  CatalogScreen: { category: string };
  Filter: undefined;
  ProductDetails: {itemDetails: ItemDetails} | undefined;
};

type CatalogScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CatalogScreen'>;
type CatalogScreenRouteProp = RouteProp<RootStackParamList, 'CatalogScreen'>;

interface CatalogScreenProps {
  route: CatalogScreenRouteProp;
}

const products = [
  { id: '1', name: 'Pullover', price: '51$', image: 'https://picsum.photos/200', rating: 4.5 },
  { id: '2', name: 'Blouse', price: '34$', image: 'https://picsum.photos/200', rating: 4.0 },
  { id: '3', name: 'T-shirt', price: '12$', image: 'https://picsum.photos/200', rating: 4.2 },
  { id: '4', name: 'Shirt', price: '51$', image: 'https://picsum.photos/200', rating: 3.5 },
  { id: '5', name: 'Sweater', price: '70$', image: 'https://picsum.photos/200', rating: 4.8 },
];

const sortOptions = ['Popular', 'Newest', 'Customer review', 'Price: lowest to high', 'Price: highest to low'];

const CatalogScreen: React.FC<CatalogScreenProps> = ({ route }) => {
  const { category } = route.params;
  const navigation = useNavigation<CatalogScreenNavigationProp>();

  const [isGridView, setIsGridView] = useState(false);
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);

  const renderListItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { itemDetails: item })} className="flex-row bg-white p-4 my-2 rounded-lg shadow-sm">
      <Image source={{ uri: item.image }} className="w-20 h-20 rounded-lg" />
      <View className="ml-4 flex-1">
        <Text className="text-lg font-semibold">{item.name}</Text>
        <Rating type="custom" ratingCount={5} imageSize={20} startingValue={item.rating} readonly ratingBackgroundColor="#EEEEEE" style={{ marginVertical: 8, alignSelf: 'flex-start' }} />
        <Text className="text-lg font-bold">{item.price}</Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="heart-outline" size={24} color="gray" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderGridItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { itemDetails: item })} className="flex-1 m-2 bg-white p-4 rounded-lg shadow-sm">
      <Image source={{ uri: item.image }} className="w-full h-40 rounded-lg" />
      <Text className="text-lg font-semibold mt-2">{item.name}</Text>
      <Rating type="custom" ratingCount={5} imageSize={20} startingValue={item.rating} readonly ratingBackgroundColor="#EEEEEE" style={{ marginVertical: 8, alignSelf: 'flex-start' }} />
      <Text className="text-lg font-bold">{item.price}</Text>
      <TouchableOpacity>
        <Ionicons name="heart-outline" size={24} color="gray" style={{ alignSelf: 'flex-end'}}/>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center p-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">{category}</Text>
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
        keyExtractor={(item) => item.id}
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
