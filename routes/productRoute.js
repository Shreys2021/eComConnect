const express = require('express');
const router = express.Router();
const productController = require("../controllers/productController");

router.get('/products', productController.getProducts);
router.get('/product/:productId', productController.getProduct);

module.exports = router;