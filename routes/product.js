const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { validateProduct , isLoggedIn  , isSeller ,isProductAuthor} = require('../middleware');
const {showAllProducts, productForm , createProduct , showProduct , editProductForm , updateProduct , deleteProduct} =  require('../controllers/product')

/* router.get('/products', showAllProducts ); */


router.get('/products/new', isLoggedIn, isSeller, productForm);

router.post('/products', isLoggedIn, isSeller, validateProduct, createProduct);

router.get('/products/:id', isLoggedIn, showProduct);


router.get('/products/:id/edit',isLoggedIn,isProductAuthor, editProductForm);

router.patch('/products/:id', isLoggedIn, isProductAuthor, validateProduct, updateProduct);


router.delete('/products/:id',isLoggedIn,isProductAuthor,deleteProduct);


router.get("/products", async (req, res) => {
    try {
        const products = await Product.find().limit(8); // Fetch only 8 products
        res.render("products/index", { products });
    } catch (err) {
        res.status(500).send("Error fetching products");
    }
});



router.get("/all-products", async (req, res) => {
    try {
        const allProducts = await Product.find(); // Fetch all products
        res.render("products/all-products", { products: allProducts }); 
    } catch (err) {
        res.status(500).send("Error fetching products");
    }
});


router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.redirect('/products'); // Redirect if no query
        }

        
        const products = await Product.find({ $text: { $search: query } });

    
        res.render('products/search', { products, query });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});




module.exports = router;