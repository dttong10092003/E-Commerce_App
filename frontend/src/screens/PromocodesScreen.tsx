import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import icons from '../constants/icons';

const PromocodesScreen = ({ navigation }) => {
    const [attendance, setAttendance] = useState([false, false, false, false, false, false, false]);
    const [lastCheckIn, setLastCheckIn] = useState(null);
    const [canCheckIn, setCanCheckIn] = useState(true);
    const [spinCount, setSpinCount] = useState(0);
    const [reward, setReward] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
    const [rewardHistory, setRewardHistory] = useState([]);
    const [availableVouchers, setAvailableVouchers] = useState([]);

    useEffect(() => {
        fetchUserRewards();
    }, []);

    useEffect(() => {
        checkCanCheckIn(lastCheckIn);
    }, [lastCheckIn]);

    const fetchUserRewards = async () => {
        const token = await AsyncStorage.getItem('authToken');
        try {
            const response = await axios.get(`${BASE_URL}/user-rewards`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const {
                attendance = [false, false, false, false, false, false, false],
                lastCheckIn,
                spinCount,
                rewardHistory,
                availableVouchers
            } = response.data as any || {};

            const updatedRewardHistory = (rewardHistory || []).map(item => ({
                ...item,
                icon: item.type === 'deliver' ? icons.deliver : icons.coupon,
                name: item.name || (item.type === 'deliver' ? 'Delivery Voucher' : 'Discount Voucher')
            })).sort((a, b) => new Date(b.time as string).getTime() - new Date(a.time as string).getTime());



            const updatedAvailableVouchers = (availableVouchers || []).map(voucher => ({
                ...voucher,
                icon: voucher.type === 'deliver' ? icons.deliver : icons.coupon,
                name: voucher.name || (voucher.type === 'deliver' ? 'Delivery Voucher' : 'Discount Voucher')
            })).sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());

            setAttendance(attendance);
            setLastCheckIn(lastCheckIn);
            setSpinCount(spinCount);
            setRewardHistory(updatedRewardHistory);
            setAvailableVouchers(updatedAvailableVouchers);
        } catch (error) {
            console.error('Error fetching user rewards:', error);
            Alert.alert('Error', 'Failed to fetch user rewards');
        }
    };

    // const checkCanCheckIn = (lastCheckInTime) => {
    //     if (lastCheckInTime) {
    //         const currentTime = Date.now();
    //         const timeSinceLastCheckIn = currentTime - new Date(lastCheckInTime).getTime();
    //         setCanCheckIn(timeSinceLastCheckIn >= 60000); // 1 minute = 60000 ms
    //     } else {
    //         setCanCheckIn(true);
    //     }
    // };

    const checkCanCheckIn = (lastCheckInTime) => {
        if (lastCheckInTime) {
            const currentDate = new Date();
            const lastCheckInDate = new Date(lastCheckInTime);

            // So sánh ngày, tháng và năm của thời điểm hiện tại với thời điểm điểm danh cuối cùng
            const isNewDay =
                currentDate.getFullYear() !== lastCheckInDate.getFullYear() ||
                currentDate.getMonth() !== lastCheckInDate.getMonth() ||
                currentDate.getDate() !== lastCheckInDate.getDate();

            setCanCheckIn(isNewDay);
        } else {
            setCanCheckIn(true);
        }
    };


    // Hàm điểm danh
    const handleCheckIn = async () => {
        const token = await AsyncStorage.getItem('authToken');
        if (canCheckIn) {
            try {
                const response = await axios.post(`${BASE_URL}/user-rewards/check-in`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const { attendance, lastCheckIn, spinCount, rewardHistory } = response.data as any;

                setAttendance(attendance);
                setLastCheckIn(lastCheckIn);
                setSpinCount(spinCount);
                setRewardHistory(rewardHistory);
                checkCanCheckIn(lastCheckIn);
                Alert.alert('Notification', 'Attendance successful!');
            } catch (error) {
                if (error.response) {
                    const errorMessage = error.response.data.message || 'Please try again.';
                    Alert.alert('Error', errorMessage);
                } else {
                    console.error('Error during check-in:', error.message);
                    Alert.alert('Error', 'An unexpected error occurred. Please try again.');
                }
            }
        } else {
            Alert.alert('You have taken attendance today, please come back tomorrow!');
        }
    };

    const handleSpin = async () => {
        const token = await AsyncStorage.getItem('authToken');
        if (spinCount > 0) {
            try {
                const response = await axios.post(`${BASE_URL}/user-rewards/spin`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const { reward, spinCount } = response.data as any;
                // Nếu phần thưởng là "Good luck next time", chỉ hiển thị modal và không lưu vào dữ liệu
                if (reward.text === "Good luck next time") {
                    setReward({
                        ...reward,
                        icon: icons.sad,
                        name: "Good Luck",
                    });
                    setSpinCount(spinCount);
                    setModalVisible(true);
                    return;
                }
                // Cập nhật `reward` với icon và name dựa trên `type`
                const updatedReward = {
                    ...reward,
                    icon: reward.type === 'deliver' ? icons.deliver : icons.coupon,
                    name: reward.name || (reward.type === 'deliver' ? 'Delivery Voucher' : 'Discount Voucher')
                };

                setReward(updatedReward);
                setSpinCount(spinCount);
                setRewardHistory(prev => [updatedReward, ...prev]);
                setModalVisible(true);

                fetchUserRewards();
            } catch (error) {
                console.error('Error during spin:', error);
                Alert.alert('Error', 'Failed to spin. Please try again.');
            }
        } else {
            Alert.alert('Bạn không có lượt quay nào!');
        }
    };


    const closeModalAndRefresh = () => {
        setModalVisible(false);
        fetchUserRewards();
    };

    const renderVoucherItem = ({ item }) => (
        <View className="flex-row items-center p-4 bg-white rounded-lg mb-4 shadow-md">
            <View className="bg-red-500 w-16 h-16 flex items-center justify-center rounded-lg mr-4">
                {item.icon ? (
                    <Image source={item.icon} style={{ width: 40, height: 40 }} resizeMode="contain" />
                ) : (
                    <Text className="text-white text-lg font-bold">{item.discount}</Text>
                )}
            </View>
            <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">{item.name || "Voucher"}</Text>
                <Text className="text-sm text-gray-600">Code: {item.code}</Text>
                <Text className="text-sm text-gray-600">{item.daysRemaining} days remaining</Text>
            </View>
            <TouchableOpacity className="bg-red-500 px-4 py-2 rounded-full">
                <Text className="text-white font-semibold">Apply</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 pb-4 pt-2 bg-white shadow flex-row items-center">
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
                <Text className="text-2xl font-bold ml-4 text-gray-800">Promocodes</Text>
            </View>

            <View className="flex-row items-center justify-between mb-4 px-4">
                <View className="flex-row items-center">
                    <Image source={icons.wheel} className="w-8 h-8 mr-2" resizeMode="contain" />
                    <Text className="text-lg font-semibold text-gray-800">{spinCount}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => setHistoryModalVisible(true)}
                    className="flex-row items-center"
                >
                    <Text className="text-lg font-semibold text-blue-500">History</Text>
                    <Ionicons name="chevron-forward" size={18} color="#3b82f6" />
                </TouchableOpacity>

            </View>

            <FlatList
                ListHeaderComponent={() => (
                    <View className="px-4 items-start">
                        <Text className="text-lg font-semibold text-gray-800 mb-4">Daily points</Text>
                        <View className="flex-row space-x-2 mb-6">
                            {attendance.map((checked, index) => (
                                <View
                                    key={index}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border ${checked ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'
                                        }`}
                                >
                                    {checked ? (
                                        <Ionicons name="checkmark" size={16} color="white" />
                                    ) : (
                                        <Text className="text-base font-bold text-gray-800">{index + 1}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity
                            onPress={handleCheckIn}
                            className="bg-blue-500 p-3 rounded-full shadow-lg flex items-center w-full mb-6"
                            activeOpacity={0.85}
                        >
                            <Text className="text-white text-lg font-semibold">Attendance</Text>
                        </TouchableOpacity>
                        <View className="w-full flex items-center justify-center">
                            <TouchableOpacity
                                onPress={handleSpin}
                                activeOpacity={spinCount > 0 ? 0.85 : 1}
                                style={{
                                    opacity: spinCount > 0 ? 1 : 0.5,
                                    marginBottom: 20,
                                }}
                                disabled={spinCount === 0}
                            >
                                <Image source={icons.gift} className="w-40 h-40" resizeMode="contain" />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-lg font-semibold mb-4 text-left">Available Vouchers</Text>
                    </View>
                )}
                data={availableVouchers}
                renderItem={renderVoucherItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
            />
            {/* Modal lịch sử phần thưởng */}
            <Modal
                visible={historyModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setHistoryModalVisible(false)}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                    <View style={{
                        width: '90%',
                        maxHeight: '62%',
                        padding: 25,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        position: 'relative',
                    }}>
                        <TouchableOpacity
                            onPress={() => setHistoryModalVisible(false)}
                            style={{
                                position: 'absolute',
                                top: 2,
                                right: 10,
                                zIndex: 10,
                            }}
                        >
                            <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#666' }}>x</Text>
                        </TouchableOpacity>

                        <FlatList
                            data={rewardHistory}
                            renderItem={({ item }) => {
                                // Kiểm tra type để quyết định icon và nội dung text
                                const icon = item.type === 'deliver' ? icons.deliver : icons.coupon;
                                const text = item.type === 'deliver' ? 'Free Delivery' : item.text;

                                return (
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 10,
                                        backgroundColor: '#FFF9E5',
                                        borderRadius: 8,
                                        marginBottom: 10,
                                    }}>
                                        {icon && <Image source={icon} style={{ width: 40, height: 40, marginRight: 10 }} />}
                                        <View>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{text}</Text>
                                            <Text style={{ fontSize: 12, color: '#666' }}>{new Date(item.time).toLocaleString()}</Text>
                                        </View>
                                    </View>
                                );
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingTop: 20 }}
                        />
                    </View>
                </View>
            </Modal>

            {/* Modal for reward display */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeModalAndRefresh}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                    onPress={closeModalAndRefresh}
                    activeOpacity={1}
                >
                    <View style={{
                        width: 300,
                        padding: 20,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        alignItems: 'center',
                    }}>
                        {reward && reward.icon && (
                            <Image source={reward.type === 'deliver' ? icons.deliver : icons.coupon} style={{ width: 64, height: 64, marginBottom: 10 }} resizeMode="contain" />
                        )}
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>{reward?.name || reward?.text}</Text>
                    </View>
                </TouchableOpacity>
            </Modal>

        </SafeAreaView>
    );
};

export default PromocodesScreen;
