
const Product = require("../models/product");
const router = require("../routes/auth");

const showAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('products/index', { products });
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
};

const productForm = (req, res) => {
    try {
        res.render('products/new');
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, img, desc, price, category } = req.body;
        await Product.create({ name, img, price: parseFloat(price), desc, category, author: req.user._id });
        req.flash('success', 'Successfully added a new product!');
        res.redirect('/all-products');
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
};





const showProduct = async (req, res) => {
    try {
        const { id } = req.params; 
        const product = await Product.findById(id).populate('reviews'); // Fetch product and associated reviews
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/products');
        }
        res.render('products/show', { product });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong');
        res.redirect('/products');
    }
};




  

const editProductForm = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).render('error', { err: 'Product not found' });
        }

        res.render('products/edit', { product });
    } 
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, img, desc, category } = req.body;
        await Product.findByIdAndUpdate(id, { name, price, desc, img, category });
        req.flash('success', 'Edit Your Product Successfully');
        res.redirect(`/products/${id}`);
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.redirect('/all-products');
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
};
module.exports = { showAllProducts, productForm, createProduct, showProduct, editProductForm, updateProduct, deleteProduct, };
