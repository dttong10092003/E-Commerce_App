import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Product } from '../constants/types'; // Đảm bảo import đúng kiểu Product
import { Rating } from 'react-native-ratings';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteStackParamList } from '../../App';

type ProductItemProps = {
  itemDetails: Product;
};

type Ratings = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

const ProductItem: React.FC<ProductItemProps> = ({ itemDetails }) => {
  const navigation = useNavigation<StackNavigationProp<RouteStackParamList, 'ProductDetails'>>();
  const NavigateToProductsDetails = () => {
    navigation.navigate('ProductDetails', { itemDetails });
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

  return (
    <TouchableOpacity
      className="w-72 bg-white rounded-xl"
      onPress={NavigateToProductsDetails}>
      <Image source={{ uri: itemDetails.image }} className="w-full rounded-t-xl h-40" />
      <View className="px-3">
        <Text 
          className="text-2xl text-black-100 my-2 text-start font-bold"
          numberOfLines={1}
          ellipsizeMode="tail">{itemDetails.name}
        </Text>
        <Text className="text-xl text-black-100/50 text-start font-medium"
          numberOfLines={2}
          ellipsizeMode="tail">
          {itemDetails.description}
        </Text>
        
        {/* Sale Price */}
        <Text className="text-black-100 font-bold text-2xl text-start">
          ${itemDetails.salePrice * (100 - itemDetails.discount) / 100}
        </Text>

        {/* Original Price and Discount */}
        {itemDetails.discount > 0 && (
          <View className="flex flex-row items-center gap-x-3">
            <Text className="text-black-100/50 font-medium text-xl line-through text-start">
              ${itemDetails.salePrice}
            </Text>
            <Text className="text-action font-medium text-xl">{itemDetails.discount}%</Text>
          </View>
        )}

        {/* Ratings */}
        <View className="flex flex-row items-center mb-3">
          <View>
            <Rating
              type="custom"
              ratingCount={5}
              imageSize={20}
              startingValue={calculateAverageRating(itemDetails.ratings)}
              readonly={true}
              ratingBackgroundColor="#EEEEEE"
            />
          </View>
          <Text className="text-xl font-thin text-[#BBBBBB]-100 pl-5">
            ({itemDetails.reviews} reviews)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;
