import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../config';
import { RootStackParamList } from '../constants/rootStackParamList';

type EditVariantProductRouteProp = RouteProp<RootStackParamList, 'EditVariantProduct'>;

const COLORS = [
  'Blue', 'Gray', 'Navy Blue', 'Dark Blue', 'Red', 'Yellow', 'Green', 'Black',
  'White', 'Beige', 'Brown', 'Gold', 'Silver', 'Pink',
];

const EditVariantProductScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<EditVariantProductRouteProp>();
  const { product } = route.params;

  const [variants, setVariants] = useState(product.variants || []);
  const [isColorModalVisible, setIsColorModalVisible] = useState(false);

  const handleInputChange = (index: number, field: string, value: string, sizeIndex?: number) => {
    setVariants((prevVariants) => {
      const updatedVariants = [...prevVariants];
      if (field === 'sizes' && sizeIndex !== undefined) {
        updatedVariants[index].sizes[sizeIndex].size = value;
      } else if (field === 'stock' && sizeIndex !== undefined) {
        updatedVariants[index].sizes[sizeIndex].stock = parseInt(value) || 0;
      } else {
        updatedVariants[index][field] = value;
      }
      return updatedVariants;
    });
  };

  const addNewSize = (index: number) => {
    setVariants((prevVariants) => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index].sizes.push({ size: '', stock: 0 });
      return updatedVariants;
    });
  };

  const removeSize = (index: number, sizeIndex: number) => {
    setVariants((prevVariants) => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index].sizes.splice(sizeIndex, 1);
      return updatedVariants;
    });
  };

  const removeColor = (index: number) => {
    setVariants((prevVariants) => prevVariants.filter((_, i) => i !== index));
  };

  const openColorModal = () => {
    setIsColorModalVisible(true);
  };

  const selectColor = (color: string) => {
    setVariants((prevVariants) => [
      ...prevVariants,
      { color, image: '', sizes: [{ size: '', stock: 0 }] },
    ]);
    setIsColorModalVisible(false);
  };

  const handleSaveVariants = async () => {
    for (const variant of variants) {
      if (!variant.color || variant.color.trim() === '') {
        Alert.alert('Error', 'All colors must have a valid name.');
        return;
      }
      if (!variant.image || variant.image.trim() === '') {
        Alert.alert('Error', `The color ${variant.color} must have an image URL.`);
        return;
      }
      for (const size of variant.sizes) {
        if (!size.size || size.size.trim() === '') {
          Alert.alert('Error', `The color ${variant.color} has a size that is missing a name.`);
          return;
        }
        if (size.stock === null || size.stock < 0) {
          Alert.alert('Error', `The color ${variant.color} has an invalid stock value.`);
          return;
        }
      }
    }

    try {
      console.log(`${BASE_URL}/products/${product._id}`)
      await axios.put(`${BASE_URL}/products/${product._id}`, { variants: variants });
      Alert.alert('Success', 'Variants updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating variants:', error);
      Alert.alert('Error', 'Failed to update variants.');
    }
  };

  const availableColors = COLORS.filter(
    (color) => !variants.some((variant: any) => variant.color === color)
  );

  return (
    <SafeAreaView className="px-4 flex-1">
      <View className="pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Edit Product Variants</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {variants.map((variant, index) => (
          <View key={index} className="bg-white p-4 mb-4 rounded-lg">
            {/* Color Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">{variant.color}</Text>
              <TouchableOpacity onPress={() => removeColor(index)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>

            {/* Color Image */}
            <TextInput
              placeholder="Image URL"
              value={variant.image}
              onChangeText={(value) => handleInputChange(index, 'image', value)}
              className="bg-gray-100 p-3 rounded-lg mb-4"
            />

            {/* Sizes and Stock */}
            {variant.sizes.map((sizeObj, sizeIndex) => (
              <View key={sizeIndex} className="flex-row items-center mb-3">
                {/* Size Input */}
                <TextInput
                  placeholder="Size"
                  value={sizeObj.size}
                  onChangeText={(value) => handleInputChange(index, 'sizes', value, sizeIndex)}
                  className="flex-1 bg-gray-100 p-3 rounded-lg mr-2"
                />
                {/* Stock Input */}
                <TextInput
                  placeholder="Stock"
                  value={sizeObj.stock.toString()}
                  onChangeText={(value) => handleInputChange(index, 'stock', value, sizeIndex)}
                  keyboardType="numeric"
                  className="flex-1 bg-gray-100 p-3 rounded-lg mr-2"
                />
                {/* Remove Size */}
                <TouchableOpacity onPress={() => removeSize(index, sizeIndex)}>
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add New Size */}
            <TouchableOpacity
              onPress={() => addNewSize(index)}
              className="bg-blue-500 p-3 rounded-lg items-center"
            >
              <Text className="text-white">Add Size</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Add New Color */}
        <TouchableOpacity
          onPress={openColorModal}
          className="bg-green-500 p-3 rounded-lg items-center mb-4"
        >
          <Text className="text-white">Add New Color</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSaveVariants}
        className="bg-blue-500 p-4 rounded-lg items-center"
      >
        <Text className="text-white font-bold">Save Variants</Text>
      </TouchableOpacity>

      {/* Color Selection Modal */}
      <Modal visible={isColorModalVisible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View className="bg-white p-6 rounded-lg w-4/5">
            <Text className="text-lg font-bold mb-4">Select Color</Text>
            <FlatList
              data={availableColors}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectColor(item)}
                  className="p-3 mb-2 bg-gray-200 rounded-lg"
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setIsColorModalVisible(false)}
              className="mt-4 p-3 bg-red-500 rounded-lg items-center"
            >
              <Text className="text-white">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EditVariantProductScreen;
