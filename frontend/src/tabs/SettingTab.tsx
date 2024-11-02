import { View, Text, TouchableOpacity, Image,TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../constants/icons';
import React, {useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
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
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get(`${BASE_URL}/auth/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            const { _id, username, email } = response.data as { _id: string; username: string; email: string };
            setUserId(_id); // Cập nhật userId vào state
            setUsername(username);
            setEmail(email);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          Alert.alert('Error', 'Failed to load user data');
        }
      }
    };
    fetchUserData();
  }, []);
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUsernameChange = (newName) => {
    setUsername(newName);
  };

  const handleSave = async () => {
    setIsEditing(false);
    const token = await AsyncStorage.getItem('authToken');
    if (token && userId) {
      try {
        const response = await axios.patch(
          `${BASE_URL}/auth/users/${userId}/username`, // Sử dụng đúng đường dẫn
          { username },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (response.status === 200) {
          Alert.alert('Success', 'Username updated successfully');
        }
      } catch (error) {
        console.error('Failed to update username:', error);
        Alert.alert('Error', 'Failed to update username');
      }
    } else {
      Alert.alert('Error', 'User ID or Token not found');
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Section */}
      <View className="px-4 pb-4">
        <Text className="text-2xl font-bold">My profile</Text>
      </View>

      {/* Profile Info */}
      <View className="flex-row items-center px-4 pb-4">
        <Image
          source={icons.profile} 
          className="w-16 h-16 rounded-full mr-4"
        />
        <View>
        <View className="flex-row items-center space-x-2">
            {isEditing ? (
              <TextInput
                value={username}
                onChangeText={handleUsernameChange}
                onSubmitEditing={handleSave}
                className="text-lg font-semibold border-b border-gray-400 pb-1"
                autoFocus
              />
            ) : (
              <Text className="text-lg font-semibold">{username}</Text>
            )}
            <TouchableOpacity onPress={handleEditToggle}>
              <Image source={icons.edit} className="w-5 h-5" />
            </TouchableOpacity>
          </View>
          <Text className="text-gray-500">{email}</Text>
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