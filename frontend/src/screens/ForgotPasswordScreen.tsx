import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomButton, FormField } from '../components';
import icons from '../constants/icons';
import axios from 'axios';
import BASE_URL from '../config';

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

type Props = {}

const ForgotPasswordScreen = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
  });

  const handleForgotPasswordSubmit = async () => {
    setEmailError('');

    if (!form.email) {
      setEmailError('Email is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Gửi yêu cầu đặt lại mật khẩu tới API
      const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
        email: form.email,
      });

      if (response.status === 200) {
        Alert.alert(
          'Success',
          'A password reset link has been sent to your email.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
    } catch (error) {
      console.error('Error sending password reset email:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'An error occurred while sending the password reset email.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="px-5 flex-1 bg-white">
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={icons.back} style={styles.backIcon} />
      </TouchableOpacity>

      <Text className="text-4xl font-bold text-start">
        Forgot{'\n'}Password?
      </Text>

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
          placeholder="Enter your email address"
          otherStyles="my-5"
        />
      </View>

      <Text className="text-[#676767] text-lg font-medium self-end">
        <Text className="text-red-600">*</Text> We will send you a message to set or reset your new password
      </Text>

      <CustomButton
        title="Submit"
        handlePress={handleForgotPasswordSubmit}
        isLoading={isSubmitting}
        containerStyle="py-5 mt-7"
      />
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles =StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
}
);
