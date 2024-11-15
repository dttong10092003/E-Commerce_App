import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import icons from './constants/icons';
const ChatBubble = ({ role, text, onSpeech }) => {
  return (
    <View className={`flex-row ${role === "user" ? "justify-end" : "justify-start"} mb-4`}>
      {role === "model" && (
        <Image source={icons.bot} className="w-10 h-10 rounded-full mr-3" />
      )}
      <View 
        className={`p-4 rounded-xl max-w-[75%] relative ${role === "user" ? "bg-gray-300 self-end" : "bg-blue-500 self-start"}`}
      >
        {role === "model" && <Text className="text-base text-white">TTBot</Text>}
        <Text className={`text-base ${role === "user" ? "text-gray-800" : "text-white"} mt-1`}>
          {text}
        </Text>
        {role === "model" && (
          <TouchableOpacity
            onPress={onSpeech}
            className="absolute right-2 top-2"
          >
            <Ionicons name="volume-high-outline" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ChatBubble;
