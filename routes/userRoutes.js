const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");

// Account Page (Only if Logged In)
router.get("/account", isLoggedIn, (req, res) => {
    res.render("account", { currentUser: req.session.user });
});

// Login Page (For Unauthenticated Users)
router.get("/login", (req, res) => {
    res.render("login");
});

// Logout Route
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) console.log(err);
        res.redirect("/login");
    });
});

module.exports = router;
