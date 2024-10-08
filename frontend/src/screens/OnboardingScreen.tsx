import { View, Text, Image } from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import  images  from '../constants/images';
import { SplashData } from '../constants/data';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';



type Props = {};
export type RootStackParamList = {
  Login: undefined;

};
const OnboardingScreen = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const handlDone = () => {
    navigation.navigate('Login');
  };

  return (
    <View className="flex-1">
      <Onboarding
        onSkip={handlDone} // nhan de qua trang khac
        onDone={handlDone}
        pages={[
          {
            backgroundColor: '#fff',
            image: <Image source={SplashData[0].image} />,
            title: SplashData[0].title,
            subtitle: SplashData[0].description,
          },
          {
            backgroundColor: '#fff',
            image: <Image source={SplashData[1].image} />,
            title: SplashData[1].title,
            subtitle: SplashData[1].description,
          },
          {
            backgroundColor: '#fff',
            image: <Image source={SplashData[2].image} />,
            title: SplashData[2].title,
            subtitle: SplashData[2].description,
          },
        ]}
      />
    </View>
  );
};

export default OnboardingScreen;