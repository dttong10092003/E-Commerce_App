import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomerCareScreen = () => {
  const navigation = useNavigation();
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch support requests from the backend
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${BASE_URL}/support-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSupportRequests(response.data as any);
    } 
     finally {
      setLoading(false);
    }
  };

  // Accept a support request
  const handleAccept = async (requestId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.patch(
        `${BASE_URL}/support-requests/${requestId}`,
        { status: 'accepted' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Request accepted successfully.');
      // Update state locally to avoid re-fetching
      setSupportRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept the request.');
    }
  };

  // Reject a support request
  const handleReject = async (requestId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.patch(
        `${BASE_URL}/support-requests/${requestId}`,
        { status: 'rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Request rejected successfully.');
      // Update state locally to avoid re-fetching
      setSupportRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.error('Error rejecting request:', error);
      Alert.alert('Error', 'Failed to reject the request.');
    }
  };

  // Refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchRequests();
  }, []);

  const renderRequestItem = ({ item }) => (
    <View className="bg-white p-4 rounded-lg shadow mb-4">
      <Text className="text-lg font-semibold">Username: {item.userId.username}</Text>
      <Text className="text-gray-600">Email: {item.userId.email}</Text>
      <Text className="text-gray-600">Status: {item.status}</Text>
      <View className="flex-row mt-4">
        <TouchableOpacity
          onPress={() => handleAccept(item._id)}
          className="flex-1 bg-green-500 p-3 rounded-lg mr-2"
        >
          <Text className="text-white text-center font-bold">Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleReject(item._id)}
          className="flex-1 bg-red-500 p-3 rounded-lg"
        >
          <Text className="text-white text-center font-bold">Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pb-4 pt-2 bg-white shadow flex-row items-center">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
                <Text className="text-2xl font-bold ml-4 text-gray-800">Customer Care</Text>
            </View>
      {loading ? (
        <Text className="text-center text-gray-500">Loading...</Text>
      ) : supportRequests.length > 0 ? (
        <FlatList
          data={supportRequests}
          keyExtractor={(item) => item._id}
          renderItem={renderRequestItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text className="text-center text-gray-500">No support requests found.</Text>
      )}
    </SafeAreaView>
  );
};

export default CustomerCareScreen;
