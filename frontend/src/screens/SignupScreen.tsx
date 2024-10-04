import {View, Text, Image, ImageSourcePropType, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {CustomButton, FormField} from '../components';
import icons from '../constants/icons';

type Props = {};

const SignupScreen = (props: Props) => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    username: '', // Có thể bỏ username chỉ lấy email thôi
    password: '',
    confirmPassword: '',
  });

  type RootStackParamList = {
    ForgotPassword: undefined;
    Login: undefined;
  };

  const handleSignup = () => {
    // Xử lý logic đăng ký tài khoản
  };
  const handleSignInWithProvider = () => {
    // Xử lý đăng nhập bằng tài khoản mạng xã hội
  };
  const handleNavigateToLogin = () => {
    // navigation.navigate('Login'); // Có thể sài cái này nếu sử dụng ở vị trí khác
    navigation.goBack();
  };

  return (
    <SafeAreaView className="px-5 pt-5 flex-1 bg-white">
      <Text className='text-4xl font-bold text-start'>
        Create an{'\n'}account
      </Text>
      <View>
        
        <FormField
          title="Email"
          value={form.email}
          setError={setEmailError}
          error={emailError}
          handleChangeText={(e: any) => {
            setEmailError('');
            setForm({...form, email: e});
          }}
          placeholder="username or email"
          otherStyles="my-3"
        />
        
        <FormField
          title="Password"
          value={form.password}
          setError={setPasswordError}
          error={passwordError}
          handleChangeText={(e: any) => {
            setPasswordError('');
            setForm({...form, password: e});
          }}
          placeholder="Password"
          otherStyles="my-3"
        />

        <FormField
          title="Password"
          value={form.confirmPassword}
          setError={setPasswordError}
          error={passwordError}
          handleChangeText={(e: any) => {
            setPasswordError('');
            setForm({...form, password: e});
          }}
          placeholder="ConfirmPassword"
          otherStyles="my-3"
        />

        <Text className="text-[#676767] text-lg font-medium self-end my-3">
          By clicking the <Text className="text-red-600">Register</Text>{' '}
          button, you agree to the public offer
        </Text>
        
        
        <CustomButton
          title="Create Account"
          handlePress={handleSignup}
          isLoading={isSubmitting}
          containerStyle="mt-5 py-5"
        />
        
        <View className="mt-5 self-center">
          <Text className="text-[#575757] text-lg self-center mt-5">
            {' '}
            - Or Continue With -{' '}
          </Text>
          <View className="flex flex-row items-center gap-3 mt-5 justify-between">
            {ContinueWithData.map((item, index) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={handleSignInWithProvider}
                  className="rounded-full border-2 bg-red-50 border-red-500 p-4">
                  <Image
                    source={item.image}
                    className="w-8 h-8 "
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          <View className="flex flex-row  items-center gap-x-2 justify-center mt-8">
            <Text className="text-[#575757] text-xl ">I Already Have an Account</Text>
            <TouchableOpacity onPress={handleNavigateToLogin}>
              <Text className="text-xl font-bold underline text-action ">
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

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