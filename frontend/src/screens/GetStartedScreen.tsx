import {View, Text, ImageBackground} from 'react-native';
import React from 'react';
import images from '../constants/images';
import {CustomButton} from '../components';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type Props = {};

const GetStartedScreen = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  type RootStackParamList = {
    HomeScreen: undefined;
  };

  const GetStarted = () => {
    navigation.navigate('HomeScreen');
  };
  return (
    <ImageBackground
      source={images.get_started}
      className="w-full h-full flex-1">
      <View className="h-[60%]" />
      <View className="px-3 h-[40%] pt-3 w-full">
        <Text className="text-white text-4xl text-center font-bold ">
          You want Authentic, here you go!
        </Text>
        <Text className="text-[#F2F2F2] text-lg font-medium text-center mt-5">
          {' '}
          Find it here, buy it now!{' '}
        </Text>

        <CustomButton
          title="Get Started"
          containerStyle="py-4 my-10"
          handlePress={GetStarted}
        />
      </View>
    </ImageBackground>
  );
};

export default GetStartedScreen;