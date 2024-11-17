import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { Component, createRef } from "react";
import io from "socket.io-client";
import icons from "../constants/icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "emoji-mart-native";
import * as ImagePicker from "expo-image-picker";

const SOCKET_URL = "http://192.168.1.8:4000";

class ChatSocket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: "",
      chatMessages: [],
      emojiPickerVisible: false, // Show/hide emoji picker
      selectedImage: null, // Store selected image
    };
    this.scrollViewRef = createRef(); // Create ref for ScrollView
  }

  componentDidMount() {
    this.socket = io(SOCKET_URL);
    this.socket.on("chat message", (data) => {
      const { msg, imageUri, sender } = data;
      const isOwnMessage = sender === this.socket.id;
      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      this.setState((prevState) => ({
        chatMessages: [
          ...prevState.chatMessages,
          {
            message: msg || null,
            imageUri: imageUri || null,
            time: timestamp,
            isOwnMessage,
          },
        ],
      }));
    });
  }

  submitMessage() {
    if (this.state.chatMessage.trim()) {
      this.socket.emit("chat message", {
        msg: this.state.chatMessage,
        imageUri: null, // Không gửi imageUri nếu chỉ gửi text
      });
      this.setState({ chatMessage: "" }); // Xóa nội dung trong ô nhập liệu
    }
  }

  async handleSelectImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Permission to access gallery is required."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      this.socket.emit("chat message", {
        msg: null, // Không gửi msg nếu chỉ gửi hình ảnh
        imageUri: base64Image,
      });
    }
  }

  handleEmojiSelect = (emoji) => {
    this.setState((prevState) => ({
      chatMessage: prevState.chatMessage + emoji.native,
      emojiPickerVisible: false,
    }));
  };

  render() {
    const chatMessages = this.state.chatMessages.map((chat, index) => {
      if (!chat.message && !chat.imageUri) return null; // Bỏ qua tin nhắn rỗng

      return (
        <View
          key={index}
          className={`flex-row items-end my-2 ${
            chat.isOwnMessage ? "self-end" : "self-start"
          }`}
        >
          {!chat.isOwnMessage && (
            <Image source={icons.man} className="w-8 h-8 rounded-full mr-2" />
          )}
          <View
            className={`p-3 rounded-lg max-w-[70%] ${
              chat.isOwnMessage ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            {/* Hiển thị tin nhắn văn bản nếu có */}
            {chat.message && (
              <Text className="text-white text-base">{chat.message}</Text>
            )}

            {/* Hiển thị hình ảnh nếu có */}
            {chat.imageUri && (
              <TouchableOpacity
                onPress={() => this.setState({ selectedImage: chat.imageUri })}
              >
                <Image
                  source={{ uri: chat.imageUri }}
                  className="w-48 h-48 rounded-lg shadow-lg mt-2"
                />
              </TouchableOpacity>
            )}

            <Text className="text-gray-300 text-xs mt-2">{chat.time}</Text>
          </View>
        </View>
      );
    });

    return (
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center p-4 border-b border-gray-100">
          <Ionicons
            name="chevron-back"
            size={24}
            color="black"
            onPress={() => this.props.navigation.goBack()}
          />
          <Image source={icons.bot} className="w-10 h-10 rounded-full mx-2" />
          <View className="flex-1">
            <Text className="font-bold text-lg text-gray-800">TTStaff</Text>
          </View>
        </View>

        {/* Chat Container */}
        <ScrollView
          className="flex-1 px-4 py-4"
          contentContainerStyle={{
            paddingBottom: 50,
          }}
          ref={this.scrollViewRef}
        >
          {chatMessages}
        </ScrollView>

        {/* Emoji Picker Modal */}
        <Modal
          visible={this.state.emojiPickerVisible}
          transparent
          animationType="slide"
        >
          <View className="flex-1 justify-end bg-black bg-opacity-50">
            <View className="bg-white p-5">
              <Picker onSelect={this.handleEmojiSelect} />
              <TouchableOpacity
                onPress={() => this.setState({ emojiPickerVisible: false })}
                className="mt-3 items-center"
              >
                <Text className="text-blue-500">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Fullscreen Image Modal */}
        {/* Fullscreen Image Modal */}
        <Modal
          visible={!!this.state.selectedImage}
          transparent={true}
          animationType="fade"
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Toolbar */}
            <View
              style={{
                position: "absolute",
                top: 40,
                right: 20,
                flexDirection: "row",
              }}
            >
              {/* Close Button */}
              <TouchableOpacity
                onPress={() => this.setState({ selectedImage: null })}
                style={{ marginRight: 15 }}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              {/* Download Button */}
              <TouchableOpacity style={{ marginRight: 15 }}>
                <Ionicons name="download-outline" size={24} color="white" />
              </TouchableOpacity>
              {/* Edit Button */}
              <TouchableOpacity>
                <Ionicons name="create-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Display Full Image */}
            {this.state.selectedImage && (
              <Image
                source={{ uri: this.state.selectedImage }}
                style={{ width: "90%", height: "80%", borderRadius: 10 }}
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>

        {/* Message Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={10}
          className="flex-row items-center p-2 border-t border-gray-100 bg-white"
        >
          <TouchableOpacity
            onPress={() => this.setState({ emojiPickerVisible: true })}
            className="mx-2"
          >
            <Ionicons name="happy-outline" size={24} color="#333" />
          </TouchableOpacity>

          <TextInput
            value={this.state.chatMessage}
            onChangeText={(chatMessage) =>
              this.setState({ chatMessage: chatMessage })
            }
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 bg-gray-100 text-base text-gray-800"
          />

          <TouchableOpacity
            onPress={() => console.log("Mic Pressed")}
            className="mx-2"
          >
            <Ionicons name="mic-outline" size={24} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.handleSelectImage()}
            className="mx-2"
          >
            <Ionicons name="image-outline" size={24} color="#333" />
          </TouchableOpacity>

          {this.state.chatMessage.trim() !== "" && (
            <TouchableOpacity
              onPress={() => this.submitMessage()}
              className="ml-2"
            >
              <Ionicons name="send" size={24} color="#3B82F6" />
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default ChatSocket;
