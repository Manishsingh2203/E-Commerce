const express = require('express');
const router = express.Router();

router.get('/affiliate', (req, res) => {
    res.render('affiliate');
});

// Handle POST request to /affiliate/signup
router.post('/signup', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }

    console.log('Affiliate Signup:', { name, email });

    res.status(200).send('Affiliate signup successful!');
});


module.exports = router;
