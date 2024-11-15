import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from 'emoji-mart-native';
import icons from '../constants/icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import { TypingAnimation } from 'react-native-typing-animation';


type Message = {
  id: string;
  sender: 'user' | 'support';
  text?: string;
  time: string;
  imageUri?: string;
  options?: string[];
};

const CustomerSupportScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [emojiLoaded, setEmojiLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Danh sách các câu hỏi về quần áo
  const relatedQuestions = [
    "Làm sao để chọn size quần áo phù hợp?",
    "Các loại vải nào phù hợp với mùa hè?",
    "Làm sao để bảo quản quần áo lâu bền?",
    "Mua quần áo theo phong cách nào thì hợp xu hướng?",
  ];
  const responses = {
    "Làm sao để chọn size quần áo phù hợp?": "Để chọn size phù hợp, bạn nên đo các số đo cơ bản như vòng ngực, vòng eo, và chiều dài cơ thể.",
    "Các loại vải nào phù hợp với mùa hè?": "Các loại vải như cotton, linen và bamboo rất phù hợp cho mùa hè vì chúng thoáng khí và nhẹ nhàng.",
    "Làm sao để bảo quản quần áo lâu bền?": "Bạn nên giặt quần áo theo hướng dẫn, tránh phơi dưới ánh nắng trực tiếp và bảo quản nơi thoáng mát.",
    "Mua quần áo theo phong cách nào thì hợp xu hướng?": "Phong cách basic và tối giản đang là xu hướng, dễ phối đồ và phù hợp nhiều hoàn cảnh."
  };

  useEffect(() => {
    const loadEmojiData = async () => {
      setEmojiLoaded(false);
      setTimeout(() => {
        setEmojiLoaded(true);
      }, 1000);
    };
    loadEmojiData();

    const initializeMessages = async () => {
      const userId = await fetchUserData();
      if (userId) {
        const hasHistory = await fetchMessageHistory(userId);
        if (!hasHistory) {
          sendWelcomeMessage();
        }
      }
    };

    initializeMessages();
  }, []);

  interface UserData {
    _id: string;
    username: string;
    email: string;
  }

  const fetchUserData = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.get<UserData>(`${BASE_URL}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const userId = response.data._id;
          await AsyncStorage.setItem('userId', userId); // Lưu userId vào AsyncStorage
          return userId; // Trả về userId
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      }
    }
    return null; // Trả về null nếu không có userId
  };


  const fetchMessageHistory = async (userId: string) => {
    try {
      const response = await axios.get<Message[]>(`${BASE_URL}/messages/${userId}`);
      if (response.status === 200) {
        let loadedMessages = response.data;

        // Kiểm tra nếu tin nhắn chào mừng chưa có, thêm vào
        if (!loadedMessages.some(message => message.sender === 'support' && message.text === 'Xin chào, tôi là TTStaff, trợ lý của bạn. Tôi sẽ sẵn sàng giúp bạn tìm hiểu về Stylish. Nhập câu hỏi của bạn hoặc chọn một tùy chọn:')) {
          loadedMessages = [createWelcomeMessage(), ...loadedMessages];
        }

        setMessages(loadedMessages);
        return true; // Có lịch sử tin nhắn
      }
    } catch (error) {
      console.error('Error fetching message history:', error);
    }
    return false; // Không có lịch sử tin nhắn
  };


  const createWelcomeMessage = (): Message => {
    return {
      id: `welcome_${Date.now()}`, // Tạo `id` duy nhất cho mỗi tin nhắn chào mừng
      sender: 'support',
      text: 'Xin chào, tôi là TTStaff, trợ lý của bạn. Tôi sẽ sẵn sàng giúp bạn tìm hiểu về Stylish. Nhập câu hỏi của bạn hoặc chọn một tùy chọn:',
      time: getCurrentTime(),
      options: ['Liên hệ nhân viên', 'Đặt lại mật khẩu', 'Câu hỏi khác'],
    };
  };

  const sendWelcomeMessage = () => {
    setMessages((prevMessages) => [createWelcomeMessage(), ...prevMessages]);
  };



  const handleOptionSelect = async (option: string) => {
    if (option === 'Câu hỏi khác') {
      setQuestionModalVisible(true); // Hiển thị modal khi chọn "Câu hỏi khác"
      return;
    }

    const userMessage: Message = {
      id: String(messages.length + 1),
      sender: 'user',
      text: option,
      time: getCurrentTime(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    saveMessage(userMessage);

    let response: Message;
    if (option === 'Liên hệ nhân viên') {
      response = {
        id: String(messages.length + 2),
        sender: 'support',
        text: 'Nhân viên sẽ sớm liên hệ với bạn!',
        time: getCurrentTime(),
      };
    } else if (option === 'Đặt lại mật khẩu') {
      response = {
        id: String(messages.length + 2),
        sender: 'support',
        text: 'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.',
        time: getCurrentTime(),
      };
    }

    setMessages((prevMessages) => [...prevMessages, response]);
    saveMessage(response);
  };
  const handleQuestionSelect = (question: string) => {
    setQuestionModalVisible(false);
    const userMessage: Message = {
      id: String(messages.length + 1),
      sender: 'user',
      text: question,
      time: getCurrentTime(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    saveMessage(userMessage);

    setIsTyping(true); // Bắt đầu trạng thái nhập
    setTimeout(() => {
      const botResponse: Message = {
        id: String(messages.length + 2),
        sender: 'support',
        text: responses[question],
        time: getCurrentTime(),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      saveMessage(botResponse);
      setIsTyping(false); // Kết thúc trạng thái nhập
    }, 1500); // Thời gian chờ để tạo hiệu ứng
  };
  const saveMessage = async (message: Message) => {
    const token = await AsyncStorage.getItem('authToken');
    const userId = await AsyncStorage.getItem('userId');
    if (token && userId) {
      try {
        await axios.post(
          `${BASE_URL}/messages`,
          { ...message, userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Error saving message:', error);
      }
    }
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: String(messages.length + 1),
        sender: 'user',
        text: newMessage,
        time: getCurrentTime(),
      };
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
      flatListRef.current?.scrollToEnd({ animated: true });
      saveMessage(message);
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
        time: getCurrentTime(),
      };
      setMessages((prevMessages) => [...prevMessages, message]);
      flatListRef.current?.scrollToEnd({ animated: true });
      saveMessage(message);
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(newMessage + emoji.native);
    setEmojiPickerVisible(false);
  };

  const handleImagePress = (uri: string) => {
    setSelectedImage(uri);
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View className={`flex-row ${item.sender === 'user' ? 'justify-end' : ''} items-center my-3 px-4`}>
      {item.sender === 'support' && <Image source={icons.bot} className="w-10 h-10 rounded-full mr-3" />}
      <View className={`${item.sender === 'user' && !item.imageUri ? 'bg-green-700' : item.sender === 'support' ? 'bg-gray-100' : ''} p-4 rounded-2xl max-w-[75%] shadow-md`}>
        {item.text && (
          <Text className={`text-base ${item.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>{item.text}</Text>
        )}
        {item.imageUri && (
          <TouchableOpacity onPress={() => handleImagePress(item.imageUri)} className="mt-2">
            <Image source={{ uri: item.imageUri }} className="w-48 h-48 rounded-lg shadow-lg" />
          </TouchableOpacity>
        )}
        {item.options && (
          <View className="mt-3 flex-row flex-wrap">
            {item.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleOptionSelect(option)}
                className="bg-blue-50 px-4 py-2 mr-2 mt-2 rounded-full"
              >
                <Text className="text-blue-600 font-semibold">{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <Text className="text-xs text-gray-400 text-right mt-2">{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Image source={icons.bot} className="w-10 h-10 rounded-full mx-2" />
        <View className="flex-1">
          <Text className="font-bold text-lg text-gray-800">TTStaff</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        className="flex-1 bg-gray-100 bg-white"
        contentContainerStyle={{ paddingVertical: 10 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      {isTyping && (
        <View className="flex-row items-center px-4 py-2">
          <Image source={icons.bot} className="w-8 h-8 rounded-full mr-2" />
          <TypingAnimation
            dotColor="gray"
            dotMargin={4}
            dotAmplitude={3}
            dotSpeed={0.15}
            dotRadius={3}
            dotX={10}
            dotY={6}
          />
        </View>
      )}
      {/* Fullscreen Image Modal */}
      <Modal visible={!!selectedImage} transparent={true} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Thanh công cụ */}
          <View style={{ position: 'absolute', top: 40, right: 20, flexDirection: 'row' }}>
            {/* Nút đóng */}
            <TouchableOpacity onPress={() => setSelectedImage(null)} style={{ marginRight: 15 }}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            {/* Nút tải xuống */}
            <TouchableOpacity  style={{ marginRight: 15 }}>
              <Ionicons name="download-outline" size={24} color="white" />
            </TouchableOpacity>
            {/* Nút chỉnh sửa */}
            <TouchableOpacity >
              <Ionicons name="create-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Hình ảnh */}
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: '90%', height: '80%', borderRadius: 10 }}
              resizeMode="contain"
            />
          )}
        </View>
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

      {/* Modal for Related Questions */}
      <Modal visible={questionModalVisible} transparent={true} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <View className="bg-white p-5 rounded-lg w-11/12 max-w-md">
            <Text className="text-lg font-semibold mb-3 text-left">Các câu hỏi liên quan</Text>
            {relatedQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleQuestionSelect(question)}
                className="py-3 px-4 mb-2 bg-gray-100 rounded-lg border border-gray-300 w-full"
              >
                <Text className="text-gray-800 text-left">{question}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setQuestionModalVisible(false)} className="mt-5 items-center">
              <Text className="text-blue-500 font-semibold">Đóng</Text>
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
