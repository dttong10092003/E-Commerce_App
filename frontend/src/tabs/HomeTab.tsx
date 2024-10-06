import {View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import icons from '../constants/icons';
import images from '../constants/images';
import { CustomSearch } from '../components';

type Props = {};

const HomeTab = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  type RootStackParamList = {
    Setting: undefined;
  };

  const NavigateToProfile = () => {
    navigation.navigate('Setting');
  };

  return (
    <SafeAreaView>
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
    </SafeAreaView>
  );
};

export default HomeTab;