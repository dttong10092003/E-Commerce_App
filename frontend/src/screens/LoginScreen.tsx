import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormField, CustomButton } from '../components';
import icons from '../constants/icons';
import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

type Props = {};

type RootStackParamList = {
  ForgotPassword: undefined;
  Signup: undefined;
  HomeScreen: undefined;
};

interface LoginResponse {
  token: string;
}

const LoginScreen = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };
  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
  
    if (!form.email || !form.password) {
      if (!form.email) {
        Alert.alert('Error', 'Email is required.');
      }
      if (!form.password) {
        Alert.alert('Error', 'Password is required.');
      }
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const response = await axios.post<LoginResponse>(`${BASE_URL}/auth/login`, {
        email: form.email,
        password: form.password,
      });
  
      if (response.status === 200) {
        const { token } = response.data;
        // Lưu token vào SecureStore, AsyncStorage hoặc context tuỳ vào mục tiêu của bạn
        await AsyncStorage.setItem('authToken', token);
        navigation.navigate('HomeScreen');
      }
    } catch (error) {
      console.log('Error:', error);
  
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || 'Login failed';
        Alert.alert('Login Error', errorMessage);
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  // const handleLogin = () => { navigation.navigate('Signup');};
  

  const handleSignInWithProvider = () => {};
  
  const handleNavigateToSignUp = () => {
    navigation.navigate('Signup');
  };

  return (
    <SafeAreaView className="px-5 pt-5 flex-1 bg-white">
      <Text className="text-4xl font-bold text-start">
        Welcome{'\n'}Back!
      </Text>
      <View>
        <View>
          <FormField
            title="Email"
            value={form.email}
            setError={setEmailError}
            error={emailError}
            handleChangeText={(e: any) => {
              setEmailError('');
              setForm({ ...form, email: e });
            }}
            placeholder="Email"
            otherStyles="my-5"
          />
          {emailError ? (
            <Text className="text-red-500 mt-2">{emailError}</Text>
          ) : null}
        </View>
        
        <View>
          <FormField
            title="Password"
            value={form.password}
            setError={setPasswordError}
            error={passwordError}
            handleChangeText={(e: any) => {
              setPasswordError('');
              setForm({ ...form, password: e });
            }}
            placeholder="Password"
            otherStyles="mt-5"
          />
          {passwordError ? (
            <Text className="text-red-500 mt-2">{passwordError}</Text>
          ) : null}
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text className="text-red-600 text-lg font-medium self-end">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
        
        <CustomButton
          title="Login"
          handlePress={handleLogin}
          isLoading={isSubmitting}
          containerStyle="mt-7 py-5"
        />
        
        <View className="mt-5 self-center">
          <Text className="text-[#575757] text-lg self-center mt-5">
            {' '}
            - Or Continue With -{' '}
          </Text>
          <View className="flex flex-row items-center gap-3 mt-5 justify-between">
            {ContinueWithData.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={handleSignInWithProvider}
                className="rounded-full border-2 bg-red-50 border-red-500 p-4"
              >
                <Image
                  source={item.image}
                  className="w-8 h-8"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex flex-row items-center gap-x-2 justify-center mt-8">
            <Text className="text-[#575757] text-xl">Create An Account</Text>
            <TouchableOpacity onPress={handleNavigateToSignUp}>
              <Text className="text-xl font-bold underline text-action">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

type ContinueWithType = {
  image: ImageSourcePropType | undefined;
  id: number;
  name: string;
};

const ContinueWithData: ContinueWithType[] = [
  {
    id: 0,
    name: 'google',
    image: icons.google,
  },
  {
    id: 1,
    name: 'apple',
    image: icons.apple,
  },
  {
    id: 2,
    name: 'facebook',
    image: icons.facebook,
  },
];
