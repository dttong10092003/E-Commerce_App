// routes/shippingAddressRoute.js
const express = require('express');
const { getUserShippingAddresses, addShippingAddress, updateShippingAddress, deleteShippingAddress,setDefaultAddress } = require('../controllers/shippingAddressController');
const { authenticateToken } = require('../controllers/authController');

const router = express.Router();

router.get('/', authenticateToken, getUserShippingAddresses);
router.post('/', authenticateToken, addShippingAddress);
router.patch('/:id', authenticateToken, updateShippingAddress);
router.delete('/:id', authenticateToken, deleteShippingAddress);
router.patch('/:addressId/set-default', authenticateToken, setDefaultAddress);

module.exports = router;
