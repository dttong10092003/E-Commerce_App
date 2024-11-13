import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from 'emoji-mart-native';
import icons from '../constants/icons';
import * as ImagePicker from 'expo-image-picker';

type Message = {
  id: string;
  sender: 'user' | 'support';
  text?: string;
  time: string;
  imageUri?: string;
  isAudio?: boolean;
  audioDuration?: string;
};

const CustomerSupportScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'support', text: 'Hello! Nazrul How are you?', time: '09:25 AM' },
    { id: '2', sender: 'user', text: 'You did your job well!', time: '09:25 AM' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [showTime, setShowTime] = useState<{ [key: string]: boolean }>({});
  const [isOnline, setIsOnline] = useState(true);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [emojiLoaded, setEmojiLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const loadEmojiData = async () => {
      setEmojiLoaded(false);
      setTimeout(() => {
        setEmojiLoaded(true);
      }, 1000);
    };
    loadEmojiData();
  }, []);

  const toggleTimeVisibility = (id: string) => {
    setShowTime((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: String(messages.length + 1),
        sender: 'user',
        text: newMessage,
        time: '09:26 AM',
      };
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const message: Message = {
        id: String(messages.length + 1),
        sender: 'user',
        imageUri: result.assets[0].uri,
        time: '09:26 AM',
      };
      setMessages((prevMessages) => [...prevMessages, message]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(newMessage + emoji.native);
    setEmojiPickerVisible(false);
  };

  const handleImagePress = (uri: string) => {
    setSelectedImage(uri);
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      onPress={() => (item.imageUri ? handleImagePress(item.imageUri) : toggleTimeVisibility(item.id))}
      className={`flex-row ${item.sender === 'user' ? 'justify-end' : ''} items-center my-2 px-4`}
    >
      {item.sender === 'support' && (
        <Image source={icons.profile} className="w-10 h-10 rounded-full mr-2" />
      )}
      <View
        className={`${item.imageUri ? '' : item.sender === 'user' ? 'bg-green-600' : 'bg-gray-200'} ${
          item.imageUri ? '' : 'p-3 rounded-lg'
        } max-w-[75%]`}
      >
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} className="w-48 h-48 rounded-lg" />
        ) : (
          <Text className={`${item.sender === 'user' ? 'text-white' : 'text-black'}`}>{item.text}</Text>
        )}
        {showTime[item.id] && <Text className="text-xs text-gray-500 text-right mt-1">{item.time}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Image source={icons.profile} className="w-10 h-10 rounded-full mx-2" />
        <View className="flex-1">
          <Text className="font-bold text-lg text-gray-800">Jhon Abraham</Text>
          <View className="flex-row items-center">
            <View className={`w-2.5 h-2.5 rounded-full mr-1 ${isOnline ? 'bg-green-600' : 'bg-gray-400'}`} />
            <Text className={`${isOnline ? 'text-green-600' : 'text-gray-400'} text-sm`}>
              {isOnline ? 'Active now' : 'Offline'}
            </Text>
          </View>
        </View>
        <Ionicons name="call-outline" size={24} color="#333" style={{ marginRight: 20 }} />
        <Ionicons name="videocam-outline" size={24} color="#333" />
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        className="flex-1 bg-gray-100 bg-white"
        contentContainerStyle={{ paddingVertical: 10 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Fullscreen Image Modal */}
      <Modal visible={!!selectedImage} transparent={true} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black bg-opacity-80 justify-center items-center"
          onPress={() => setSelectedImage(null)}
          activeOpacity={1}
        >
          {selectedImage && (
            <Image source={{ uri: selectedImage }} className="w-[90%] h-[70%] rounded-lg" resizeMode="contain" />
          )}
        </TouchableOpacity>
      </Modal>

      {/* Emoji Picker Modal */}
      <Modal visible={emojiPickerVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white p-5">
            {emojiLoaded ? (
              <Picker onSelect={handleEmojiSelect} />
            ) : (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
            <TouchableOpacity onPress={() => setEmojiPickerVisible(false)} className="items-center mt-3">
              <Text className="text-blue-500 text-base">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Message Input */}
      <View className="flex-row items-center p-2 border-t border-gray-100 bg-white">
        <TouchableOpacity onPress={() => setEmojiPickerVisible(true)} className="mx-2">
          <Ionicons name="happy-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Write your message"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 bg-gray-100 text-base text-gray-800"
        />
        <TouchableOpacity className="mx-2">
          <Ionicons name="mic-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSelectImage} className="mx-2">
          <Ionicons name="image-outline" size={24} color="#333" />
        </TouchableOpacity>

        {newMessage.trim() !== '' && (
          <TouchableOpacity onPress={handleSend} className="ml-2">
            <Ionicons name="send" size={24} color="#28a745" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CustomerSupportScreen;
