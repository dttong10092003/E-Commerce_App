import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChangePasswordScreen from './ChangePasswordScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../config';

const SettingsScreen = ({ navigation }) => {
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [userData, setUserData] = useState({ fullName: '', email: '', password: '********' });
  const [notifications, setNotifications] = useState({
    sales: true,
    newArrivals: false,
    deliveryStatus: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get(`${BASE_URL}/auth/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            const user = response.data as { username: string; email: string };
            setUserData({
              fullName: user.username,
              email: user.email,
              password: '********',
            });
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          Alert.alert('Error', 'Failed to load user data');
        }
      }
    };
    fetchUserData();
  }, []);

  const toggleSwitch = (field) => {
    setNotifications({
      ...notifications,
      [field]: !notifications[field],
    });
  };
  const handleUpdatePassword = async (oldPassword, newPassword) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.patch(
          `${BASE_URL}/auth/update-password`, 
          { oldPassword, newPassword },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          Alert.alert('Success', 'Password updated successfully!');
        }
      } catch (error) {
        throw new Error('Old password is incorrect or failed to update password');
      }
    }
  };
  


  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} className="px-4">
        <Text className="text-lg font-semibold mt-4">Personal Information</Text>
        <View className="bg-white p-4 mt-2 rounded-lg shadow-sm">
          <TextInput
            value={userData.fullName}
            onChangeText={(text) => setUserData({ ...userData, fullName: text })}
            placeholder="Full name"
            editable={false}

            className="bg-gray-100 p-3 rounded-md mt-2"
          />
          <TextInput
            value={userData.email}
            placeholder="Email"
            editable={false}
            className="bg-gray-100 p-3 rounded-md mt-2"
          />
        </View>

        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-lg font-semibold">Password</Text>
          <TouchableOpacity onPress={() => setIsPasswordModalVisible(true)}>
            <Text className="text-blue-500">Change</Text>
          </TouchableOpacity>
        </View>
        <View className="bg-white p-4 mt-2 rounded-lg shadow-sm">
          <TextInput
            value={userData.password}
            editable={false}
            secureTextEntry
            className="bg-gray-100 p-3 rounded-md"
          />
        </View>

        <Text className="text-lg font-semibold mt-6">Notifications</Text>
        <View className="bg-white p-4 mt-2 rounded-lg shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base">Sales</Text>
            <Switch value={notifications.sales} onValueChange={() => toggleSwitch('sales')} />
          </View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base">New arrivals</Text>
            <Switch value={notifications.newArrivals} onValueChange={() => toggleSwitch('newArrivals')} />
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-base">Delivery status changes</Text>
            <Switch value={notifications.deliveryStatus} onValueChange={() => toggleSwitch('deliveryStatus')} />
          </View>
        </View>
      </ScrollView>

      <ChangePasswordScreen
        isVisible={isPasswordModalVisible}
        onClose={() => setIsPasswordModalVisible(false)}
        onSave={handleUpdatePassword} 
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;
