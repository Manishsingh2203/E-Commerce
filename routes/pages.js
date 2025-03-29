const express = require("express");
const router = express.Router();

// Dummy user data for testing
const dummyUser = {
    username: "Manish Singh",
    email: "manishsinghbst0103@gmail.com",
    phone: "+1 234 567 890",
    addresses: ["JSS university", "Noida",  "208009, Uttar-Pradesh"],
    orders: [
        { id: 1, item: "Laptop", status: "Delivered" },
        { id: 2, item: "Phone", status: "Shipped" }
    ]
};

// Your Account Route
router.get('/your-account', (req, res) => {
    res.render('your-account', { user: dummyUser });
});

// Help Page
router.get("/help", (req, res) => {
    res.render("help");
});

//  NEW: Edit Account Route
router.get('/edit-account', (req, res) => {
    res.render('edit-account', { user: dummyUser });
});

// Update Account Route
router.post('/update-account', (req, res) => {
    const { username, email, phone } = req.body;
    
   
    dummyUser.username = username;
    dummyUser.email = email;
    dummyUser.phone = phone;

    res.redirect('/your-account');
});

router.get('/advertise-your-products', (req, res) => {  //advertise-your-products
    res.render('advertise');
});


router.get('/sell-on-snapbuy', (req, res) => {
    res.render('sell-on-snapbuy'); 
});

router.post('/submit-advertise', (req, res) => {
    const { name, email, product, description, price, image } = req.body;
    console.log(`New Advertisement: ${name} - ${product} ($${price})`);
    res.status(200).send('Advertise product successfully ,  our team advertise your product very soon!');
 });

// Help Center Pages
router.get('/help/reset-password', (req, res) => {
    res.render('reset-password');
});

router.get('/help/update-contact', (req, res) => {
    res.render('update-contact');
});

router.get("/payumoney", (req, res) => {
    res.render("payment/payumoney"); 
});

// PayU Money Payment Processing (POST request)
router.post("/payumoney/process", (req, res) => { ///payumoney/process
    // Simulate payment processing (In a real app, integrate PayU API here)
    console.log("Processing payment...");

    // After processing, redirect to a success page
    res.redirect("/payment_gateway/success");
});

// Payment Success Page (GET request)
router.get("/success", (req, res) => {
    res.send("<h2>🎉 Payment Successful! Thank you for your order.</h2> <a href='/'>Go back home</a>");
});

router.get("/customer-service", (req, res) => {
    res.render("help/customer-service"); 
});

router.get("/", (req, res) => {
    res.render("location"); 
});

// Route for Conditions of Use
router.get('/conditions-of-use', (req, res) => {
    res.render('conditions');
  });

module.exports = router;
