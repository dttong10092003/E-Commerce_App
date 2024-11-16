// controllers/supportRequestController.js
const SupportRequest = require('../models/supportRequestModel');
const User = require('../models/userModel');

// Tạo yêu cầu hỗ trợ
const createSupportRequest = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Kiểm tra nếu `userId` tồn tại trong database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Kiểm tra nếu yêu cầu hỗ trợ đã tồn tại
    const existingRequest = await SupportRequest.findOne({ userId, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'Yêu cầu hỗ trợ đã tồn tại.' });
    }

    // Tạo yêu cầu hỗ trợ mới
    const newRequest = await SupportRequest.create({ userId });
    res.status(201).json({ message: 'Yêu cầu hỗ trợ đã được tạo.', newRequest });
  } catch (error) {
    console.error('Error creating support request:', error);
    res.status(500).json({ error: error.message });
  }
};


// Lấy danh sách yêu cầu hỗ trợ (cho admin)
const getSupportRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find({ status: 'pending' }).populate('userId', 'username email');
    if (requests.length === 0) {
      return res.status(404).json({ message: 'Không có yêu cầu hỗ trợ nào.' });
    }
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching support requests:', error);
    res.status(500).json({ error: error.message });
  }
};


// Cập nhật trạng thái yêu cầu
const updateSupportRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await SupportRequest.findByIdAndUpdate(id, { status }, { new: true });
    if (!request) {
      return res.status(404).json({ message: 'Yêu cầu hỗ trợ không tồn tại.' });
    }

    res.status(200).json({ message: 'Cập nhật trạng thái thành công.', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa yêu cầu hỗ trợ
const deleteSupportRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await SupportRequest.findByIdAndDelete(id);
    if (!request) {
      return res.status(404).json({ message: 'Yêu cầu hỗ trợ không tồn tại.' });
    }

    res.status(200).json({ message: 'Xóa yêu cầu hỗ trợ thành công.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSupportRequest,
  getSupportRequests,
  updateSupportRequestStatus,
  deleteSupportRequest,
};
