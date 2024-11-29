import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../config';
import { Ionicons } from '@expo/vector-icons';
import { subCategoryImages } from '../constants/subCategoryImages';

type EditProductRouteProp = RouteProp<{ params: { product: any } }, 'params'>;

const EditProductScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<EditProductRouteProp>();
  const { product } = route.params;

  const [name, setName] = useState(product.name || '');
  const [description, setDescription] = useState(product.description || '');
  const [importPrice, setImportPrice] = useState(product.importPrice.toString() || '');
  const [salePrice, setSalePrice] = useState(product.salePrice.toString() || '');
  const [discount, setDiscount] = useState(product.discount.toString() || '0');

  const [mainCategory, setMainCategory] = useState(product.mainCategory || null);
  const [subCategory, setSubCategory] = useState(product.subCategory.name || null);
  const [subSubCategory, setSubSubCategory] = useState(product.subSubCategory || null);

  const [mainCategoryOpen, setMainCategoryOpen] = useState(false);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [subSubCategoryOpen, setSubSubCategoryOpen] = useState(false);

  const [productImages, setProductImages] = useState({
    image1: product.images[0] || '',
    image2: product.images[1] || '',
    image3: product.images[2] || '',
    image4: product.images[3] || '',
    image5: product.images[4] || '',
  });

  const MAIN_CATEGORIES = ['Men', 'Women', 'Kids'];

  const SUB_CATEGORIES: Record<string, string[]> = {
    Clothes: ['Blazers', 'Pants', 'Jeans', 'Shorts', 'Shirts', 'Dresses', 'Jackets', 'Coats', 'Hoodies', 'Cardigans'],
    Shoes: ['Sneakers', 'Boots', 'Sandals', 'Formal Shoes'],
    Accessories: ['Bags', 'Belts', 'Hats', 'Jewelry', 'Sunglasses', 'Necklaces', 'Earrings', 'Bracelets', 'Rings'],
    Activewear: ['Yoga Pants', 'Shorts', 'Sports Bras', 'Tracksuits'],
    Swimwear: ['Bikinis', 'One-Piece', 'Swim Trunks', 'Cover-Ups'],
    Undergarments: ['Bras', 'Briefs', 'Boxers', 'Socks'],
  };

  const handleUpdateProduct = async () => {
    if (!name.trim() || !description.trim() || !importPrice.trim() || !salePrice.trim()) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    const importPriceValue = parseFloat(importPrice);
    const salePriceValue = parseFloat(salePrice);
    const discountValue = parseFloat(discount) || 0;

    if (isNaN(importPriceValue) || isNaN(salePriceValue)) {
      Alert.alert('Error', 'Import price and sale price must be valid numbers.');
      return;
  }

    if (discountValue > 50) {
      Alert.alert('Error', 'Discount cannot exceed 50%.');
      return;
    }

    if (!mainCategory || !subCategory || !subSubCategory) {
      Alert.alert('Error', 'Please select all categories (main, sub, sub-sub).');
      return;
    }

    const imageValues = Object.values(productImages).filter(image => image.trim() !== '');
    if (imageValues.length === 0) {
        Alert.alert('Error', 'Please provide at least one product image.');
        return;
    }

    const updatedProduct = {
      name: name.trim(),
      description: description.trim(),
      importPrice: importPriceValue,
      salePrice: salePriceValue,
      discount: discountValue,
      mainCategory: mainCategory,
      subCategory: {
        name: subCategory,
        image: subCategoryImages[subCategory] || `https://picsum.photos/200?${subCategory.toLowerCase()}`
      },
      subSubCategory: subSubCategory,
      images: imageValues,
    };

    try {
      await axios.put(`${BASE_URL}/products/${product._id}`, updatedProduct);
      Alert.alert('Success', 'Product updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update product.');
    }
  };

  return (
    <SafeAreaView className="px-4 flex-1">
      <View className="pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Edit Product</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}>
        <TextInput placeholder="Product Name" value={name} onChangeText={setName} className="bg-white p-4 rounded-lg mb-4" />
        <TextInput placeholder="Description" value={description} onChangeText={setDescription} className="bg-white p-4 rounded-lg mb-4" />
        <TextInput placeholder="Import Price" value={importPrice} onChangeText={setImportPrice} className="bg-white p-4 rounded-lg mb-4" />
        <TextInput placeholder="Sale Price" value={salePrice} onChangeText={setSalePrice} className="bg-white p-4 rounded-lg mb-4" />
        <TextInput placeholder="Discount" value={discount} onChangeText={setDiscount} className="bg-white p-4 rounded-lg mb-4" />

        <Text className="font-bold mb-2">Product Images</Text>
        {Object.keys(productImages).map((key, index) => (
          <TextInput
            key={index}
            placeholder={`Image ${index + 1} URL`}
            value={productImages[key]}
            onChangeText={(value) =>
              setProductImages((prev) => ({ ...prev, [key]: value }))
            }
            className="bg-white p-4 rounded-lg mb-4"
          />
        ))}
      </ScrollView>

        <Text className="font-bold mb-2">Main Category</Text>
        <DropDownPicker
          multiple={false}
          open={mainCategoryOpen}
          value={mainCategory}
          items={MAIN_CATEGORIES.map((category) => ({ label: category, value: category }))}
          placeholder="Select Main Category"
          setOpen={setMainCategoryOpen}
          setValue={setMainCategory}
          onOpen={() => {
            setSubCategoryOpen(false);
            setSubSubCategoryOpen(false);
          }}
          style={{
            marginBottom: 16,
            backgroundColor: 'white',
            borderRadius: 8,
          }}
          zIndex={3000}
        />

        <Text className="font-bold mb-2">Sub Category</Text>
        <DropDownPicker
          multiple={false}
          open={subCategoryOpen}
          value={subCategory}
          items={Object.keys(SUB_CATEGORIES).map((category) => ({
            label: category,
            value: category,
          }))}
          placeholder="Select Sub Category"
          setOpen={setSubCategoryOpen}
          setValue={setSubCategory}
          onOpen={() => {
            setMainCategoryOpen(false);
            setSubSubCategoryOpen(false);
          }}
          style={{
            marginBottom: 16,
            backgroundColor: 'white',
            borderRadius: 8,
          }}
          zIndex={2000}
        />

        <Text className="font-bold mb-2">Sub SubCategory</Text>
        <DropDownPicker
          multiple={false}
          open={subSubCategoryOpen}
          value={subSubCategory}
          items={(subCategory ? SUB_CATEGORIES[subCategory] : []).map((sub) => ({
            label: sub,
            value: sub,
          }))}
          placeholder="Select Sub SubCategory"
          setOpen={setSubSubCategoryOpen}
          setValue={setSubSubCategory}
          onOpen={() => {
            setMainCategoryOpen(false);
            setSubCategoryOpen(false);
          }}
          style={{
            marginBottom: 16,
            backgroundColor: 'white',
            borderRadius: 8,
          }}
          zIndex={1000}
        />
      

      <TouchableOpacity onPress={handleUpdateProduct} className="bg-blue-500 p-4 rounded-lg items-center">
        <Text className="text-white font-bold">Update Product</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditProductScreen;
