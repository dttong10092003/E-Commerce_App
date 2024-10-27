import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChangePasswordScreen from './ChangePasswordScreen';

const SettingsScreen = ({ navigation }) => {
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('12/12/1989');
  const [password, setPassword] = useState('********');
  const [notifications, setNotifications] = useState({
    sales: true,
    newArrivals: false,
    deliveryStatus: false,
  });

  const toggleSwitch = (field) => {
    setNotifications({
      ...notifications,
      [field]: !notifications[field],
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 pt-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} className="px-4">
        {/* Personal Information */}
        <Text className="text-lg font-semibold mt-4">Personal Information</Text>
        <View className="bg-white p-4 mt-2 rounded-lg shadow-sm">
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full name"
            className="bg-gray-100 p-3 rounded-md mt-2"
          />
          <TextInput
            value={birthDate}
            placeholder="Date of Birth"
            editable={false}
            className="bg-gray-100 p-3 rounded-md mt-2"
          />
        </View>

        {/* Password Section */}
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-lg font-semibold">Password</Text>
          <TouchableOpacity onPress={() => setIsPasswordModalVisible(true)}>
            <Text className="text-blue-500">Change</Text>
          </TouchableOpacity>
        </View>
        <View className="bg-white p-4 mt-2 rounded-lg shadow-sm">
          <TextInput
            value={password}
            editable={false}
            secureTextEntry
            className="bg-gray-100 p-3 rounded-md"
          />
        </View>

        {/* Notifications */}
        <Text className="text-lg font-semibold mt-6">Notifications</Text>
        <View className="bg-white p-4 mt-2 rounded-lg shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base">Sales</Text>
            <Switch
              value={notifications.sales}
              onValueChange={() => toggleSwitch('sales')}
            />
          </View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base">New arrivals</Text>
            <Switch
              value={notifications.newArrivals}
              onValueChange={() => toggleSwitch('newArrivals')}
            />
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-base">Delivery status changes</Text>
            <Switch
              value={notifications.deliveryStatus}
              onValueChange={() => toggleSwitch('deliveryStatus')}
            />
          </View>
        </View>
      </ScrollView>

      {/* Password Change Modal */}
      <ChangePasswordScreen
        isVisible={isPasswordModalVisible}
        onClose={() => setIsPasswordModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;
