const User = require("../models/user");
const nodemailer = require("nodemailer");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer Transport Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS   
    }
});

// Show Forgot Password Form
exports.getForgotPassword = (req, res) => {
    res.render("auth/forgot-password", {
        messages: req.flash()
    });
};

// Handle Forgot Password & Send OTP via Email
exports.postForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/forgot-password');
        }

        const otp = generateOTP();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; 
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}`
        };

        await transporter.sendMail(mailOptions);

        req.flash('success', 'OTP sent successfully. Check your email.');
        res.redirect('/verify-otp');
    } catch (error) {
        console.error('Error sending OTP:', error);
        req.flash('error', 'Something went wrong, please try again.');
        res.redirect('/forgot-password');
    }
};

// Show OTP Verification Page
exports.getVerifyOTP = (req, res) => {
    res.render("auth/verify-otp");
};

// Handle OTP Verification
exports.postVerifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            req.flash("error", "Invalid or expired OTP.");
            return res.redirect("/verify-otp");
        }

        req.flash("success", "OTP verified. You can now reset your password.");
        res.redirect(`/reset-password/${user._id}`);
    } catch (error) {
        console.error("Error verifying OTP:", error);
        req.flash("error", "Something went wrong.");
        res.redirect("/verify-otp");
    }
};

// Show Reset Password Page
exports.getResetPassword = (req, res) => {
    res.render("auth/reset-password", { userId: req.params.userId });
};

// Handle Password Reset
exports.postResetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, userId } = req.body;

        if (password !== confirmPassword) {
            req.flash("error", "Passwords do not match.");
            return res.redirect("back");
        }

        const user = await User.findById(userId);
        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/forgot-password");
        }

        // Properly hash password using setPassword
        await user.setPassword(password);
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        req.flash("success", "Password reset successful. You can now log in.");
        res.redirect("/login");
    } catch (error) {
        console.error("Error resetting password:", error);
        req.flash("error", "Something went wrong.");
        res.redirect("/forgot-password");
    }
};



exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.query; // Get email from query params

        if (!email) {
            req.flash("error", "Email is required.");
            return res.redirect("/forgot-password");
        }

        const user = await User.findOne({ email });
        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/forgot-password");
        }

        // Generate new OTP and update user record
        const otp = generateOTP();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Send OTP email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Resend OTP - Password Reset",
            text: `Your new OTP for password reset is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);

        req.flash("success", "OTP resent successfully. Check your email.");
        res.redirect("/verify-otp");
    } catch (error) {
        console.error("Error resending OTP:", error);
        req.flash("error", "Something went wrong, please try again.");
        res.redirect("/forgot-password");
    }
};


