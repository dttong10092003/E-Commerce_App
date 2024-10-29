import {View, Text,TouchableOpacity,Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../constants/icons';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';

type Props = {};

const Stack = createStackNavigator();

const SettingTab = (props: Props) => {
  type RootStackParamList = {
    MyOrders: undefined;
    ShippingAddresses: undefined;
    PaymentMethods: undefined;
    Promocodes: undefined;
    Reviews: undefined;
    Settings: undefined;
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Section */}
      <View className="px-4 pb-4">
        <Text className="text-2xl font-bold">My profile</Text>
      </View>

      {/* Profile Info */}
      <View className="flex-row items-center px-4 pb-4">
        <Image
          source={icons.profile} // Replace with actual profile image URL
          className="w-16 h-16 rounded-full mr-4"
        />
        <View>
          <Text className="text-lg font-semibold">Matilda Brown</Text>
          <Text className="text-gray-500">matildabrown@mail.com</Text>
        </View>
      </View>

      {/* Options List */}
      <View className="bg-white">
        <TouchableOpacity
          className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200"
          onPress={() => navigation.navigate('MyOrders')}
        >
          <View>
            <Text className="text-lg font-bold">My orders</Text>
            <Text className="text-sm text-gray-400">Already have 12 orders</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#A0A0A0" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200"
          onPress={() => navigation.navigate('ShippingAddresses')}
        >
          <View>
            <Text className="text-lg font-bold">Shipping addresses</Text>
            <Text className="text-sm text-gray-400">3 addresses</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#A0A0A0" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200"
          onPress={() => navigation.navigate('PaymentMethods')}
        >
          <View>
            <Text className="text-lg font-bold">Payment methods</Text>
            <Text className="text-sm text-gray-400">Visa **34</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#A0A0A0" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200"
          // onPress={() => navigation.navigate('Promocodes')}
          
        >
          <View>
            <Text className="text-lg font-bold">Promocodes</Text>
            <Text className="text-sm text-gray-400">You have special promocodes</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#A0A0A0" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200"
          // onPress={() => navigation.navigate('Reviews')}
        >
          <View>
            <Text className="text-lg font-bold">My reviews</Text>
            <Text className="text-sm text-gray-400">Reviews for 4 items</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#A0A0A0" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200"
          onPress={() => navigation.navigate('Settings')}
        >
          <View>
            <Text className="text-lg font-bold">Settings</Text>
            <Text className="text-sm text-gray-400">Notifications, password</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#A0A0A0" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default SettingTab;