import React, { useState, useRef, useEffect } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, FlatList, Animated, Dimensions, Modal, Pressable } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteTabsParamList } from './HomeScreen';
import { RouteStackParamList } from '../../App';
import { Rating } from 'react-native-ratings';
import icons from '../constants/icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { CategoriesData, ProductData } from '../constants/data';
import { colorMap } from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import axios from 'axios';


const { width } = Dimensions.get('window');

type Ratings = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

type WishlistType = {
  products: { _id: string }[];
};

type ScreenRouteProps = RouteProp<RouteStackParamList, 'ProductDetails'>;

type ProductDetailsProps = {
  route: ScreenRouteProps;
};

const ProductsDetailsScreen: React.FC<ProductDetailsProps> = ({ route }) => {
  const { itemDetails } = route.params; // nhận dữ liệu từ trang Catalog
  const navigation = useNavigation<StackNavigationProp<RouteTabsParamList, 'Cart'>>();
  
  const [userID, setUserID] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState(itemDetails.variants[0]?.size || ''); 
  const [selectedColor, setSelectedColor] = useState(itemDetails.variants[0]?.colors[0]?.color || ''); 
  const [quantity, setQuantity] = useState<number>(1); 
  const [currentIndex, setCurrentIndex] = useState<number>(0); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [isFavorited, setIsFavorited] = useState(false);
  const finalPrice = itemDetails.salePrice * (1 - itemDetails.discount / 100) * quantity;

  const scrollX = useRef(new Animated.Value(0)).current;

  // Lấy tất cả màu sắc duy nhất từ các variants của sản phẩm
  const uniqueColors = Array.from(
    new Set(itemDetails.variants.flatMap(variant => variant.colors.map(colorObj => colorObj.color)))
  );

  // Tạo mảng các kích cỡ duy nhất
  const uniqueSizes = Array.from(new Set(itemDetails.variants.map(variant => variant.size)));


  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const response = await axios.get<{ _id: string }>(`${BASE_URL}/auth/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            const user = response.data;  // Chỉ lấy _id từ response
            setUserID(user._id);
            checkIfFavorited(user._id);
          }
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserID();
  }, []);

  console.log("userID:", userID);
  console.log("itemDetails.id:", itemDetails._id);

  // Check if product is in the wishlist
  const checkIfFavorited = async (userId: string) => {
    try {
      const response = await axios.get<WishlistType>(`${BASE_URL}/wishlist/${userId}`);
      const wishlist = response.data;
      if (wishlist.products.some((product: { _id: string }) => product._id === itemDetails._id)) {
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Error checking if product is in wishlist:", error);
    }
  };

   // Add product to wishlist
   const addToWishlist = async () => {
    if (userID) {
      try {
        await axios.post(`${BASE_URL}/wishlist/${userID}/add`, { productId: itemDetails._id });
        setIsFavorited(true);
      } catch (error) {
        console.error("Error adding product to wishlist:", error);
      }
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async () => {
    if (userID) {
      try {
        await axios.post(`${BASE_URL}/wishlist/${userID}/remove`, { productId: itemDetails._id });
        setIsFavorited(false);
      } catch (error) {
        console.error("Error removing product from wishlist:", error);
      }
    }
  };

  // Toggle favorite state and update wishlist
  const toggleFavorite = () => {
    if (isFavorited) {
      removeFromWishlist();
      console.log("Removed from wishlist");
    } else {
      addToWishlist();
      console.log("Added to wishlist");
    }
  };

  const GoBack = () => {
    navigation.goBack();
  };
  const NavigateToCart = () => {
    navigation.navigate('Cart', { itemDetails: itemDetails });
  };
  const NavigateToRatingsReviews = () => {
    navigation.navigate('RatingsReviews', { itemDetails: itemDetails });
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

  function calculateAverageRating(ratings: Ratings): number {
    const totalRatings = ratings[1] + ratings[2] + ratings[3] + ratings[4] + ratings[5];
    const weightedSum =
      ratings[1] * 1 +
      ratings[2] * 2 +
      ratings[3] * 3 +
      ratings[4] * 4 +
      ratings[5] * 5;
  
    return totalRatings > 0 ? weightedSum / totalRatings : 0;
  }

  // Hàm để lấy hình ảnh dựa trên màu sắc được chọn
  const getImageForSelectedColor = () => {
    const selectedVariant = itemDetails.variants.find(variant =>
      variant.colors.some(colorObj => colorObj.color === selectedColor)
    );

    const colorObj = selectedVariant?.colors.find(colorObj => colorObj.color === selectedColor);
    return colorObj?.image || itemDetails.images[0]; // Nếu không tìm thấy, dùng hình ảnh mặc định
  };

  return (
    <View className="flex-1">
      {/* Header - Fixed at the top */}
      <View className="absolute top-0 left-0 right-0 px-4 py-3 flex flex-row justify-between items-center z-10 mt-8">
        <TouchableOpacity onPress={GoBack}>
          <Image source={icons.next1} className="rotate-180 w-8 h-8" resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity >
          <Image source={icons.cart} className="w-6 h-6" resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* ScrollView */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 60 }} className="pt-5 px-4 bg-white">
        {/* Product Image Slider */}
        <View className="">
          <FlatList
            data={itemDetails.images}
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
            {itemDetails.images.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: 4,
                  backgroundColor: currentIndex === index ? 'red' : 'gray',
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        </View>

        {/* Product Details */}
        <View className="mt-6">
          <Text className="text-3xl font-bold text-gray-900 mt-2">{itemDetails.name}</Text>
          {/* Price Details with Heart Icon */}
          <View className="flex flex-row items-center justify-between mt-4">
            <View className="flex flex-row items-center">
              <Text className="text-3xl font-bold text-gray-900">${(itemDetails.salePrice * (1 - itemDetails.discount / 100))}</Text>
              <Text className="text-2xl font-thin text-gray-500 line-through ml-2">${itemDetails.salePrice}</Text>
              <Text className="text-xl text-red-500 ml-2">{itemDetails.discount}%</Text>
            </View>

            {/* Heart Icon for Favorite */}
            <TouchableOpacity onPress={toggleFavorite}>
              <Icon
                name={isFavorited ? 'heart' : 'heart-outline'}
                size={28}
                color={isFavorited ? 'red' : 'gray'}
              />
            </TouchableOpacity>
          </View>

          {/* Rating and Number of Reviews */}
          <View className="flex flex-row items-center mb-3">
            <Rating
              type="custom"
              ratingCount={5}
              imageSize={20}
              startingValue={calculateAverageRating(itemDetails.ratings)}
              readonly={true}
              ratingBackgroundColor="#EEEEEE"
            />
            <Text className="text-xl font-thin text-black-100/90 ml-3">
              {'('}{itemDetails.reviews} reviews{')'}
            </Text>
          </View>
          <Text numberOfLines={2} className="text-gray-500 font-medium mt-2 leading-relaxed">
            {itemDetails.description}
          </Text>


          <View className="mt-4">
            <TouchableOpacity
              className="py-4 flex flex-row justify-between items-center border-gray-300"
              onPress={NavigateToRatingsReviews}
            >
              <Text className="text-lg text-gray-800">Ratings & reviews</Text>
              <Ionicons name="chevron-forward" size={20} color="black" />
            </TouchableOpacity>

            <TouchableOpacity className="py-4 flex flex-row justify-between items-center   border-gray-300">
              <Text className="text-lg text-gray-800">Shipping info</Text>
              <Ionicons name="chevron-forward" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="py-4 flex flex-row justify-between items-center border-gray-300">
              <Text className="text-lg text-gray-800">Support</Text>
              <Ionicons name="chevron-forward" size={20} color="black" />
            </TouchableOpacity>
          </View>

          {/* Các sản phẩm tương tự */}
          <View className="mt-6 mb-3">
            <Text className="text-xl font-bold mb-3">You can also like this</Text>
            <FlatList
              horizontal
              data={ProductData}
              renderItem={({ item }) => (
                <View className="mr-4 w-40">
                  <View className="relative">
                    <Image source={{ uri: item.image }} className="w-full h-44 rounded-lg" />
                    {item.priceOff && (
                      <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-full">
                        <Text className="text-white text-xs">{item.priceOff}%</Text>
                      </View>
                    )}
                  </View>

                  {/* Giới hạn số dòng của tiêu đề sản phẩm */}
                  <Text className="text-sm mt-2 text-gray-500" numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                  </Text>

                  <View className="flex flex-row items-center mt-1">
                    <Rating
                      type="custom"
                      ratingCount={5}
                      imageSize={14}
                      readonly={true}
                      startingValue={item.stars}
                    />
                    <Text className="ml-2 text-xs text-gray-500">({item.numberOfReview})</Text>
                  </View>

                  <View className="flex flex-row items-center mt-1">
                    {item.priceBeforeDeal && (
                      <Text className="line-through text-sm text-gray-400">${item.priceBeforeDeal}</Text>
                    )}
                    <Text className="ml-2 text-sm text-red-500">${item.price}</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
            />
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

  <View className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-lg" style={{ height: '60%', paddingBottom: 20 }}>
    
    {/* Product image and price */}
    <View className="flex flex-row items-center mb-4">
      {/* Left: Product Image */}
      <Image source={{ uri: getImageForSelectedColor() }} className="w-24 h-24 rounded-lg" resizeMode="cover" />
      
      {/* Right: Price Details */}
      <View className="ml-4"> 
        <Text className="text-3xl font-bold text-gray-900">${itemDetails.salePrice * (1 - itemDetails.discount / 100)}</Text>
        <Text className="text-xl text-gray-500 line-through">${itemDetails.salePrice}</Text>
      </View>
    </View>

    <Text className="text-lg font-semibold mb-4">Select size</Text>

    {/* Size Selection */}
    <View className="flex flex-row items-center mt-3">
      {uniqueSizes.map(size => (
        <TouchableOpacity
          key={size}
          onPress={() => setSelectedSize(size)}
          className={`w-10 h-10 rounded-full flex items-center ml-2 justify-center transition-all ${selectedSize === size ? 'bg-blue-500 border-2 border-[#43d854]' : 'bg-gray-200'
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
          {uniqueColors.map(color => (
            <TouchableOpacity
              key={color}
              onPress={() => setSelectedColor(color)}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${selectedColor === color ? 'border-2 border-[#43d854]' : 'border border-gray-300'
                } shadow-md`}
              style={{ backgroundColor: colorMap[color] || "gray" }}
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
    <View className="absolute bottom-4 left-0 right-0 px-6">
      <TouchableOpacity
        className="bg-red-500 py-3 rounded-lg"
        onPress={() => setModalVisible(false)}
      >
        <Text className="text-white text-center text-lg" onPress={NavigateToCart}>Add To Cart</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>




    </View>
  );
};

export default ProductsDetailsScreen;