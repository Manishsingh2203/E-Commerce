const express = require('express');
const router = express.Router();

// Terms of Service Page
router.get('/terms-of-service', (req, res) => {
    res.render('termsOfService');
});

// Privacy Policy Page
router.get('/privacy-policy', (req, res) => {
    res.render('privacyPolicy');
});

// Refund Policy Page
router.get('/refund-policy', (req, res) => {
    res.render('refundPolicy');
});

module.exports = router;
