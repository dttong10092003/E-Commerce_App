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
  CustomerCare: undefined;
  AdminOrder: undefined;
  CreateAccount: undefined;
};

const HomeScreenAdmin = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Trạng thái hiển thị menu
  const slideAnim = useRef(new Animated.Value(-screenWidth * 0.7)).current; // Vị trí trượt của menu
  const overlayOpacity = useRef(new Animated.Value(0)).current; // Độ mờ của lớp phủ
  const [totalDeliveredAmount, setTotalDeliveredAmount] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [balanceHistory, setBalanceHistory] = useState([]);

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

  const fetchBalanceHistory = async () => {
    try {
      const response = await axios.get<{ balanceHistory: any[] }>(`${BASE_URL}/orders/balance-history`);
      if (response.status === 200) {
        setBalanceHistory(response.data.balanceHistory);
      }
    } catch (error) {
      console.error('Failed to fetch balance history:', error);
      Alert.alert('Error', 'Failed to load balance history');
    }
  };


  const fetchWeeklyActivity = async () => {
    try {
      const response = await axios.get<{ weeklyActivity: any[] }>(`${BASE_URL}/orders/weekly-activity`);
      if (response.status === 200) {
        setWeeklyActivity(response.data.weeklyActivity);
      }
    } catch (error) {
      console.error('Failed to fetch weekly activity:', error);
      Alert.alert('Error', 'Failed to load weekly activity data');
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/recent-transactions`);
      if (response.status === 200) {
        setRecentTransactions(response.data as any);
      }
    } catch (error) {
      console.error('Failed to fetch recent transactions:', error);
      Alert.alert('Error', 'Failed to load recent transactions');
    }
  };


  const fetchTotalDeliveredAmount = async () => {
    try {
      const response = await axios.get<{ totalAmount: number }>(`${BASE_URL}/orders/total-delivered-amount`);
      if (response.status === 200) {
        setTotalDeliveredAmount(response.data.totalAmount);
      }
    } catch (error) {
      console.error('Failed to fetch total delivered amount:', error);
      Alert.alert('Error', 'Failed to load total delivered amount');
    }
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
      fetchTotalDeliveredAmount();
      fetchRecentTransactions();
      fetchWeeklyActivity();
      fetchBalanceHistory();

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
        <View
          style={{
            backgroundColor: '#4a90e2', // Màu xanh dương nền
            borderRadius: 16, // Bo góc
            padding: 20, // Padding toàn bộ
            marginBottom: 20, // Khoảng cách dưới
            position: 'relative', // Vị trí để hỗ trợ các phần tử con
            shadowColor: '#000', // Bóng đổ
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          {/* Biểu tượng chip */}
          <Image
            source={icons.chip}
            style={{ width: 40, height: 40, position: 'absolute', top: 20, right: 20 }}
            resizeMode="contain"
          />

          {/* Balance */}
          <Text style={{ color: 'white', fontSize: 14 }}>Balance</Text>
          <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold', marginTop: 5 }}>
            ${totalDeliveredAmount.toLocaleString()}
          </Text>

          {/* Tên chủ thẻ và ngày hết hạn */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <View>
              <Text style={{ color: '#d3d3d3', fontSize: 12, fontWeight: '500' }}>CARD HOLDER</Text>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginTop: 5 }}>Alexander Tin</Text>
            </View>
            <View>
              <Text style={{ color: '#d3d3d3', fontSize: 12, fontWeight: '500' }}>VALID THRU</Text>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginTop: 5 }}>12/27</Text>
            </View>
          </View>

          {/* Số thẻ */}
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: '500',
              letterSpacing: 2,
              marginTop: 20,
            }}
          >
            4089 **** **** 3946
          </Text>

          {/* Logo thẻ */}
          <Image
            source={icons.mastercard_white}
            style={{ width: 50, height: 50, position: 'absolute', bottom: 5, right: 20 }}
            resizeMode="contain"
          />
        </View>


        {/* Recent Transactions */}
        <View className="bg-white p-5 rounded-lg shadow-lg mb-5">
          <Text className="text-lg font-bold text-gray-800">Recent Transactions</Text>

          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction, index) => (
              <View className="flex-row items-center mt-5" key={transaction._id || index}>
                <View className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${transaction.orderStatus === 'Delivered' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  <Image
                    source={icons.wallet}
                    className="w-6 h-6"
                    resizeMode="contain"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-medium text-base">
                    {transaction.user?.username}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {new Date(transaction.orderDate).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  className={`font-bold text-base ${transaction.totalAmount > 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                  ${transaction.totalAmount.toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-500 text-center mt-5">No recent transactions</Text>
          )}
        </View>

        {/* Weekly Activity */}
        <View className="bg-white p-5 rounded-lg shadow-lg mb-5">
          <Text className="text-lg font-bold text-gray-700 mb-2">Weekly Activity</Text>
          {weeklyActivity.length > 0 ? (
            <BarChart
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{ data: weeklyActivity }],
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
                marginLeft: -15,
              }}
            />
          ) : (
            <Text className="text-gray-500 text-center mt-5">No activity this week</Text>
          )}
        </View>

        {/* Balance History */}
        <View className="bg-white p-5 rounded-lg shadow-lg mb-5">
          <Text className="text-lg font-bold text-gray-700">Balance History</Text>
          {balanceHistory.length > 0 ? (
            <LineChart
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [{ data: balanceHistory }],
              }}
              width={screenWidth - 40}
              height={220}
              yAxisLabel="$"
              chartConfig={chartConfig}
              style={{ borderRadius: 10, marginTop: 10, marginLeft: -20, }}
            />
          ) : (
            <Text className="text-gray-500 text-center mt-5">No balance history available</Text>
          )}
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
          padding: 22,
          transform: [{ translateX: slideAnim }],
          zIndex: 2,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 20 }}>Menu</Text>

        <TouchableOpacity onPress={() => { navigation.navigate('ProductManagement') }} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
          <Ionicons name="cube-outline" size={20} color="black" style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 18 }}>Product Management</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate('AdminOrder') }} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
          <Ionicons name="clipboard-outline" size={20} color="black" style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 18 }}>Order Management</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate('CustomerCare') }} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
          <Ionicons name="people-outline" size={20} color="black" style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 18 }}>Customer Care</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { navigation.navigate('CreateAccount') }} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
          <Ionicons name="person-add-outline" size={20} color="black" style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 18 }}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMenu} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
          <Ionicons name="close-outline" size={20} color="red" style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 18, color: 'red' }}>Close</Text>
        </TouchableOpacity>
      </Animated.View>

    </SafeAreaView>
  );
};

export default HomeScreenAdmin;
