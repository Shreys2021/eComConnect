const express = require('express');
const router = express.Router();
const cartController = require("../controllers/cartController")
const { requireAuth } = require('../middleware')

router.post('/addToCart', requireAuth, cartController.addToCart)
router.get('/cartProducts', requireAuth, cartController.getCart)
router.delete('/remove-product/:productId', requireAuth, cartController.deleteProduct)
router.post('/empty-cart', requireAuth, cartController.emptyCart);

module.exports = router;