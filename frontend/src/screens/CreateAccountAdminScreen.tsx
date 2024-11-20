import React, { useState} from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import BASE_URL from '../config';


const CreateAccountAdminScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateAdmin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/auth/register`, {
                email,
                password,
                role: 'admin', // Đặt role là admin
            });

            if (response.status === 201) {
                Alert.alert('Success', 'Admin account created successfully');
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 pb-4 pt-2 bg-white shadow flex-row items-center">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
                <Text className="text-2xl font-bold ml-4 text-gray-800">Create Account</Text>
            </View>
            {/* Form */}
            <View className="flex-1 px-4 py-4">
                <Text className="text-sm font-bold text-gray-700 mb-2">Email</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg p-3 mb-4"
                    placeholder="Enter email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Text className="text-sm font-bold text-gray-700 mb-2">Password</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg p-3 mb-4"
                    placeholder="Enter password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    onPress={handleCreateAdmin}
                    disabled={loading}
                    className={`${loading ? 'bg-gray-400' : 'bg-blue-500'
                        } py-3 rounded-lg items-center`}
                >
                    <Text className="text-white text-base font-semibold">
                        {loading ? 'Creating...' : 'Create Admin'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default CreateAccountAdminScreen;
