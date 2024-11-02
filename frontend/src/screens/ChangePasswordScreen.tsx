import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChangePasswordScreen = ({ isVisible, onClose, onSave }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = (type) => {
    if (type === 'old') setShowOldPassword(!showOldPassword);
    if (type === 'new') setShowNewPassword(!showNewPassword);
    if (type === 'confirm') setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match!');
      return;
    }
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    try {
      await onSave(oldPassword, newPassword); // Gọi hàm onSave với oldPassword và newPassword
      Alert.alert('Success', 'Password changed successfully!');
      onClose();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update password');
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'flex-end' }}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ width: '100%' }}
            >
              <SafeAreaView className="bg-white p-4 rounded-t-2xl shadow-lg">
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                  <View className="h-1 w-16 bg-gray-300 rounded-full mb-2"></View>
                  <Text className="text-xl font-semibold">Password Change</Text>
                </View>

                {/* Old Password */}
                <View className="flex-row items-center bg-gray-100 p-3 rounded-md mt-4">
                  <TextInput
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    placeholder="Old Password"
                    secureTextEntry={!showOldPassword}
                    className="flex-1"
                  />
                  <TouchableOpacity onPress={() => toggleShowPassword('old')}>
                    <Ionicons name={showOldPassword ? "eye" : "eye-off"} size={20} color="gray" />
                    
                  </TouchableOpacity>
                </View>
               

                {/* New Password */}
                <View className="flex-row items-center bg-gray-100 p-3 rounded-md mt-2">
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="New Password"
                    secureTextEntry={!showNewPassword}
                    className="flex-1"
                  />
                  <TouchableOpacity onPress={() => toggleShowPassword('new')}>
                    <Ionicons name={showNewPassword ? "eye" : "eye-off"} size={20} color="gray" />
                  </TouchableOpacity>
                </View>

                {/* Confirm Password */}
                <View className="flex-row items-center bg-gray-100 p-3 rounded-md mt-2">
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repeat New Password"
                    secureTextEntry={!showConfirmPassword}
                    className="flex-1"
                  />
                  <TouchableOpacity onPress={() => toggleShowPassword('confirm')}>
                    <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="gray" />
                  </TouchableOpacity>
                </View>

                {/* Save Password Button */}
                <TouchableOpacity
                  onPress={handleSavePassword}
                  className="bg-red-500 p-3 rounded-full mt-6 items-center"
                >
                  <Text className="text-white font-medium">Save Password</Text>
                </TouchableOpacity>
              </SafeAreaView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ChangePasswordScreen;
