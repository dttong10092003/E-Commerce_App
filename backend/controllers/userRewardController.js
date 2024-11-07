const UserReward = require('../models/userRewardModel');
const User = require('../models/userModel');
const { text } = require('express');

// Lấy thông tin reward của người dùng
const fetchUserRewards = async (req, res) => {
  try {
      const userId = req.user.id;
      let userReward = await UserReward.findOne({ userId });

      // Nếu UserReward chưa tồn tại, khởi tạo mới
      if (!userReward) {
          userReward = await UserReward.create({
              userId,
              attendance: [false, false, false, false, false, false, false],
              spinCount: 0,
              rewardHistory: [],
              availableVouchers: []
          });
      }

      res.status(200).json(userReward);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching user rewards', error: error.message });
  }
};

// Xử lý điểm danh
// const checkInUser = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const userReward = await UserReward.findOne({ userId });

//     if (!userReward) {
//       return res.status(404).json({ message: 'User reward not found' });
//     }

//     const currentTime = Date.now();
//     const lastCheckInTime = userReward.lastCheckIn ? new Date(userReward.lastCheckIn).getTime() : 0;

//     // Kiểm tra nếu thời gian giữa lần điểm danh cuối và hiện tại nhỏ hơn 1 phút
//     if (lastCheckInTime && (currentTime - lastCheckInTime < 60000)) {
//       const timeRemaining = Math.ceil((60000 - (currentTime - lastCheckInTime)) / 1000);
//       return res.status(400).json({ 
//         message: `You need to wait for ${timeRemaining} seconds to check in again.` 
//       });
//     }

//     // Cập nhật mảng điểm danh
//     const newAttendance = [...userReward.attendance];
//     const dayIndex = newAttendance.findIndex(day => !day);
//     if (dayIndex !== -1) {
//       newAttendance[dayIndex] = true;
//     } else {
//       // Nếu đã điểm danh đủ 7 ngày, đặt lại tất cả và bắt đầu lại từ đầu
//       newAttendance.fill(false);
//       newAttendance[0] = true;
//     }

//     userReward.attendance = newAttendance;
//     userReward.lastCheckIn = new Date();
//     userReward.spinCount += 1;

//     // Lưu cập nhật
//     await userReward.save();
    
//     // Trả về dữ liệu sau khi cập nhật
//     res.status(200).json({ 
//       message: 'Check-in successful', 
//       attendance: userReward.attendance,
//       lastCheckIn: userReward.lastCheckIn,
//       spinCount: userReward.spinCount,
//       rewardHistory: userReward.rewardHistory || []
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const checkInUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userReward = await UserReward.findOne({ userId });

    if (!userReward) {
      return res.status(404).json({ message: 'User reward not found' });
    }

    const currentDate = new Date();
    const lastCheckInDate = userReward.lastCheckIn ? new Date(userReward.lastCheckIn) : null;

    // Kiểm tra nếu lastCheckIn đã qua ngày mới
    const canCheckInToday =
      !lastCheckInDate || 
      currentDate.getFullYear() !== lastCheckInDate.getFullYear() ||
      currentDate.getMonth() !== lastCheckInDate.getMonth() ||
      currentDate.getDate() !== lastCheckInDate.getDate();

    if (!canCheckInToday) {
      return res.status(400).json({ message: 'You can only check in once per day.' });
    }

    // Cập nhật mảng điểm danh
    const newAttendance = [...userReward.attendance];
    const dayIndex = newAttendance.findIndex(day => !day);
    if (dayIndex !== -1) {
      newAttendance[dayIndex] = true;
    } else {
      // Nếu đã điểm danh đủ 7 ngày, đặt lại tất cả và bắt đầu lại từ đầu
      newAttendance.fill(false);
      newAttendance[0] = true;
    }

    userReward.attendance = newAttendance;
    userReward.lastCheckIn = currentDate;
    userReward.spinCount += 1;

    // Lưu cập nhật
    await userReward.save();

    // Trả về dữ liệu sau khi cập nhật
    res.status(200).json({ 
      message: 'Check-in successful', 
      attendance: userReward.attendance,
      lastCheckIn: userReward.lastCheckIn,
      spinCount: userReward.spinCount,
      rewardHistory: userReward.rewardHistory || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Xử lý quay thưởng
const handleSpin = async (req, res) => {
  try {
    const userId = req.user.id;
    const userReward = await UserReward.findOne({ userId });

    if (!userReward || userReward.spinCount <= 0) {
      return res.status(400).json({ message: 'No spins available' });
    }

    const rewards = [
      { text: "Voucher free delivery", icon: "deliver_icon_path", name: "Free Delivery", discount: "", type: "deliver" },
      { text: "Voucher discount 10%", icon: "coupon_icon_path", name: "10% Discount", discount: "10%", type: "coupon" },
      { text: "Voucher discount 20%", icon: "coupon_icon_path", name: "20% Discount", discount: "20%", type: "coupon" },
      { text: "Voucher discount 30%", icon: "coupon_icon_path", name: "30% Discount", discount: "30%", type: "coupon" },
      { text: "Voucher free delivery", icon: "deliver_icon_path", name: "Free Delivery", discount: "", type: "deliver" },

    ];
    
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const daysRemaining = 30;

    console.log("Selected reward:", randomReward);  

    if (randomReward.text.includes("Voucher")) {
      userReward.availableVouchers.push({
        name: randomReward.name,
        discount: randomReward.discount,
        code,
        daysRemaining,
        icon: randomReward.icon,
        type: randomReward.type
      });
    }

    userReward.rewardHistory.push({
      text: randomReward.text,
      icon: randomReward.icon,
      code,
      daysRemaining,
      time: new Date(),
      type: randomReward.type
    });

    userReward.spinCount -= 1;
    await userReward.save();

    res.status(200).json({ message: 'Spin successful', reward: randomReward });
  } catch (error) {
    console.error("Error during spin:", error);  // Debugging line
    res.status(500).json({ error: error.message });
  }
};

const createUserReward = async (userId) => {
  const userReward = new UserReward({
    userId,
    attendance: [false, false, false, false, false, false, false],
    spinCount: 0,
    rewardHistory: [],
    availableVouchers: []
  });
  await userReward.save();
};


module.exports = { fetchUserRewards, checkInUser, handleSpin,createUserReward  };
