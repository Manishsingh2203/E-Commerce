const express = require("express");
const router = express.Router();

// Returns & Replacements Route
router.get("/returns-replacements", (req, res) => {
    res.render("returns-replacements"); 
});


module.exports = router;
