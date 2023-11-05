const Order = require('../models/order');
const Product = require('../models/products')

exports.userOrder = async (req, res) => {

    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const orderData = req.body;
    try {
        const userId = req.user._id;
        userOrder = new Order({
            user: req.user._id,
            products: [],
            totalPrice: 0,
        });

        let totalPrice = userOrder.totalPrice;
        for (const item of orderData) {
            const product = await Product.findById(item.id);
            console.log("product name", product)
            if (!product) {
                console.log('Product not found:', item.product);
                return res.status(400).json({ error: 'Product not found' });
            }

            totalPrice += product.price * item.quantity;
            userOrder.products.push({
                product: item.id,
                quantity: item.quantity,
            });
        }
        userOrder.totalPrice = totalPrice;
        const savedOrder = await userOrder.save();
        res.json({ message: 'Order received successfully', order: savedOrder });
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getOrders = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const userId = req.user._id;
        const userOrders = await Order.find({ user: userId }).populate({
            path: 'products',
            populate: {
                path: 'product',
            },
        });
        const userOrders1 = await Order.find({ user: userId }).populate('products.product')
        res.render('order/userOrder', { userOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user orders' });
    }
};

exports.placedOrder = async (req, res) => {
    res.render('order/placedOrder')
}