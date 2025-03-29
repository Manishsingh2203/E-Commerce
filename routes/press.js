// routes/press.js
const express = require('express');
const router = express.Router();

router.get('/press-releases', (req, res) => {
    res.render('pressReleases');
});

module.exports = router;