import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';


const FilterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All');
  const [priceRange, setPriceRange] = useState(500);

  // Hàm toggle chọn kích thước
  const toggleSizeSelection = (size: string) => {
    setSelectedSizes((prevSelectedSizes) => {
      if (prevSelectedSizes.includes(size)) {
        return prevSelectedSizes.filter((s) => s !== size);
      } else {
        return [...prevSelectedSizes, size];
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-4 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        </TouchableOpacity>
        <Text className="text-2xl font-bold ml-2">Filters</Text>
      </View>
      
      <ScrollView className="px-4">
        {/* Price Range */}
        <Text className="text-lg font-semibold mt-4">Price range</Text>
        <Slider
          minimumValue={0}
          maximumValue={1000}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value)}
          className="mt-2"
          minimumTrackTintColor="#FF3E3E"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#FF3E3E"
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text className="text-gray-1000">$0</Text>
          <Text className="text-gray-1000">${priceRange.toFixed(0)}</Text>
        </View>

        {/* Colors */}
        <Text className="text-lg font-semibold mt-4">Colors</Text>
        <View className="flex-row mt-2">
          {['#000000', '#FFFFFF', '#FF0000', '#D3BEBE', '#FFD700', '#0000FF'].map((color) => (
            <TouchableOpacity
              key={color}
              style={{
                backgroundColor: color,
                width: 30,
                height: 30,
                borderRadius: 15,
                margin: 4,
                borderWidth: selectedColor === color ? 2 : 0,
                borderColor: 'red',
              }}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>

        {/* Sizes */}
        <Text className="text-lg font-semibold mt-4">Sizes</Text>
        <View className="flex-row mt-2">
          {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
            <TouchableOpacity
              key={size}
              onPress={() => toggleSizeSelection(size)}
              style={{
                padding: 8,
                borderWidth: 1,
                borderRadius: 8, // Giảm độ tròn của border
                borderColor: selectedSizes.includes(size) ? 'red' : '#ddd',
                backgroundColor: selectedSizes.includes(size) ? 'red' : 'white',
                marginRight: 8,
              }}
            >
              <Text style={{ color: selectedSizes.includes(size) ? 'white' : 'black' }}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category */}
        <Text className="text-lg font-semibold mt-4">Category</Text>
        <View className="flex-row mt-2 flex-wrap">
          {['All', 'Women', 'Men', 'Boys', 'Girls'].map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={{
                padding: 8,
                borderWidth: 1,
                borderRadius: 8, // Giảm độ tròn của border
                borderColor: selectedCategory === category ? 'red' : '#ddd',
                backgroundColor: selectedCategory === category ? 'red' : 'white',
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: selectedCategory === category ? 'white' : 'black' }}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Discard and Apply Buttons */}
        <View className="flex-row mt-6 mb-4">
          <TouchableOpacity className="flex-1 bg-gray-300 py-4 rounded-full mr-2" onPress={() => navigation.goBack()}>
            <Text className="text-center text-black">Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-red-500 py-4 rounded-full ml-2" onPress={() => navigation.goBack()}>
            <Text className="text-center text-white">Apply</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FilterScreen;
