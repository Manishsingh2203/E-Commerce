const express = require("express");
const router = express.Router();

// Order Tracking Route
router.get("/", (req, res) => {
    res.render("trackOrder"); 
});

module.exports = router;
