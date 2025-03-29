const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const authController = require("../controllers/auth");

router.get('/register' , (req,res)=>{
    res.render('auth/signup');
})

router.post('/register' , async(req,res)=>{
    try{
        let {email,username,password,role} = req.body;
        const user = new User({email,username,role});
        const newUser = await User.register(user,password);
        // res.send(newUser);
        req.login(newUser, function(err) {
            if (err) { return next(err); }
            req.flash('success' , ' You are registered successfully')
            return res.redirect('/products');
        });
    }
    catch(e){
        req.flash('error' , e.message);
        return res.redirect('/products');
    }
})

router.get('/login' , (req,res)=>{
    res.render('auth/login');
})
        
router.post('/login',
    passport.authenticate('local', { 
       failureRedirect: '/login', 
       failureFlash: true 
    }),
    function(req, res) {
        console.log("User logged in:", req.user);
        req.flash('success', `Login Successfully ${req.user.username}`);
        res.redirect(`/products`);
    }
);



router.get('/logout', (req, res) => {
    req.logout(() => {
        req.flash('success', 'Logged Out Successfully');
        res.redirect('/login'); 
    });
});



router.get("/about", (req, res) => {
    res.render("about"); 
});


// Route to render update form
router.get("/update-contact", (req, res) => {
    res.render("auth/update-contact", { user: req.user }); 
});

// Handle form submission
router.post("/update-contact", async (req, res) => {
    const { email, phone } = req.body;
    
    try {
        // Assuming user is authenticated
        const userId = req.user.id; 

        // Find and update user
        await User.findByIdAndUpdate(userId, { email, phone });

        res.send("Your contact information has been updated successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while updating contact information.");
    }
});


router.get("/update-contact", isAuthenticated, (req, res) => {
    res.render("auth/update-contact", { user: req.user });
});

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/login");
}


// Forgot Password Routes
router.get("/forgot-password", authController.getForgotPassword);
router.post("/forgot-password", authController.postForgotPassword);

// OTP Verification Routes
router.get("/verify-otp", authController.getVerifyOTP);
router.post("/verify-otp", authController.postVerifyOTP);

// Reset Password Routes
router.get("/reset-password/:userId", authController.getResetPassword);
router.post("/reset-password", authController.postResetPassword);

// Resend OTP Route
router.get("/resend-otp", authController.resendOTP);

module.exports = router;



 
 