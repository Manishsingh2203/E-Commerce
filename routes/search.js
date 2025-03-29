const express = require("express");
const router = express.Router();
const Product = require("../models/product"); 

// Search route

router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.redirect('/products'); 
        }

        
        const products = await Product.find({ $text: { $search: query } });

        
        res.render('products/search', { products, query });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;


 