import React, { useState, useCallback, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import icons from '../constants/icons';
import images from '../constants/images';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import BASE_URL from '../config';

const screenWidth = Dimensions.get("window").width;

type User = {
  username: string;
  email: string;
  avatar: string;
};

type RootStackParamList = {
  Settings: undefined;
  ProductManagement: undefined;
};

const HomeScreenAdmin = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Trạng thái hiển thị menu
  const slideAnim = useRef(new Animated.Value(-screenWidth * 0.7)).current; // Vị trí trượt của menu
  const overlayOpacity = useRef(new Animated.Value(0)).current; // Độ mờ của lớp phủ

  const toggleMenu = () => {
    if (isMenuVisible) {
      // Close menu
      Animated.timing(slideAnim, {
        toValue: -screenWidth * 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsMenuVisible(false));
    } else {
      // Open menu
      setIsMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(overlayOpacity, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Điều hướng tới trang Profile
  const NavigateToProfile = () => {
    navigation.navigate('Settings');
  };

  // Lấy thông tin người dùng từ server khi component tải
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const response = await axios.get(`${BASE_URL}/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          const { username, email, avatar } = response.data as User;
          setUser({
            username,
            email,
            avatar: avatar ? `data:image/png;base64,${avatar}` : '',
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  // Refresh khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const chartConfig = {
    backgroundGradientFrom: "#f7fafc",
    backgroundGradientFromOpacity: 0.1,
    backgroundGradientTo: "#e2e8f0",
    backgroundGradientToOpacity: 0.1,
    color: (opacity = 1) => `rgba(67, 146, 249, ${opacity})`,
    barPercentage: 0.6,
    fillShadowGradient: "#4392F9",
    fillShadowGradientOpacity: 0.8,
    labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
    decimalPlaces: 0,
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="px-4">
        {/* Header */}
        <View className='flex flex-row items-center justify-between'>
          <TouchableOpacity onPress={toggleMenu}>
            <Ionicons name="menu" size={32} color="black" />
          </TouchableOpacity>
          
          <Image
            source={images.logo}
            className='w-14 h-14'
            resizeMode='contain'>          
          </Image>

          <TouchableOpacity onPress={NavigateToProfile}>
            <Image
               source={user?.avatar ? { uri: user.avatar } : icons.profile}
               className="w-8 h-8 rounded-full"
              resizeMode='cover'>         
            </Image>
          </TouchableOpacity>
        </View>
        {/* My Cards */}
        <View className="p-5 bg-blue-500 rounded-lg mb-5 shadow-lg">
          <Text className="text-white text-lg">Balance</Text>
          <Text className="text-white text-3xl font-bold mt-1">$5756</Text>
          <Text className="text-white mt-1">Credit Card - Eddy Cus...</Text>
        </View>

        {/* Recent Transactions */}
        <View className="bg-white p-5 rounded-lg shadow-lg mb-5">
          <Text className="text-lg font-bold text-gray-700">Recent Transactions</Text>
          <View className="mt-3">
            <Text className="text-gray-600">Deposit from my - <Text className="text-red-500">- $350</Text></Text>
            <Text className="text-gray-600 mt-1">Deposit Paypal - <Text className="text-green-500">+ $2520</Text></Text>
            <Text className="text-gray-600 mt-1">Jeni Wilson - <Text className="text-green-500">+ $150</Text></Text>
          </View>
        </View>

        {/* Weekly Activity */}
        <View className="bg-white p-5 rounded-lg shadow-lg mb-5">
          <Text className="text-lg font-bold text-gray-700 mb-2">Weekly Activity</Text>
          <BarChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [{ data: [400, 300, 200, 500, 600, 700, 800] }],
            }}
            width={screenWidth - 50}
            height={220}
            yAxisLabel="$"
            yAxisSuffix=""
            fromZero={true}
            showValuesOnTopOfBars={true}
            chartConfig={chartConfig}
            style={{
                borderRadius: 15,
                marginTop: 10,
                marginLeft: -30, 
              }}
          />
        </View>

        {/* Expense Statistics */}
        <View className="bg-white p-5 rounded-lg shadow-lg mb-5">
          <Text className="text-lg font-bold text-gray-700">Expense Statistics</Text>
          <PieChart
            data={[
              { name: "Entertainment", population: 30, color: "pink", legendFontColor: "#7F7F7F", legendFontSize: 15 },
              { name: "Bills", population: 15, color: "orange", legendFontColor: "#7F7F7F", legendFontSize: 15 },
              { name: "Groceries", population: 25, color: "yellow", legendFontColor: "#7F7F7F", legendFontSize: 15 },
              { name: "Others", population: 30, color: "blue", legendFontColor: "#7F7F7F", legendFontSize: 15 },
            ]}
            width={screenWidth - 40}
            height={220}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            chartConfig={chartConfig}
            style={{ borderRadius: 10, marginTop: 10 }}
          />
        </View>

        {/* Quick Transfer */}
        <View className="bg-white p-5 rounded-lg shadow-lg mb-5">
          <Text className="text-lg font-bold text-gray-700">Quick Transfer</Text>
          <View className="flex-row justify-around mt-4">
            <Image source={icons.profile} className="w-12 h-12 rounded-full" />
            <Image source={icons.profile} className="w-12 h-12 rounded-full" />
            <Image source={icons.profile} className="w-12 h-12 rounded-full" />
          </View>
          <TouchableOpacity className="mt-5 bg-blue-500 py-3 rounded-lg">
            <Text className="text-white text-center text-lg font-semibold">Send</Text>
          </TouchableOpacity>
        </View>

        {/* Balance History */}
        <View className="bg-white p-5 rounded-lg shadow-lg mb-5">
          <Text className="text-lg font-bold text-gray-700">Balance History</Text>
          <LineChart
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [{ data: [500, 600, 800, 400, 700, 1000] }],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="$"
            chartConfig={chartConfig}
            style={{ borderRadius: 10, marginTop: 10 }}
          />
        </View>
      </ScrollView>

      {/* Overlay for background blur effect */}
      {isMenuVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: overlayOpacity,
            zIndex: 1,
          }}
        >
          <TouchableOpacity style={{ flex: 1 }} onPress={toggleMenu} />
        </Animated.View>
      )}

      {/* Sidebar Menu */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: screenWidth * 0.6,
          backgroundColor: 'white',
          padding: 20,
          transform: [{ translateX: slideAnim }],
          zIndex: 2,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 20 }}>Menu</Text>

        <TouchableOpacity onPress={() => { navigation.navigate('ProductManagement')}}>
          <Text style={{ fontSize: 18, marginVertical: 10 }}>Product Management</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { /* Navigate to Order Management */ toggleMenu(); }}>
          <Text style={{ fontSize: 18, marginVertical: 10 }}>Order Management</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { /* Navigate to Customer Care */ toggleMenu(); }}>
          <Text style={{ fontSize: 18, marginVertical: 10 }}>Customer Care</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMenu} style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, color: 'red' }}>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default HomeScreenAdmin;
