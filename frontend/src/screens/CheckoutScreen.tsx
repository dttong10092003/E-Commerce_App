import React, { useState, useEffect, useCallback, act } from 'react';
import { TextInput, View, Text, Image, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '../constants/icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';
import { useFocusEffect } from '@react-navigation/native';
import { Product } from '../constants/types';

const formatAddress = (address) => {
    const { street, district, city, country } = address;
    return `${street}, ${district}, ${city}, ${country}`;
};

const CheckoutScreen = ({ route, navigation }) => {
    const { cartData, totalAmount } = route.params;

    const [userID, setUserID] = useState<string | null>(null);
    const [promoModalVisible, setPromoModalVisible] = useState(false);
    const [availableVouchers, setAvailableVouchers] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [address, setAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);

    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('dhl');
    const [selectedVouchers, setSelectedVouchers] = useState({ deliver: null, coupon: null });

    const [shippingCost, setShippingCost] = useState(15);
    const [discountedTotal, setDiscountedTotal] = useState(totalAmount);

    // const orderData = {
    //     userId: userID,
    //     products: cartData,
    //     totalAmount: discountedTotal + shippingCost,
    //     shippingAddress: address,
    //     paymentMethod,
    //     deliveryMethod: selectedDeliveryMethod,
    //     shippingCost,
    //     discountAmount: totalAmount - discountedTotal,
    // };

    // console.log("orderData:", orderData);
    // console.log(orderData.shippingAddress);
    // console.log(orderData.paymentMethod);
    // console.log(orderData.deliveryMethod);
    // console.log(orderData.totalAmount);
    // console.log(orderData.shippingCost);
    // console.log(orderData.discountAmount);

    useEffect(() => {
        const fetchUserID = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (token) {
                    const response = await axios.get<{ _id: string }>(`${BASE_URL}/auth/user`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.status === 200) {
                        const user = response.data;  // Chỉ lấy _id từ response
                        setUserID(user._id);
                    }
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        fetchUserID();
    }, []);

    const handleSubmitOrder = async () => {
        if (!userID) {
            Alert.alert("Error", "User ID not found. Please log in again.");
            return;
        }
    
        if (!address || !paymentMethod) {
            Alert.alert("Error", "Please provide both a shipping address and payment method.");
            return;
        }
    
        try {
            // Kiểm tra tồn kho từng sản phẩm
            const stockCheckPromises = cartData.map(async (item) => {
                const response = await axios.get<Product>(`${BASE_URL}/products/${item.product._id}`);
                const product = response.data;
    
                // Tìm variant và size phù hợp trong sản phẩm
                const variant = product.variants.find(v => v.color === item.selectedColor);
                if (!variant) {
                    throw new Error(`Color ${item.selectedColor} not found for ${product.name}`);
                }
    
                const sizeOption = variant.sizes.find(s => s.size === item.selectedSize);
                if (!sizeOption) {
                    throw new Error(`Size ${item.selectedSize} not available for color ${item.selectedColor} in ${product.name}`);
                }
    
                if (sizeOption.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name} (${item.selectedColor}, size ${item.selectedSize}). Available: ${sizeOption.stock}, requested: ${item.quantity}`);
                }
            });
    
            // Thực hiện kiểm tra tồn kho
            await Promise.all(stockCheckPromises);
    
            // Dữ liệu đơn hàng
            const orderData = {
                userId: userID,
                products: cartData,
                totalAmount: discountedTotal + shippingCost,
                shippingAddress: address,
                paymentMethod,
                deliveryMethod: selectedDeliveryMethod,
                shippingCost,
                discountAmount: totalAmount - discountedTotal,
            };
    
            // Gửi yêu cầu tạo đơn hàng
            const response = await axios.post(`${BASE_URL}/orders`, orderData, {
                headers: { Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}` },
            });
    
            if (response.status === 201) {
                Alert.alert("Success", "Your order has been placed successfully.");
    
                // Xóa giỏ hàng của người dùng
                await axios.delete(`${BASE_URL}/cart/${userID}`, {
                    headers: { Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}` },
                });
    
                // Cập nhật tồn kho sau khi đặt hàng thành công
                const stockUpdatePromises = cartData.map(async (item) => {
                    await axios.patch(`${BASE_URL}/products/${item.product._id}/update-stock`, {
                        color: item.selectedColor,
                        size: item.selectedSize,
                        quantity: item.quantity,
                        action: 'subtract',
                    }, {
                        headers: { Authorization: `Bearer ${await AsyncStorage.getItem('authToken')}` },
                    });
                });
    
                await Promise.all(stockUpdatePromises);
    
                navigation.navigate("Cart"); // chuyển sang Cart trước khi GoBack() sẽ về Cart
                navigation.navigate("MyOrders");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            const errorMessage = error.response?.data?.message || "Failed to place the order.";
            Alert.alert("Error", errorMessage);
        }
    };
    
    

    const applyVoucher = (voucher) => {
        if (voucher.type === 'deliver') {
            setSelectedVouchers(prevState => ({ ...prevState, deliver: voucher }));
            setShippingCost(0); // Nếu voucher là free delivery, đặt phí giao hàng thành 0
        } else if (voucher.type === 'coupon') {
            setSelectedVouchers(prevState => ({ ...prevState, coupon: voucher }));
            const discountRate = parseFloat(voucher.discount) / 100; // Tính phần trăm giảm giá từ voucher
            setDiscountedTotal(totalAmount * (1 - discountRate)); // Áp dụng giảm giá vào tổng tiền
        }
        setPromoModalVisible(false);
    };


    const removeVoucher = (type) => {
        setSelectedVouchers(prevState => ({ ...prevState, [type]: null }));
        if (type === 'deliver') {
            setShippingCost(15); // Khôi phục phí giao hàng nếu hủy voucher free delivery
        } else if (type === 'coupon') {
            setDiscountedTotal(totalAmount); // Khôi phục tổng giá nếu hủy voucher giảm giá
        }
    };

    const handleSelectMethod = (method) => {
        setSelectedDeliveryMethod(method);
        switch (method) {
            case 'fedex':
                setShippingCost(25);
                break;
            case 'usps':
                setShippingCost(20);
                break;
            case 'dhl':
                setShippingCost(15);
                break;
            default:
                setShippingCost(15);
        }
    };
    const fetchUserRewards = async () => {
        const token = await AsyncStorage.getItem('authToken');
        try {
            const response = await axios.get(`${BASE_URL}/user-rewards`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { availableVouchers } = response.data as any || {};
            setAvailableVouchers(availableVouchers);
        } catch (error) {
            console.error('Error fetching user rewards:', error);
        }
    };

    const fetchDefaultPaymentMethod = async () => {
        const token = await AsyncStorage.getItem('authToken');
        try {
            const response = await axios.get(`${BASE_URL}/payment-methods/default`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data) {
                setPaymentMethod(response.data);
            } else {
                setPaymentMethod(null);
            }
        } catch (error) {
            setPaymentMethod(null);
        }
    };
    const fetchDefaultAddress = async () => {
        const token = await AsyncStorage.getItem('authToken');
        try {
            const response = await axios.get(`${BASE_URL}/shipping-addresses/default`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                setAddress(response.data); // Cập nhật địa chỉ mặc định từ API
            }
        } catch (error) {
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDefaultAddress();
            fetchAvailableVouchers();
            fetchDefaultPaymentMethod();
            fetchUserRewards();
        }, [])
    );
    const fetchAvailableVouchers = async () => {
        const token = await AsyncStorage.getItem('authToken');
        try {
            const response = await axios.get(`${BASE_URL}/user-rewards`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { availableVouchers } = response.data as any || {};
            const updatedAvailableVouchers = (availableVouchers || []).map(voucher => ({
                ...voucher,
                icon: voucher.type === 'deliver' ? icons.deliver : icons.coupon,
                name: voucher.name || (voucher.type === 'deliver' ? 'Delivery Voucher' : 'Discount Voucher')
            })).sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());

            setAvailableVouchers(updatedAvailableVouchers);
        } catch (error) {
            console.error('Error fetching available vouchers:', error);
            Alert.alert('Error', 'Failed to fetch available vouchers');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 flex-1">
                {/* Header */}
                <View className="flex-row items-center mb-2">
                    <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
                    <Text className="text-2xl font-bold ml-2">Checkout</Text>
                </View>

                {/* Content Scrollable Area */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}>
                    {/* Shipping Address Section */}
                    <Text className="text-lg font-semibold mb-3">Shipping address</Text>
                    <View className="bg-white p-4 rounded-lg mb-6 shadow-sm flex-row justify-between items-center border border-gray-200" >
                        <View className="flex-1">
                            {address ? (
                                <>
                                    <View className="flex-row items-center">
                                        <Text className="text-lg font-semibold">{address.name}</Text>
                                        <Ionicons name="call-outline" size={16} color="gray" style={{ marginHorizontal: 6 }} />
                                        <Text className="text-lg">{address.phoneNumber}</Text>
                                    </View>
                                    <Text className="text-gray-600 mt-1">{formatAddress(address)}</Text>
                                </>
                            ) : (
                                <Text className="text-gray-600">Address not found</Text>
                            )}
                        </View>
                        {/* <TouchableOpacity onPress={() => navigation.navigate('EditAddress', { address })}> */}
                        <TouchableOpacity onPress={() => navigation.navigate('ShippingAddresses')}>
                            <Text className="text-red-500 font-medium">Change</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Payment Section */}
                    <Text className="text-lg font-semibold mb-3">Payment</Text>
                    <View
                        // onPress={() => navigation.navigate('PaymentMethods')}
                        className="flex-row items-center justify-between bg-white p-4 rounded-lg mb-6 shadow-sm border border-gray-200">
                        <View className="flex-row items-center space-x-4">
                            {paymentMethod ? (
                                <>
                                    <Image
                                        source={paymentMethod.cardType === 'mastercard' ? icons.mastercard : icons.visa}

                                        className="w-10 h-10" resizeMode="contain" />
                                    <Text className="text-gray-600">**** **** **** {paymentMethod.cardNumber.slice(-4)}</Text>
                                </>
                            ) : (
                                <Text className="text-gray-600">Not found payment method</Text>
                            )}
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('PaymentMethods')}>
                            <Text className="text-red-500 font-medium">Change</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Delivery Method Section */}
                    <Text className="text-lg font-semibold mb-3">Delivery method</Text>
                    <View className="flex-row justify-between mb-6">
                        <TouchableOpacity
                            onPress={() => handleSelectMethod('fedex')}
                            className={`flex-1 bg-white rounded-lg p-3 shadow-sm items-center mx-1 border ${selectedDeliveryMethod === 'fedex' ? 'border-black' : 'border-gray-200'}`}
                        >
                            <Image source={icons.fedex} className="w-20 h-8 mb-2" resizeMode="contain" />
                            <Text className="text-gray-600">1-2 days</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleSelectMethod('usps')}
                            className={`flex-1 bg-white rounded-lg p-3 shadow-sm items-center mx-1 border ${selectedDeliveryMethod === 'usps' ? 'border-black' : 'border-gray-200'}`}
                        >
                            <Image source={icons.usps} className="w-20 h-8 mb-2" resizeMode="contain" />
                            <Text className="text-gray-600">2-3 days</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleSelectMethod('dhl')}
                            className={`flex-1 bg-white rounded-lg p-3 shadow-sm items-center mx-1 border ${selectedDeliveryMethod === 'dhl' ? 'border-black' : 'border-gray-200'}`}
                        >
                            <Image source={icons.dhl} className="w-20 h-8 mb-2" resizeMode="contain" />
                            <Text className="text-gray-600">5-7 days</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Promo Code Section */}
                <View className="flex-row bg-white rounded-lg p-3 mb-2 items-center shadow-md">
                    {!selectedVouchers.deliver && !selectedVouchers.coupon ? (
                        <TextInput
                            placeholder="Enter your promo code"
                            className="flex-1 text-base h-10"
                        />
                    ) : (
                        <View className="flex-1 flex-row items-center h-10">
                            {selectedVouchers.deliver && (
                                <View className="flex-row items-center mr-2 bg-gray-100 p-2 rounded-lg">
                                    <Image source={icons.deliver} className="w-4 h-4 mr-2" resizeMode="contain" />
                                    <Text className="text-sm mr-2">{selectedVouchers.deliver.name}</Text>
                                    <TouchableOpacity onPress={() => removeVoucher('deliver')}>
                                        <Text className="text-gray-500 font-bold">✕</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            {selectedVouchers.coupon && (
                                <View className="flex-row items-center bg-gray-100 p-2 rounded-lg">
                                    <Image source={icons.coupon} className="w-4 h-4 mr-2" resizeMode="contain" />
                                    <Text className="text-sm mr-2">{selectedVouchers.coupon.name}</Text>
                                    <TouchableOpacity onPress={() => removeVoucher('coupon')}>
                                        <Text className="text-gray-500 font-bold">✕</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                    <TouchableOpacity
                        className="bg-black rounded-full p-2 ml-2"
                        onPress={() => setPromoModalVisible(true)}
                    >
                        <Image source={icons.next1} className="w-5 h-5" />
                    </TouchableOpacity>
                </View>




                {/* Order Summary Section and Submit Button */}
                <View className="px-4 pb-4">
                    <View className="mt-4 mb-6">
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-base text-gray-600">Order:</Text>
                            <Text className="text-base font-semibold">${totalAmount.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-base text-gray-600">Delivery:</Text>
                            <Text className="text-base font-semibold">${shippingCost.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-base text-gray-600">Summary:</Text>
                            <Text className="text-base font-bold text-red-500">${(discountedTotal + shippingCost).toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Submit Order Button */}
                    <TouchableOpacity className="bg-red-500 rounded-full py-4 items-center shadow-md" onPress={handleSubmitOrder}>
                        <Text className="text-white font-bold text-lg">SUBMIT ORDER</Text>
                    </TouchableOpacity>
                </View>

                {/* Promo Code Modal */}
                <Modal
                    visible={promoModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setPromoModalVisible(false)}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Làm mờ nền
                        }}
                    >
                        <View className="bg-white rounded-t-2xl p-5 w-full shadow-xl max-h-[80%]">
                            {/* Nút đóng modal */}
                            <TouchableOpacity
                                onPress={() => setPromoModalVisible(false)}
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 15,
                                    zIndex: 1,
                                }}
                            >
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>✕</Text>
                            </TouchableOpacity>

                            <Text className="text-2xl font-bold mb-5 text-center">Your Promo Codes</Text>

                            {/* Hiển thị 7 voucher đầu tiên nếu không nhấn View More */}
                            {(showAll ? availableVouchers : availableVouchers.slice(0, 7)).map((voucher, index) => (
                                <View
                                    key={index}
                                    className="flex-row justify-between items-center p-4 bg-gray-100 rounded-xl mb-3"
                                >
                                    <View className="w-12 h-12 flex items-center justify-center">
                                        <Image
                                            source={voucher.type === 'deliver' ? icons.deliver : icons.coupon}
                                            style={{ width: 48, height: 48 }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <View className="flex-1 ml-4">
                                        <Text className="text-base font-semibold">{voucher.name}</Text>
                                        <Text className="text-sm text-gray-500">{voucher.code}</Text>
                                        <Text className="text-sm text-gray-500">{voucher.daysRemaining} days remaining</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => applyVoucher(voucher)} className="bg-red-500 rounded-lg px-4 py-2">
                                        <Text className="text-white font-semibold">Apply</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {/* Nút "View More" */}
                            {!showAll && availableVouchers.length > 7 && (
                                <TouchableOpacity
                                    onPress={() => setShowAll(true)}
                                    className="bg-blue-500 rounded-lg px-4 py-2 mt-3"
                                >
                                    <Text className="text-white font-semibold text-center">View More</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </Modal>




            </View>
        </SafeAreaView>
    );
};

export default CheckoutScreen;
