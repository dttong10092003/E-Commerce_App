// routes/paymentMethodRoute.js
const express = require('express');
const { getUserPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod,setDefaultPaymentMethod  } = require('../controllers/paymentMethodController');
const { authenticateToken } = require('../controllers/authController');

const router = express.Router();

router.get('/', authenticateToken, getUserPaymentMethods);
router.post('/', authenticateToken, addPaymentMethod);
router.patch('/:id', authenticateToken, updatePaymentMethod);
router.delete('/:id', authenticateToken, deletePaymentMethod);
router.patch('/:id/set-default', authenticateToken, setDefaultPaymentMethod);

module.exports = router;
