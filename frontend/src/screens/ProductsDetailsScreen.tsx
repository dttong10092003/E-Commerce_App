import React, { useState, useRef } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, FlatList, Animated, Dimensions, Modal, Pressable } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteTabsParamList } from './HomeScreen';
import { RouteStackParamList } from '../../App';
import { AirbnbRating } from 'react-native-ratings'; // Import thêm AirbnbRating
import icons from '../constants/icons';

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
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const finalPrice = itemDetails.price * quantity;

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
  const NavigateToRatingsReviews = () => {
    navigation.navigate('RatingsReviews');
  };
  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  // Function to handle adding to cart (first show modal)
  const handleAddToCart = () => {
    setModalVisible(true); // Show modal to choose size
  };

  return (
    <View className="flex-1">
      {/* Header - Fixed at the top */}
      <View className="absolute top-0 left-0 right-0 px-4 py-3 flex flex-row justify-between items-center z-10 mt-8 ">
        <TouchableOpacity onPress={GoBack}>
          <Image source={icons.next1} className="rotate-180 w-8 h-8" resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
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
            snapToAlignment="center"
            snapToInterval={width}
            decelerationRate="fast"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false, listener: handleScroll }
            )}
            renderItem={({ item }) => (
              <View style={{ width }}>
                <Image
                  source={{ uri: item }}
                  style={{ height: 257, width: width, resizeMode: 'cover' }}
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
          {/* Price Details */}
          <View className="flex flex-row items-center gap-x-2 mt-4">
            <Text className="text-2xl font-bold text-gray-900">${itemDetails?.price || '200.00'}</Text>
            <Text className="text-xl font-thin text-gray-500 line-through">${itemDetails?.priceBeforeDeal || '250.00'}</Text>
          </View>

          {/* Rating and Number of Reviews */}
          <View className="flex flex-row items-center mb-3">
            <AirbnbRating count={5} defaultRating={itemDetails?.stars || 0} size={17} showRating={false} />
            <Text className="text-xl font-thin text-black-100/90 ml-3">
              {itemDetails?.numberOfReview || 0} Reviews
            </Text>
          </View>
          <Text className="text-gray-500 font-medium mt-2 leading-relaxed">
            {itemDetails?.description || 'Air Jordan is an American brand of basketball shoes, athletic, casual, and style clothing produced by Nike.'}
          </Text>


          <View className="mt-4">
            <TouchableOpacity
              className="py-4 flex flex-row justify-between items-center border-gray-300"
              onPress={NavigateToRatingsReviews}
            >
              <Text className="text-lg text-gray-800">Ratings & reviews</Text>
              <Text className="text-lg text-gray-400">{'>'}</Text>
            </TouchableOpacity>

            <TouchableOpacity className="py-4 flex flex-row justify-between items-center   border-gray-300">
              <Text className="text-lg text-gray-800">Shipping info</Text>
              <Text className="text-lg text-gray-400">{'>'}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-4 flex flex-row justify-between items-center border-gray-300">
              <Text className="text-lg text-gray-800">Support</Text>
              <Text className="text-lg text-gray-400">{'>'}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* Price and Add to Cart Button - Sticky at Bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3 shadow-lg flex flex-row items-center justify-between">
        <TouchableOpacity className="bg-blue-500 py-4 px-8 rounded-full shadow-lg w-full" onPress={handleAddToCart}>
          <Text className="text-white font-semibold text-center text-lg tracking-wider">Add To Cart</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for selecting size, quantity and showing price */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Background dim effect */}
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onPress={() => setModalVisible(false)} />

        <View className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-lg" style={{ height: '51%' }}>
          <Text className="text-lg font-semibold mb-4">Select size</Text>

          {/* Size Selection */}
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

          {/* Color and Quantity Selection - In the same row */}
          <View className="flex flex-row justify-between mt-6">
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

          {/* Final Price */}
          <View className="mt-6 flex flex-row justify-between items-center">
            <Text className="text-xl font-bold text-gray-900">Total Price: ${finalPrice}</Text>
          </View>

          {/* Add to Cart Button - Positioned at the bottom */}
          <TouchableOpacity
            className="bg-red-500 py-3 rounded-lg"
            onPress={() => setModalVisible(false)}
            style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}
          >
            <Text className="text-white text-center text-lg" onPress={NavigateToCart}>Add To Cart</Text>
          </TouchableOpacity>
        </View>
      </Modal>



    </View>
  );
};

export default ProductsDetailsScreen;