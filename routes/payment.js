const express = require("express");
const router = express.Router();
const axios = require("axios"); 
const jsSHA = require("jssha");
const { v4: uuid } = require("uuid");
const { isLoggedIn } = require("../middleware");

router.post("/payment_gateway/payumoney", isLoggedIn, async (req, res) => {
    try {
        req.body.txnid = uuid(); // Generate a unique transaction ID
        req.body.email = req.user.email;
        req.body.firstname = req.user.username;

        const pay = req.body;

        const hashString =
            process.env.MERCHANT_KEY +
            "|" +
            pay.txnid +
            "|" +
            pay.amount +
            "|" +
            pay.productinfo +
            "|" +
            pay.firstname +
            "|" +
            pay.email +
            "|" +
            "||||||||||" +
            process.env.MERCHANT_SALT;

        const sha = new jsSHA("SHA-512", "TEXT");
        sha.update(hashString);
        const hash = sha.getHash("HEX");

        pay.key = process.env.MERCHANT_KEY;
        pay.surl = "http://localhost:5000/payment/success";
        pay.furl = "http://localhost:5000/payment/fail";
        pay.hash = hash;

        // Making an HTTP request using axios
        const response = await axios.post(
            "https://sandboxsecure.payu.in/_payment", // Testing URL
            pay,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        // Check response status
        if (response.status === 200) {
            return res.json(response.data);
        } else if (response.status >= 300 && response.status <= 400) {
            return res.redirect(response.headers.location);
        }

        res.status(response.status).json({ message: "Unexpected response", response: response.data });

    } catch (error) {
        console.error("Payment error:", error);
        res.status(500).json({
            status: false,
            message: error.response ? error.response.data : error.message,
        });
    }
});

// Success route
router.post("/payment/success", (req, res) => {
    res.send(req.body);
});

// Failure route
router.post("/payment/fail", (req, res) => {
    res.send(req.body);
});

module.exports = router;
