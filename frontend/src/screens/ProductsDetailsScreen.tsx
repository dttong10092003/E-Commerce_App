import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { FlatList, Image, ImageSourcePropType, ScrollView, Text, TouchableOpacity, View, } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import icons from '../constants/icons';
import { RouteTabsParamList } from './HomeScreen';
import LinearGradient from 'react-native-linear-gradient';
import { FeaturesData } from '../tabs/HomeTab';
import ProductItem from '../components/ProductItem';
import { ProductData } from '../constants/data';
import { RouteStackParamList } from '../../App';

type ScreenRouteProps = RouteProp<RouteStackParamList, 'ProductDetails'>;

type ProductDetailsProps = {
  route: ScreenRouteProps;
};

const ProductsDetailsScreen: React.FC<ProductDetailsProps> = ({ route }) => {
  const { itemDetails } = route.params || {};
  const navigation = useNavigation<StackNavigationProp<RouteTabsParamList, 'Cart'>>();

  const GoBack = () => {
    navigation.goBack();
  };
  const NavigateToCart = () => {
    navigation.navigate('Cart', { itemDetails: itemDetails! });
  };
  return (
    <ScrollView className="pt-5 px-3" >
      {/* header */}
      <View className="flex flex-row justify-between items-center mt-5">
        <TouchableOpacity onPress={GoBack}>
          <Image
            source={icons.next1}
            className="rotate-180 w-8 h-8"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={NavigateToCart}>
          <Image source={icons.cart} className="w-6 h-6" resizeMode="contain" />
        </TouchableOpacity>
      </View>
      {/* image slider */}
      <View className="mt-5">
        <Image
          source={{ uri: itemDetails?.image && itemDetails.image.length > 0 ? itemDetails.image[0] : 'https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.3/h_452,c_limit/d780ddce-1b20-4a3c-915c-bb46c78c7ddc/air-pegasus-2005-shoes-KhtkBW.png' }}
          className="h-72 rounded-2xl"
        />
      </View>
      {/* size uk */}
      <View>
        <Text className="text-black-100 text-lg font-bold ">Size: 7UK</Text>
        <View className="flex flex-row gap-x-5 mt-5 items-center">
          {sizeData.map(item => (
            <View
              key={item.id}
              className="bg-transparent py-1 px-2 rounded-lg border border-red-500">
              <Text className="text-action text-xl font-medium">
                {item.size} uk{' '}
              </Text>
            </View>
          ))}
        </View>
      </View>
      {/* details */}
      {/* Tên sản phẩm */}
      <View className=" mt-5">
        <Text className="text-2xl font-bold text-black-100">
          {' '}
          {itemDetails?.title}{'Nike Air Pegasus 2005'}
        </Text>
        <Text className="text-neutral-400 font-medium text-lg">
          {' '}
          Vision Alta Men’s Shoes Size (All Colours){''}
        </Text>
        <View className="flex flex-row items-center mb-3">
          {/* Đánh giá */}
          <View>
            <AirbnbRating
              count={itemDetails?.stars}
              reviews={['Terrible', 'Bad', 'Okay', 'Good', 'Great']}
              defaultRating={itemDetails?.stars}
              size={20}
              ratingContainerStyle={{ flex: 1, flexDirection: 'row' }}
            />
          </View>

          <Text className="text-xl font-thin text-black-100/90 ">
            {' '}
            {itemDetails?.numberOfReview}{' '}
          </Text>
        </View>
        {/* Tiền */}
        <View className="flex flex-row items-center gap-x-3">
          <Text className="text-black-100 font-bold text-2xl text-start">
            {' '}
            ${itemDetails?.price}{'500'}
          </Text>
          {/* Tiền trước khi giảm giá */}
          <Text className="text-black-100/50 font-thin text-xl  line-through text-start">
            {' '}
            ${itemDetails?.priceBeforeDeal}{'1000'}
          </Text>
          <Text className="text-action font-thin text-xl ">
            {' '}
            {itemDetails?.priceOff}{' '}
          </Text>
        </View>
        {/* Mô tả sản phẩm */}
        <View className="mt-3">
          <Text className="text-xl font-semibold text-black-100">
            Product Details
          </Text>
          <Text className="text-md font-medium text-neutral-400">
            {itemDetails?.description} {'A springy ride for every run. The familiar, just-for-you feel of the Peg returns to help you accomplish.'}
          </Text>
        </View>
        {/* status */}
        <View className="flex flex-row items-center gap-x-3  mt-5">
          <FlatList
            data={StatusData}
            renderItem={({ item }) => (
              <View className=" py-1 px-2 border flex flex-row  rounded-lg border-neutral-500">
                <Image
                  className="w-6 h-6"
                  resizeMode="contain"
                  source={item.icon}
                />
                <Text className="text-neutral-400 font-medium text-lg">
                  {' '}
                  {item.name}{' '}
                </Text>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-3" />}
          />
        </View>
        {/* go to cart/ buy now */}
        <View className="flex flex-row justify-around items-center mt-6">
          {/* Nút Chia sẻ */}
          <TouchableOpacity className="p-3  rounded-full shadow-md">
            <Image
              source={icons.share}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Nút Yêu thích */}
          <TouchableOpacity className="p-3  rounded-full shadow-md">
            <Image
              source={icons.favorites}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Nút Add to Bag */}
          <TouchableOpacity className="bg-blue-500 py-3 px-8 rounded-full ">
            <Text className="text-white font-semibold text-base">
              Add to Bag
            </Text>
          </TouchableOpacity>
        </View>


        {/* delivery in ... */}
        <View className="bg-red-300 px-3 py-3 my-5">
          <Text className="text-black-100 text-lg ">Delivery in </Text>
          <Text className="text-black-100 text-2xl font-bold ">
            1 within Hour
          </Text>
        </View>
        {/* View similar */}
        <View className="flex flex-row items-center justify-between mb-8">
          <FlatList
            data={similarData}
            renderItem={({ item }) => (
              <View className="bg-white py-3 px-3 rounded-lg border border-neutral-200 flex flex-row gap-x-2">
                <Image
                  source={item.icon}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Text className="text-black-100 text-xl font-medium ">
                  {' '}
                  {item.name}{' '}
                </Text>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-3" />}
          />
        </View>
        {/* similar to */}
        <View className="mb-5">
          <Text className="text-2xl text-black-100 font-bold text-start">
            Similar To
          </Text>
          {/* features */}
          <View className="flex my-5 flex-row mx-5 justify-between ">
            <Text className="text-2xl font-bold ">282+ Items </Text>
            <View className="flex flex-row gap-x-3 ">
              {FeaturesData.map(item => (
                <View
                  className="bg-white  rounded-lg  flex-row flex items-center px-2 "
                  key={item.id}>
                  <Text className="text-black-100"> {item.title} </Text>
                  <Image
                    source={item.image}
                    className="w-4 h-4"
                    resizeMode="contain"
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
        {/* similar products */}
        <View className="my-8">
          <FlatList
            data={itemDetails ? [itemDetails] : []}
            renderItem={({ item }) => (
              <ProductItem
                image={item.image[0]}
                title={item.title}
                description={item.description}
                price={item.price}
                priceBeforeDeal={item.priceBeforeDeal}
                priceOff={item.priceOff}
                stars={item.stars}
                numberOfReview={item.numberOfReview}
                itemDetails={item}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-8" />}
            ListFooterComponent={<View className="w-8" />}
            ListHeaderComponent={<View className="w-8" />}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductsDetailsScreen;

interface similarDataType {
  icon: ImageSourcePropType;
  name: string;
}

const similarData: similarDataType[] = [
  {
    icon: icons.eye,
    name: 'View Similar',
  },
  {
    icon: icons.components,
    name: 'Add to Compare',
  },
];

const sizeData = [
  {
    id: 0,
    size: 6,
  },
  {
    id: 1,
    size: 7,
  },
  {
    id: 2,
    size: 8,
  },
  {
    id: 3,
    size: 9,
  },
  {
    id: 4,
    size: 10,
  },
];
interface StatusDataType {
  id: number;
  icon: ImageSourcePropType;
  name: string;
}

const StatusData: StatusDataType[] = [
  {
    id: 0,
    icon: icons.location,
    name: 'Nearest Store',
  },
  {
    id: 1,
    icon: icons.policy,
    name: 'Return policy',
  },
];
