import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {ItemDetails, ProductTypes} from '../constants/types';
import images from '../constants/images';
import {Rating} from 'react-native-ratings';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../screens/OnboardingScreen';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteStackParamList} from '../../App';

type ProductItemProps = {
  image: string;
  title: string;
  description: string;
  price: number;
  priceBeforeDeal: number;
  priceOff: number;
  stars: number;
  numberOfReview: number;
  // ukSide?: number[];
  itemDetails: ItemDetails;
};

const ProductItem: React.FC<ProductItemProps> = ({
  image,
  title,
  description,
  price,
  priceBeforeDeal,
  priceOff,
  stars,
  numberOfReview,
  itemDetails,
}) => {
  const navigation = useNavigation<StackNavigationProp<RouteStackParamList, 'ProductDetails'>>();
  const NavigateToProductsDetails = () => {
    navigation.navigate('ProductDetails', {itemDetails});
  };

  return (
    <TouchableOpacity
      className="w-72 bg-white rounded-xl"
      onPress={NavigateToProductsDetails}>
      <Image source={{uri: image}} className="w-full rounded-t-xl h-40" />
      <View className="px-3">
        <Text 
          className="text-2xl text-black-100 my-2 text-start font-bold"
          numberOfLines={1}
          ellipsizeMode="tail">{title}
        </Text>
        <Text className="text-xl text-black-100/50 text-start font-medium"
          numberOfLines={2}
          ellipsizeMode="tail">
          {description}
        </Text>
        <Text className="text-black-100 font-bold text-2xl text-start">
          ${price}
        </Text>
        <View className="flex flex-row items-center gap-x-3">
          <Text className="text-black-100/50 font-medium text-xl line-through text-start">
            {priceBeforeDeal}
          </Text>
          <Text className="text-action font-medium text-xl">{priceOff}{'%'}</Text>
        </View>
        <View className="flex flex-row items-center mb-3">
          <View>
            <Rating
              type="custom"
              ratingCount={5}
              imageSize={20}
              startingValue={stars}
              readonly={true}
              ratingBackgroundColor="#EEEEEE"
            />
          </View>

          <Text className="text-xl font-thin text-[#BBBBBB]-100 pl-5">
            {'('}{numberOfReview}{' reviews)'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;
