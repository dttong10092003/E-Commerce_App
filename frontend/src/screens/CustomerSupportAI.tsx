import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { speak, isSpeakingAsync, stop } from 'expo-speech';
import icons from '../constants/icons';
import ChatBubble from '../ChatBubble';
import { useNavigation } from '@react-navigation/native';
import { Picker } from 'emoji-mart-native';

interface ApiResponse {
  candidates?: {
    content?: {
      parts?: { text: string }[];
    };
  }[];
}

const CustomerSupportScreenAI = () => {
  const navigation = useNavigation();
  const [chat, setChat] = useState([
    {
      role: 'model',
      parts: [{ text: 'Xin chào, tôi là TTBot, trợ lý kỹ thuật số của bạn. Tôi sẽ sẵn sàng giúp bạn tìm hiểu về Stylish.' }],
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [emojiLoaded, setEmojiLoaded] = useState(false);

  const API_KEY = "AIzaSyDCUL3qbBW7bzat1Fvgbc-al48xGBziK78";

  useEffect(() => {
    const loadEmojiData = async () => {
      setEmojiLoaded(false);
      setTimeout(() => {
        setEmojiLoaded(true);
      }, 1000);
    };
    loadEmojiData();
  }, []);

  const handleEmojiSelect = (emoji) => {
    setUserInput(userInput + emoji.native);
    setEmojiPickerVisible(false);
  };

  const handleUserInput = async () => {
    let updatedChat = [
      ...chat,
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ];
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: updatedChat,
        }
      );
      console.log("Gemini Pro API Response:", response.data);
      const modelResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (modelResponse) {
        const updatedChatWithModel = [
          ...updatedChat,
          {
            role: "model",
            parts: [{ text: modelResponse }],
          },
        ];
        setChat(updatedChatWithModel);
        setUserInput(""); // Xóa nội dung trong TextInput sau khi gửi
      }
    } catch (error) {
      console.error("Error call API:", error);
      setError("Error calling API. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = async (text: string) => {
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
    } else {
      if (!(await isSpeakingAsync())) {
        speak(text);
        setIsSpeaking(true);
      }
    }
  };

  const renderChatItem = ({ item }) => (
    <ChatBubble
      role={item.role}
      text={item.parts[0].text}
      onSpeech={() => handleSpeech(item.parts[0].text)}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Image source={icons.bot} className="w-10 h-10 rounded-full mx-2" />
        <View className="flex-1">
          <Text className="font-bold text-lg text-gray-800">TTBot</Text>
        </View>
      </View>
      <FlatList
        data={chat}
        renderItem={renderChatItem}
        keyExtractor={(item, index) => index.toString()}
        className="flex-1 bg-gray-100 bg-white"
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      {/* Message Input */}
      <View className="flex-row items-center p-2 border-t border-gray-100 bg-white">
        <TouchableOpacity onPress={() => setEmojiPickerVisible(true)} className="mx-2">
          <Ionicons name="happy-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TextInput
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 bg-gray-100 text-base text-gray-800"
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
          onChangeText={setUserInput}
          value={userInput} // Liên kết với state để xóa khi gửi tin nhắn
        />

        <TouchableOpacity className="mx-2">
          <Ionicons name="mic-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity className="mx-2">
          <Ionicons name="image-outline" size={24} color="#333" />
        </TouchableOpacity>

        {userInput.trim() !== '' && (
          <TouchableOpacity onPress={handleUserInput} className="ml-2">
            <Ionicons name="send" size={24} color="#3B82F6" />
          </TouchableOpacity>
        )}
      </View>

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

      {loading && <ActivityIndicator className="mt-5" color="#333" />}
      {error && <Text className="text-red-500 mt-5 text-center">{error}</Text>}
    </SafeAreaView>
  );
};

export default CustomerSupportScreenAI;
