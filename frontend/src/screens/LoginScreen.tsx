import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {View, Text, Image, ImageSourcePropType, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {FormField, CustomButton } from '../components';
import icons from '../constants/icons';


type Props = {}

const LoginScreen = (props: Props) => {

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
  });

  type RootStackParamList = {
    ForgotPassword: undefined;
    Signup: undefined;
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleLogin = () => {};
  const handleSignInWithProvider = () => {};
  const handleNavigateToSignUp = () => {
    navigation.navigate('Signup');
  };

  return (
    <SafeAreaView className="px-5 pt-5 flex-1 bg-white">
      <Text className='text-4xl font-bold text-start'>
        Welcome{'\n'}Back!
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
          otherStyles="my-5"
        />
        <View>
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
            otherStyles="mt-5"
          />
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
            <Text className="text-[#575757] text-xl ">Create An Account</Text>
            <TouchableOpacity onPress={handleNavigateToSignUp}>
              <Text className="text-xl font-bold underline text-action ">
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