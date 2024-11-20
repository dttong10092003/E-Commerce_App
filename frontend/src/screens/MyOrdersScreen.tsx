import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

const StarRating = ({ rating, setRating }) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 10 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={30}
            color={star <= rating ? "#FFD700" : "#C0C0C0"} // Vàng cho sao được chọn, xám cho sao chưa chọn
            style={{ marginHorizontal: 5 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const FeedbackModal = ({
  isVisible,
  onClose,
  onSubmit,
  selectedOrder,
  rating,
  setRating,
  comment,
  setComment,
}) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ backgroundColor: "white", width: "90%", padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Leave Feedback</Text>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Order: {selectedOrder?._id}</Text>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Rate the products:</Text>

          {/* Star Rating */}
          <StarRating rating={rating} setRating={setRating} />

          {/* Comment Input */}
          <TextInput
            placeholder="Write your comment..."
            value={comment}
            onChangeText={setComment}
            style={{
              borderWidth: 1,
              borderColor: "#C0C0C0",
              borderRadius: 10,
              padding: 10,
              marginVertical: 10,
              height: 80,
              textAlignVertical: "top",
            }}
           
          />

          {/* Actions */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            <TouchableOpacity onPress={onClose} style={{ padding: 10, backgroundColor: "#E0E0E0", borderRadius: 5 }}>
              <Text style={{ fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSubmit}
              style={{ padding: 10, backgroundColor: "#FFD700", borderRadius: 5 }}
            >
              <Text style={{ fontSize: 16, color: "black", fontWeight: "bold" }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface ShippingAddress {
  name: string;
  phoneNumber: string;
  street: string;
  district: string;
  city: string;
  country: string;
}

interface PaymentMethod {
  cardType: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
}

interface Product {
  product: string; // Assuming this is the Product ID
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  subTotal: number;
}

type OrderStatus = 'Processing' | 'Shipping' | 'Delivered' | 'Canceled';
type DeliveryMethod = 'fedex' | 'usps' | 'dhl';

interface Order {
  _id: string;
  user: string; // User ID reference
  products: Product[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  shippingCost: number;
  discountAmount: number;
  orderStatus: OrderStatus;
  orderDate: Date;
  canceledDate?: Date | null;
  deliveredDate?: Date | null;
}

const OrderCard = ({ order, onPress, onCancel, onFeedback }) => {
  const { _id, totalAmount, orderStatus, products } = order;
  const formattedDate = new Date(
    orderStatus === 'Delivered' ? order.deliveredDate :
    orderStatus === 'Canceled' ? order.canceledDate :
    order.orderDate
  ).toLocaleString();
  console.log("order:", order);
  console.log("products:", products);

  const handleCancelOrder = () => {
    Alert.alert(
      "Confirm Cancellation",
      "Are you sure you want to cancel this order?",
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: async () => {
            await onCancel(_id); // Gọi hàm hủy đơn hàng
            await restoreStock(); // Cập nhật lại tồn kho
          },
        },
      ]
    );
  };

  const restoreStock = async () => {
    const token = await AsyncStorage.getItem('authToken');
    const stockUpdatePromises = order.products.map(async (item) => {
      try {
        await axios.patch(
          `${BASE_URL}/products/${item.product._id}/update-stock`,
          {
            color: item.selectedColor,
            size: item.selectedSize,
            quantity: item.quantity,
            action: 'add', // Cộng lại số lượng sản phẩm
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error("Error updating stock for canceled order:", error);
      }
    });

    await Promise.all(stockUpdatePromises);
  };

  return (
  <View className="bg-white p-4 rounded-lg my-2 mx-4 shadow-md">
    <Text className="absolute right-2 top-1 text-gray-400">{formattedDate}</Text>
    <Text className="text-lg font-semibold mt-1">Order: {_id}</Text>
    <View className="flex-row justify-between mt-2">
        <Text className="text-gray-600">
          Items: <Text className="text-black font-semibold">{products.length}</Text>
        </Text>
        <Text className="text-gray-600">
          Total Amount: <Text className="text-black font-semibold">${totalAmount.toFixed(2)}</Text>
        </Text>
    </View>
    <View className="flex-row justify-between items-center mt-4">
      <TouchableOpacity onPress={onPress} className="border border-gray-300 px-4 py-1 rounded-full">
        <Text className="text-black font-medium">Details</Text>
      </TouchableOpacity>
      {orderStatus === 'Processing' && (
          <TouchableOpacity onPress={handleCancelOrder} className="bg-red-500 px-4 py-1 rounded-full">
            <Text className="text-white font-medium">Cancel Order</Text>
          </TouchableOpacity>
        )}
        {orderStatus === "Delivered" && !order.hasFeedback && (
          <TouchableOpacity onPress={() => onFeedback(order)} className="bg-blue-500 px-4 py-1 rounded-full">
            <Text className="text-white font-medium">Leave Feedback</Text>
          </TouchableOpacity>
        )}
        <Text
          className={`font-semibold ${
            orderStatus === 'Delivered'
              ? 'text-green-500'
              : orderStatus === 'Processing'
              ? 'text-orange-500'
              : orderStatus === 'Shipping'
              ? 'text-yellow-500'
              : 'text-red-500'
          }`}
        >
          {orderStatus}
        </Text>
    </View>
  </View>
);
};

const fetchUserID = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      const response = await axios.get<{ _id: string }>(`${BASE_URL}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        return response.data._id; // Trả về user ID
      }
    }
  } catch (error) {
    console.error("Error fetching user ID:", error);
  }
  return null;
};

const MyOrdersScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Processing');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const checkFeedbackForOrder = async (orderId) => {
    try {
      const response = await axios.get<{hasFeedback: boolean}>(`${BASE_URL}/feedback/check/${orderId}`);
      return response.data.hasFeedback;
    } catch (error) {
      console.error("Error checking feedback for order:", error);
      return false;
    }
  };

  const fetchOrders = async () => {
    const fetchedUserID = await fetchUserID();
    if (!fetchedUserID) {
      Alert.alert("Error", "Failed to fetch user ID. Please log in again.");        
      return;
    }

    console.log(`${BASE_URL}/orders/user/${fetchedUserID}`);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const response = await axios.get<Order[]>(`${BASE_URL}/orders/user/${fetchedUserID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ordersWithFeedbackInfo = await Promise.all(
          response.data.map(async (order) => {
            if (order.orderStatus === "Delivered") {
              const hasFeedback = await checkFeedbackForOrder(order._id);
              return { ...order, hasFeedback };
            }
            return { ...order, hasFeedback: true }; 
          })
        );

        setOrders(ordersWithFeedbackInfo);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Error", "Failed to fetch orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const handleFeedback = (order) => {
    setSelectedOrder(order);
    setFeedbackModalVisible(true);
  };

  const submitFeedback = async () => {
    try {
      const uniqueProducts = selectedOrder.products.reduce((acc, item) => {
        if (item.product && item.product._id && !acc.find((p) => p.product._id === item.product._id)) {
          acc.push(item);
        }
        return acc;
      }, []);

      const feedbackPromises = uniqueProducts.map(async (product) => {
        try {
          await axios.post(
            `${BASE_URL}/feedback`,
            {
              userId: selectedOrder.user,
              orderId: selectedOrder._id,
              productId: product.product._id,
              rating,
              comment,
            }
          );
        } catch (error) {
          console.error(`Error submitting feedback for product ${product.product._id}:`, error);
        }
      });

      await Promise.all(feedbackPromises);

      Alert.alert("Feedback Submitted", "Thank you for your feedback!");
      setFeedbackModalVisible(false);
      setRating(5);
      setComment("");
      await fetchOrders();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Alert.alert("Error", "Failed to submit feedback.");
    }
  };
  

  const handleCancelOrder = async (orderId: string) => {
    const token = await AsyncStorage.getItem('authToken');
    try {
      await axios.patch(
        `${BASE_URL}/orders/${orderId}/status`,
        { orderStatus: 'Canceled' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Order Canceled", "Your order has been canceled.");
      fetchOrders();
    } catch (error) {
      console.error("Error canceling order:", error);
      Alert.alert("Error", "Failed to cancel the order.");
    }
  };

  // Lọc đơn hàng theo trạng thái và sắp xếp theo ngày
  const filteredOrders = orders
    .filter((order) => order.orderStatus === activeTab)
    .sort((a, b) => {
      const dateA = new Date(
        activeTab === 'Delivered' ? a.deliveredDate :
        activeTab === 'Canceled' ? a.canceledDate :
        a.orderDate
      );
      const dateB = new Date(
        activeTab === 'Delivered' ? b.deliveredDate :
        activeTab === 'Canceled' ? b.canceledDate :
        b.orderDate
      );
      return dateB.getTime() - dateA.getTime(); // Sắp xếp từ mới tới cũ
    });

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 pb-2 flex-row items-center">
        <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text className="text-2xl font-bold ml-2">My Orders</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-around py-2 bg-white">
        {['Processing', 'Shipping', 'Delivered', 'Canceled'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text className={`text-lg font-medium ${activeTab === tab ? 'text-black' : 'text-gray-400'}`}>
              {tab}
            </Text>
            {activeTab === tab && <View className="h-1 bg-black mt-1 rounded-full w-full" />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Order List using FlatList */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => navigation.navigate('OrderDetail', { order: item })}
            onCancel={() => handleCancelOrder(item._id)}
            onFeedback={() => handleFeedback(item)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
        className="flex-1 mt-2"
        ListEmptyComponent={() => (
          <View className="items-center mt-10">
            <Text className="text-gray-500">No orders found for this status.</Text>
          </View>
        )}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isVisible={feedbackModalVisible}
        onClose={() => setFeedbackModalVisible(false)}
        onSubmit={submitFeedback}
        selectedOrder={selectedOrder}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
      />
    </SafeAreaView>
  );
};

export default MyOrdersScreen;
