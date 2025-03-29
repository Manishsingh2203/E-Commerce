
const express = require("express");
const router = express.Router();

// Careers Page Route
router.get("/", (req, res) => {
    res.render("careers");
});

// Handle Job Applications
router.post("/apply", (req, res) => {
    const { name, email, message } = req.body;
    console.log(`New Job Application: ${name} - ${email} - ${message}`);
    res.send("Application submitted successfully!");
});

module.exports = router;
