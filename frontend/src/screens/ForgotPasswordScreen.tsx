import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CustomButton} from '../components';
import icons from '../constants/icons'; 

type Props = {}

const ForgotPasswordScreen = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  // const navigation = useNavigation();
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
  });

  type RootStackParamList = {
    Login: undefined;
    ForgotPassword: undefined;
  };
  const handleForgotPasswordSubmit = () => {
    // Xử lý logic gửi yêu cầu đặt lại mật khẩu
  };

  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
        <Image source={icons.back} style={styles.backIcon} /> 
      </TouchableOpacity>
      <Text style={styles.title}>Forgot Password?</Text>
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <Image
            source={icons.mail}
            style={styles.icon}
            resizeMode="contain"
          />
          <TextInput
            value={form.email}
            onChangeText={(text) => setForm({...form, email: text})}
            placeholder="Enter your email address"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <Text style={styles.noteText}>
          <Text style={styles.asterisk}>*</Text> We will send you a message to set or reset your new password
        </Text>
      </View>

      <CustomButton
        title="Submit"
        handlePress={handleForgotPasswordSubmit}
        isLoading={isSubmitting}
        containerStyle="py-5 bg-red-500"
        textStyle="text-white text-lg"
      />
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20, 
    backgroundColor: '#fff', 
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  title: {
    fontSize: 32, 
    fontWeight: 'bold', 
    textAlign: 'left',
  },
  inputWrapper: {
    marginTop: 40, 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  noteText: {
    color: '#575757',
    fontSize: 14, 
    marginTop: 10,
    marginBottom: 40, 
  },
  asterisk: {
    color: 'red',
    fontSize: 14,
  },
 
});
