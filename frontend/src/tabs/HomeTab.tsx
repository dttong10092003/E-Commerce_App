import {View, Text, Image, TouchableOpacity, ImageSourcePropType, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import icons from '../constants/icons';
import images from '../constants/images';
import { CustomSearch, ProductItem } from '../components';
import { CategoriesData, ProductData } from '../constants/data';



type Props = {};

const HomeTab = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  type RootStackParamList = {
    Setting: undefined;
  };

  const NavigateToProfile = () => {
    navigation.navigate('Setting');
  };

  const handleSelectCategory = () => {
    // Xu ly chuyen sang trang category duoc chon
  }

  const handleDealOff = () => {
    // Xu ly chuyen sang trang deal off
  }

  const handleViewAllNewArrival = () => {
    // Xu ly chuyen sang trang new arrival
  };

  const renderItem = ({item}) => (
      <TouchableOpacity onPress={handleSelectCategory}>
        <Image
          source={{uri: item.image}}
          className='w-24 h-24 rounded-full'              

        />
        <Text className='text-black-100/80 text-center text-lg font-medium'>{' '}{item.title}{' '}</Text>
      </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <ScrollView>
        {/* Header */}
        <View className='flex flex-row items-center justify-between mx-5'>
          <TouchableOpacity>
            <Image
              source={icons.menu}
              className='w-8 h-8'
              resizeMode='contain'>         
            </Image>
          </TouchableOpacity>
          

          <Image
            source={images.logo}
            className='w-14 h-14'
            resizeMode='contain'>          
          </Image>

          <TouchableOpacity onPress={NavigateToProfile}>
            <Image
              source={icons.profile}
              className='w-8 h-8'
              resizeMode='contain'>         
            </Image>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <CustomSearch initialQuery="" />

        {/* Features */}
        <View className='flex my-5 flex-row mx-5 justify-between'>
          <Text className='text-2xl font-bold '>All Features</Text>
          <View className='flex flex-row gap-x-3'>
            {
              FeaturesData.map((item) => (
                <View className='bg-white rounded-lg flex flex-row items-center px-2' key={item.id}>
                  <Text className='text-black-100'>{item.title}</Text>
                  <Image source={item.image}
                    className='w-6 h-6'
                    resizeMode='contain'
                  />
                </View>
              ))
            }
          </View>
        </View>

        {/* Categories */}
        <View>
        <FlatList
            data={CategoriesData}
            renderItem={renderItem}
            // keyExtractor={(item) => `${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className='w-5'/>}
            contentContainerStyle={{paddingHorizontal: 20}}
          />
        </View>

        {/* Offer */}
        <View className='pb-5'> 
          <TouchableOpacity onPress={handleDealOff}>
            <Image
                source={images.deal_off}
                className='w-full mt-6'
                resizeMode='contain'
            />
          </TouchableOpacity>
        </View>

        {/* New Product Banner */}
        <View className="bg-[#4392F9] rounded-xl justify-between flex flex-row mx-5 pl-5 py-5">
          <View>
            <Text className="text-white text-2xl font-semibold">
              New Product
            </Text>
            <Text className="text-white">
              Check out our latest products!
            </Text>
          </View>
          <TouchableOpacity onPress={handleViewAllNewArrival}>
            <View className="rounded-lg border-white border-2 mr-3 h-12 px-3 flex flex-row gap-x-px items-center">
              <Text className="text-white font-medium text-lg">View all</Text>
              <Image
                source={icons.show_all}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* New Product */}
        <View className="my-8">
          <FlatList
            data={ProductData}
            renderItem={({item}) => (
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
            contentContainerStyle={{paddingHorizontal: 20}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeTab;

type FeaturesDataProps = {
  id: number;
  title: string;
  image: ImageSourcePropType;
};
export const FeaturesData: FeaturesDataProps[] = [
  {
    id: 1,
    title: 'Sort',
    image: icons.sort,
  },
  {
    id: 2,
    title: 'Filter',
    image: icons.filter,
  },
];