const Product = require('../models/products');
const Category = require('../models/catogery')

exports.getProducts = async (req, res) => {
    try {
        const categoryId = req.query.category;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const products = await Product.find({ categoryId: categoryId });

        res.render('products/index', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
}

exports.getProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.render('products/view', { product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve product details' });
    }
}