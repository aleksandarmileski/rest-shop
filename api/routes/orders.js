const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders')

// Get Orders
router.get('/', checkAuth , OrdersController.orders_get_all)

// Create orders
router.post('/', checkAuth , OrdersController.orders_create_new)

// Get order
router.get('/:orderId', checkAuth , OrdersController.orders_get_order)

// Delete order
router.delete('/:orderId', checkAuth , OrdersController.orders_delete_order)

module.exports = router;   