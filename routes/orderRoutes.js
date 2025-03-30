const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const orderController = require('../controllers/orderController');

// Create new order
router.post('/', auth, orderController.createOrder);

// Get order by ID
router.get('/:id', auth, orderController.getOrder);

// Get user's orders
router.get('/user/orders', auth, orderController.getUserOrders);

// Cancel order
router.patch('/:id/cancel', auth, orderController.cancelOrder);

// ADMIN ROUTES
const adminAuth = require('../middlewares/adminAuth');

// Get all orders (admin)
router.get('/', adminAuth, orderController.getAllOrders);

// Update order status (admin)
router.patch('/:id/status', adminAuth, orderController.updateOrderStatus);

module.exports = router;