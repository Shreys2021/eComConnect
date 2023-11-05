const Cart = require('../models/cart');
const Product = require('../models/products')

exports.addToCart = async (req, res) => {
    try {
        const productId = req.body.productId;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const userId = req.user._id;
        let userCart = await Cart.findOne({ userId });

        if (!userCart) {
            userCart = new Cart({ userId, products: [] });
        }
        userCart.products.push(productId);
        await userCart.save();
        res.redirect('/cartProducts')
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add the product to the cart' });
    }
}


exports.getCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const userId = req.user._id;
        const userCart = await Cart.findOne({ userId }).populate('products');

        if (!userCart) {
            return res.json({ message: 'Cart is empty', cart: [] });
        }
        res.render('cart/cartProduct', { userCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch the cart' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const userId = req.user._id;
        const userCart = await Cart.findOne({ userId });

        if (!userCart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        const productIndex = userCart.products.indexOf(productId);
        if (productIndex !== -1) {
            userCart.products.splice(productIndex, 1);
        }
        await userCart.save();

        res.redirect('/cartProducts')
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove the product from the cart' });
    }
};

exports.emptyCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const userId = req.user._id;
        const userCart = await Cart.findOne({ userId });

        if (!userCart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        userCart.products = [];

        await userCart.save();

        res.json({ message: 'Cart is empty' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to empty the cart' });
    }
};


