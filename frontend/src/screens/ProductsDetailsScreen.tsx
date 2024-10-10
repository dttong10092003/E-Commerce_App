import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useRef } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, FlatList, Animated, Dimensions } from 'react-native';
import icons from '../constants/icons';
import { RouteTabsParamList } from './HomeScreen';
import { RouteStackParamList } from '../../App';

const { width } = Dimensions.get('window');

type ScreenRouteProps = RouteProp<RouteStackParamList, 'ProductDetails'>;

type ProductDetailsProps = {
  route: ScreenRouteProps;
};

const ProductsDetailsScreen: React.FC<ProductDetailsProps> = ({ route }) => {
  const { itemDetails } = route.params || {};
  const navigation = useNavigation<StackNavigationProp<RouteTabsParamList, 'Cart'>>();
  const [selectedSize, setSelectedSize] = useState<number | null>(40); // Default selected size
  const [selectedColor, setSelectedColor] = useState<string>('red'); // Default selected color
  const [quantity, setQuantity] = useState<number>(1); // Default quantity
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Current image index

  const colors = ['red', 'yellow', 'blue', 'black', 'white'];

  const images = [
    'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/dc16a201-3c3c-4ba6-815e-26da4030dd35/W+PEGASUS+TRAIL+5+GTX.png',
    'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2dbee938-c814-4f63-9995-b52fbc851bb6/W+PEGASUS+TRAIL+5+GTX.png',
    'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/8589a490-f175-4c2e-ab5f-cd1a4fde4c2e/W+PEGASUS+TRAIL+5+GTX.png',
    'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/fdf0cfaf-29e2-455f-8f34-0577ce7f78c5/W+PEGASUS+TRAIL+5+GTX.png',
    'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/26e88cb3-a856-40e8-a256-a33861691188/W+PEGASUS+TRAIL+5+GTX.png',
  ];

  const scrollX = useRef(new Animated.Value(0)).current;

  const GoBack = () => {
    navigation.goBack();
  };

  const NavigateToCart = () => {
    navigation.navigate('Cart', { itemDetails: itemDetails!, selectedColor, selectedSize, quantity });
  };

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View className="flex-1">
      {/* Header - Fixed at the top */}
      <View className="absolute top-0 left-0 right-0 px-4 py-3  flex flex-row justify-between items-center z-10 mt-8 ">
        <TouchableOpacity onPress={GoBack}>
          <Image source={icons.next1} className="rotate-180 w-8 h-8" resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity onPress={NavigateToCart}>
          <Image source={icons.cart} className="w-6 h-6" resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* ScrollView */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 60 }} className="pt-5 px-4 bg-white">
        {/* Product Image Slider */}
        <View className="">
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToAlignment="center" // Ensure snapping to the center of each image
            snapToInterval={width} // Snap each image to fill the screen width
            decelerationRate="fast" // Smooth scroll behavior
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false, listener: handleScroll }
            )}
            renderItem={({ item }) => (
              <View style={{ width }}>
                <Image
                  source={{ uri: item }}
                  style={{ height: 300, width: width, resizeMode: 'cover' }} // Adjust size here
                />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          {/* Pagination Dots */}
          <View className="absolute bottom-2 left-0 right-0 flex flex-row justify-center">
            {images.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: 4,
                  backgroundColor: currentIndex === index ? 'blue' : 'gray',
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        </View>

        {/* Product Details */}
        <View className="mt-6">
          <Text className="text-3xl font-bold text-gray-900 mt-2">{itemDetails?.title || 'Nike Pegasus Trail 5'}</Text>
          <Text className="text-gray-500 font-medium  mt-2 leading-relaxed">
            Air Jordan is an American brand of basketball shoes, athletic, casual, and style clothing produced by Nike.
          </Text>
          {/* Price Details */}
          <View className="flex flex-row items-center gap-x-2 mt-4">
            {/* Giá hiện tại */}
            <Text className="text-2xl font-bold text-gray-900">
              ${itemDetails?.price || '200.00'}
            </Text>

            {/* Giá trước khi giảm */}
            <Text className="text-xl font-thin text-gray-500 line-through">
              ${itemDetails?.priceBeforeDeal || '250.00'}
            </Text>
          </View>
        </View>

        {/* Size Selection */}
        <View className="mt-5">
          <Text className="text-lg font-semibold text-gray-700">Size</Text>

          {/* Sizes */}
          <View className="flex flex-row justify-between items-center mt-3">
            {[38, 39, 40, 41, 42, 43].map(size => (
              <TouchableOpacity
                key={size}
                onPress={() => setSelectedSize(size)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedSize === size ? 'bg-blue-500' : 'bg-gray-200'
                  } shadow-md`}
              >
                <Text className={`${selectedSize === size ? 'text-white' : 'text-gray-900'}`}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color and Quantity Selection */}
        <View className="mt-6 flex flex-row justify-between items-center">
          {/* Color Selection */}
          <View>
            <Text className="text-lg font-semibold text-gray-700">Colors available</Text>
            <View className="flex flex-row mt-4 space-x-2">
              {colors.map(color => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${selectedColor === color ? 'border-2 border-blue-500' : 'border border-gray-300'
                    } shadow-md`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <Text className="text-white text-xs">✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantity Selection */}
          <View>
            <Text className="text-lg font-semibold text-gray-700">Quantity</Text>
            <View className="flex flex-row items-center mt-4">
              <TouchableOpacity
                onPress={handleDecrease}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 shadow-md"
              >
                <Text className="text-lg font-bold text-gray-600">-</Text>
              </TouchableOpacity>
              <Text className="mx-4 text-lg font-medium">{quantity}</Text>
              <TouchableOpacity
                onPress={handleIncrease}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 shadow-md"
              >
                <Text className="text-lg font-bold text-gray-600">+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Price and Add to Cart Button - Sticky at Bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3 shadow-lg flex flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-gray-900">${itemDetails?.finalPrice || '200.00'}</Text>
        <TouchableOpacity className="bg-blue-500 py-3 px-8 rounded-full shadow-lg" onPress={NavigateToCart}>
          <Text className="text-white font-semibold text-lg tracking-wider">Add To Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductsDetailsScreen;
