const express = require("express");
const router = express.Router();

// Return Policy Route
router.get("/", (req, res) => {
    res.render("returnPolicy"); 
});

module.exports = router;
