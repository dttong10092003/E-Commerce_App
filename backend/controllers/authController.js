// controllers/authController.js
const mongoose = require('mongoose');

const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const createUserReward = require('./userRewardController').createUserReward;

// Đăng ký người dùng
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Tạo tên mặc định từ email (phần trước dấu @)
    const defaultUsername = email.split('@')[0];

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới với username mặc định
    const user = await User.create({ email, password: hashedPassword, username: defaultUsername });

    // Khởi tạo UserReward cho người dùng mới
    await createUserReward(user._id);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đăng nhập người dùng
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email or password is incorrect' });
    }

    // Tạo token JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy thông tin chi tiết của một người dùng theo ID
const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateUsername = async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid user ID' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { username }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Username updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const authenticateToken = (req, res, next) => {
  // Lấy token từ header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
  }

  // Xác minh token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid Token' });
    }
    // Lưu thông tin người dùng từ token vào req để sử dụng ở các controller khác
    req.user = user;
    next();
  });
};


// Cấu hình transporter để gửi email qua Gmail
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// API quên mật khẩu
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Tạo mật khẩu mới ngẫu nhiên
    const newPassword = Math.random().toString(36).slice(-6); // Lấy 6 ký tự ngẫu nhiên
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Mã hóa mật khẩu mới

    // Cập nhật mật khẩu mới trong MongoDB
    user.password = hashedPassword;
    await user.save();

    // Gửi email với mật khẩu mới
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your New Password for Stylish",
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #ED1B26;">Hello,</h2>
      <p>We received a request to reset your password for your <strong>Stylish</strong> account. Here is your new password:</p>
      <p style="font-size: 1.2em; color: #C41C8B;"><strong>${newPassword}</strong></p>
      <p>Please use this password to log in and make sure to change it to something more secure in your account settings.</p>
      <p>If you didn't request this change, please contact our support team immediately.</p>
      <br/>
      <p>Thank you,</p>
      <p>The <strong>Stylish</strong> Team</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin-top: 20px;"/>
      <p style="font-size: 0.9em; color: #666;">This is an automated message, please do not reply.</p>
    </div>
  `,
    });

    res.status(200).json({ message: "A new password has been sent to your email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateAvatar = async (req, res) => {
  const { id } = req.params;
  const { avatar } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid user ID' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { avatar }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Avatar updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser, getAllUsers, getSingleUser, updateUsername, getCurrentUser, updatePassword, authenticateToken, forgotPassword,updateAvatar};