const Category = require("../models/catogery");
const Product = require("../models/products");
const { requireAuth } = require('../middleware');


exports.getCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('category/index', { categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve categories' });
    }
}

exports.createCategory = async (req, res) => {
    try {

        const newCategory = new Category({
            name: req.body.name,
        });


        const dummyProducts = [
            {
                name: "Bestseller Novel",
                price: 19.99,
                description: "A captivating novel by a renowned author.",
                availability: true,
            },
            {
                name: "Textbook - Science",
                price: 49.99,
                description: "Comprehensive science textbook for students.",
                availability: true,
            },
            {
                name: "Colorful Sketchbook",
                price: 9.99,
                description: "High-quality sketchbook for artists and creatives.",
                availability: true,
            },
            {
                name: "Ballpoint Pen Set",
                price: 7.99,
                description: "Set of fine-point ballpoint pens for writing.",
                availability: true,
            },
            {
                name: "Notebook Bundle",
                price: 14.99,
                description: "A bundle of stylish and functional notebooks.",
                availability: true,
            },
            {
                name: "Educational Puzzle Book",
                price: 12.99,
                description: "Fun and educational puzzle book for all ages.",
                availability: true,
            },
            {
                name: "Scientific Calculator",
                price: 19.99,
                description: "Advanced scientific calculator for math and science students.",
                availability: true,
            },
            {
                name: "Fiction Anthology",
                price: 16.99,
                description: "Collection of short stories by various authors.",
                availability: true,
            },
            {
                name: "Stationery Set",
                price: 22.99,
                description: "Comprehensive set of stationery items for students and professionals.",
                availability: true,
            },
            {
                name: "Art Supplies Kit",
                price: 29.99,
                description: "Complete art supplies kit for creative projects.",
                availability: true,
            },
        ];

        for (const productData of dummyProducts) {
            const product = new Product({
                ...productData,
                categoryId: newCategory._id, // Associate the product with the new category
            });

            await product.save();
            newCategory.products.push(product);
        }
        await newCategory.save();

        res.status(201).json({ message: 'Category and products added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add category and products' });
    }
};