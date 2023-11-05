const express = require('express');
const router = express.Router();
const orderController = require("../controllers/orderController")
const { requireAuth } = require('../middleware')

router.post('/submit-order', requireAuth, orderController.userOrder)
router.get('/orders', requireAuth, orderController.getOrders)
router.get('/thankYou', requireAuth, orderController.placedOrder)


module.exports = router;