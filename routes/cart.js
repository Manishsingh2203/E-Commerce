const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware');
const Product = require('../models/product');
const User = require('../models/user');
const Cart= require('../routes/cart')

// Get cart items for the user
router.get('/user/cart', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart');
        const totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
        const productInfo = user.cart.map((p) => p.desc).join(',');
        res.render('cart/cart', { user, totalAmount, productInfo });
    } catch (err) {
        console.error("Error fetching cart", err);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/user/:productId/add' , isLoggedIn , async(req,res)=>{
    let {productId} = req.params;
    let userId = req.user._id;
    let product = await Product.findById(productId);
    let user = await User.findById(userId);
    user.cart.push(product);
    await user.save();
    res.redirect('/user/cart'); 
});


router.delete('/cart/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        
        
        await User.updateOne(
            { _id: req.user._id },
            { $pull: { cart: itemId } }
        );

        // Find the user to check if the cart is empty
        const user = await User.findById(req.user._id);

        if (user.cart.length === 0) {
            // If the cart is empty, redirect to /products
            res.redirect('/products');
        } else {
            // If the cart still has items, redirect back to /user/cart
            res.redirect('/user/cart');
        }
    } catch (err) {
        console.error("Error deleting item", err);
        res.status(500).send("Internal Server Error");
    }
});



router.post('/cart/update/:id', async (req, res) => {
    const { action } = req.body;
    let cart = req.session.cart || {};
    let itemId = req.params.id;

    if (cart[itemId]) {
        if (action === "increase") {
            cart[itemId].qty += 1;
        } else if (action === "decrease") {
            cart[itemId].qty -= 1;
            if (cart[itemId].qty <= 0) delete cart[itemId];
        }
    }

    req.session.cart = cart;
    res.json({ success: true, newQty: cart[itemId] ? cart[itemId].qty : 0 });
});


module.exports = router;