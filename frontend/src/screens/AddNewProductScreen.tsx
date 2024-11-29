import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../config';
import { Ionicons } from '@expo/vector-icons'; 
import { subCategoryImages } from '../constants/subCategoryImages';


const AddNewProductScreen = () => {
    const navigation = useNavigation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [importPrice, setImportPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [discount, setDiscount] = useState('0');

  const [mainCategory, setMainCategory] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [subSubCategory, setSubSubCategory] = useState<string | null>(null);

  const [mainCategoryOpen, setMainCategoryOpen] = useState(false);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [subSubCategoryOpen, setSubSubCategoryOpen] = useState(false);

  const [selectedColors, setSelectedColors] = useState({});
  const [productImages, setProductImages] = useState({
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    image5: ''
  });

  const COLORS = [
    'Blue', 'Gray', 'Navy Blue', 'Dark Blue', 'Red', 'Yellow', 'Green', 'Black', 
    'White', 'Beige', 'Brown', 'Gold', 'Silver', 'Pink'];

  const MAIN_CATEGORIES = ['Men', 'Women', 'Kids'];

  const SUB_CATEGORIES: Record<string, string[]> = {
    Clothes: ['Blazers', 'Pants', 'Jeans', 'Shorts', 'Shirts', 'Dresses', 'Jackets', 'Coats', 'Hoodies', 'Cardigans'],
    Shoes: ['Sneakers', 'Boots', 'Sandals', 'Formal Shoes'],
    Accessories: ['Bags', 'Belts', 'Hats', 'Jewelry', 'Sunglasses', 'Necklaces', 'Earrings', 'Bracelets', 'Rings'],
    Activewear: ['Yoga Pants', 'Shorts', 'Sports Bras', 'Tracksuits'],
    Swimwear: ['Bikinis', 'One-Piece', 'Swim Trunks', 'Cover-Ups'],
    Undergarments: ['Bras', 'Briefs', 'Boxers', 'Socks'],
  };

  const toggleColor = (color) => {
    setSelectedColors((prevColors) => ({
      ...prevColors,
      [color]: prevColors[color] ? null : { size: '', quantity: '', image: '' }
    }));
  };

  const handleInputChange = (color, field, value) => {
    setSelectedColors((prevColors) => ({
      ...prevColors,
      [color]: {
        ...prevColors[color],
        [field]: field === 'size' ? value.split(',').map(size => size.trim()) : value // Split and trim sizes
      }
    }));
  };
  
  const handleAddProduct = async () => {
    if (!name.trim() || !description.trim() || !importPrice.trim() || !salePrice.trim()) {
      Alert.alert('Error', 'Please fill all required fields (name, description, import price, sale price).');
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

    const selectedColorKeys = Object.keys(selectedColors).filter(color => selectedColors[color] !== null);
    if (selectedColorKeys.length === 0) {
        Alert.alert('Error', 'Please select at least one color.');
        return;
    }
  
    // Gather data from user inputs
    const productData = {
      name: name.trim(),
      description: description.trim(),
      importPrice: importPriceValue,
      salePrice: salePriceValue,
      discount: discountValue,
      mainCategory,
      subCategory: {
        name: subCategory,
        image: subCategoryImages[subCategory] || `https://picsum.photos/200?${subCategory.toLowerCase()}`
      },
      subSubCategory,
      images: imageValues,
      ratings: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }, 
      reviews: 0,
      variants: selectedColorKeys.map(color => ({
        color,
        image: selectedColors[color].image,
        sizes: selectedColors[color].size.map(size => ({
            size,
            stock: parseInt(selectedColors[color].quantity) || 0
        }))
      }))
    };

    try {
      await axios.post(`${BASE_URL}/products`, productData);
      Alert.alert('Success', 'Product added successfully!');

      setName('');
        setDescription('');
        setImportPrice('');
        setSalePrice('');
        setDiscount('0');
        setMainCategory(null);
        setSubCategory(null);
        setSubSubCategory(null);
        setProductImages({
            image1: '',
            image2: '',
            image3: '',
            image4: '',
            image5: ''
        });
        setSelectedColors({});
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product.');
    }  
    // Log the structured data
    console.log("Product Data:", JSON.stringify(productData, null, 2));
  };
  

  return (
   
      <SafeAreaView className="px-4 flex-1">
        <View className="pb-2 flex-row items-center">
            <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
            <Text className="text-2xl font-bold ml-2">Add New Product</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }} >
            {/* Name */}
            <TextInput
            placeholder="Product Name"
            value={name}
            onChangeText={setName}
            className="bg-white p-4 rounded-lg mb-4"
            />

            {/* Description */}
            <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            className="bg-white p-4 rounded-lg mb-4"
            />

            {/* Import Price */}
            <TextInput
            placeholder="Import Price"
            value={importPrice}
            onChangeText={setImportPrice}
            keyboardType="numeric"
            className="bg-white p-4 rounded-lg mb-4"
            />

            {/* Sale Price */}
            <TextInput
            placeholder="Sale Price"
            value={salePrice}
            onChangeText={setSalePrice}
            keyboardType="numeric"
            className="bg-white p-4 rounded-lg mb-4"
            />

            {/* Discount */}
            <TextInput
            placeholder="Discount (%)"
            value={discount}
            onChangeText={setDiscount}
            keyboardType="numeric"
            className="bg-white p-4 rounded-lg mb-4"
            />

            {/* Product Images */}
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Product Images</Text>
                {Object.keys(productImages).map((key, index) => (
                    <TextInput
                        key={index}
                        placeholder={`Image ${index + 1} URL`}
                        value={productImages[key]}
                        onChangeText={(value) =>
                            setProductImages((prev) => ({ ...prev, [key]: value }))
                        }
                        style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, marginBottom: 8 }}
                    />
                ))}

            {/* Colors Section */}
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Colors</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {COLORS.map((color) => (
                <TouchableOpacity
                key={color}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 10,
                    marginBottom: 10
                }}
                onPress={() => toggleColor(color)}
                >
                <View style={{
                    width: 20,
                    height: 20,
                    borderRadius: 3,
                    borderWidth: 1,
                    borderColor: 'gray',
                    backgroundColor: selectedColors[color] ? '#007AFF' : 'white',
                    marginRight: 5
                }} />
                <Text>{color}</Text>
                </TouchableOpacity>
            ))}
            </View>

            {/* Display fields for each selected color */}
            {Object.keys(selectedColors).map((color) => (
            selectedColors[color] && (
                <View key={color} style={{ marginTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{color}</Text>

                <TextInput
                    placeholder="Size"
                    value={selectedColors[color].size}
                    onChangeText={(value) => handleInputChange(color, 'size', value)}
                    style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, marginTop: 5 }}
                />

                <TextInput
                    placeholder="Quantity"
                    value={selectedColors[color].quantity}
                    onChangeText={(value) => handleInputChange(color, 'quantity', value)}
                    keyboardType="numeric"
                    style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, marginTop: 5 }}
                />

                <TextInput
                    placeholder="Image URL"
                    value={selectedColors[color].image}
                    onChangeText={(value) => handleInputChange(color, 'image', value)}
                    style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, marginTop: 5 }}
                />
                </View>
            )
            ))}

            
        </ScrollView>
        

        {/* Main Category */}
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

        {/* Sub Category */}
        <Text className="font-bold mb-2">Sub Category</Text>
        <DropDownPicker
          multiple={false}
          open={subCategoryOpen}
          value={subCategory}
          items={(mainCategory ? Object.keys(SUB_CATEGORIES) : []).map((category) => ({
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
          disabled={!mainCategory}
          style={{
            marginBottom: 16,
            backgroundColor: 'white',
            borderRadius: 8,
          }}
          zIndex={2000}
        />

        {/* Sub SubCategory */}
        <Text className="font-bold mb-2">Sub SubCategory</Text>
        <DropDownPicker
          multiple={false}
          open={subSubCategoryOpen}
          value={subSubCategory}
          items={(subCategory ? SUB_CATEGORIES[subCategory] : []).map((subSub) => ({
            label: subSub,
            value: subSub,
          }))}
          placeholder="Select Sub SubCategory"
          setOpen={setSubSubCategoryOpen}
          setValue={setSubSubCategory}
          onOpen={() => {
            setMainCategoryOpen(false);
            setSubCategoryOpen(false);
          }}
          disabled={!subCategory}
          style={{
            marginBottom: 16,
            backgroundColor: 'white',
            borderRadius: 8,
          }}
          zIndex={1000}
        />

        {/* Add Product Button */}
        <TouchableOpacity
          onPress={handleAddProduct}
          className="bg-blue-500 p-4 rounded-lg items-center"
        >
          <Text className="text-white font-bold">Add Product</Text>
        </TouchableOpacity>
      </SafeAreaView>
  );
};

export default AddNewProductScreen;
