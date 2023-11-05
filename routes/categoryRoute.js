const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/categoryController")
const { requireAuth } = require('../middleware')



router.post('/addCategory', categoryController.createCategory);
router.get('/categories', categoryController.getCategory)

module.exports = router;