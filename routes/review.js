const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/review');
const { validateReview } = require('../middleware');

router.post('/products/:productId/review', validateReview, async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;

        // Fetch the product
        const product = await Product.findById(productId);

        // Create a new review
        const review = new Review({
            rating,
            comment,
            author: req.user._id, // Assign the logged-in user as the author
        });

        // Add review to product's reviews array
        product.reviews.push(review);

        // Update product's average rating
        const newAverageRating =
            ((product.avgRating * product.reviews.length) + parseInt(rating)) /
            (product.reviews.length + 1);
        product.avgRating = parseFloat(newAverageRating.toFixed(1));

        // Save the review and product
        await review.save();
        await product.save();

        req.flash('success', 'Review added successfully!');
        res.redirect(`/products/${productId}`);
    } catch (err) {
        console.error('Error while adding review:', err);
        req.flash('error', 'Unable to add review.');
        res.redirect('back');
    }
});

router.delete('/products/:productId/review/:reviewId', async (req, res) => {
    const { productId, reviewId } = req.params;

    try {
        // Fetch the review and populate the author field
        const review = await Review.findById(reviewId).populate('author');

        if (!review) {
            req.flash('error', 'Review not found.');
            return res.redirect(`/products/${productId}`);
        }

        // Check if the logged-in user is the author of the review
        if (!review.author._id.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to delete this review.');
            return res.redirect(`/products/${productId}`);
        }

        // Remove the review from the product's reviews array
        const product = await Product.findById(productId);
        product.reviews = product.reviews.filter(r => r._id.toString() !== reviewId);

        // Update the average rating
        if (product.reviews.length > 0) {
            const totalRating = product.reviews.reduce((acc, r) => acc + r.rating, 0);
            product.avgRating = (totalRating / product.reviews.length).toFixed(1);
        } else {
            product.avgRating = 0;
        }

        // Save the product and delete the review
        await product.save();
        await Review.findByIdAndDelete(reviewId);

        req.flash('success', 'Review deleted successfully.');
        res.redirect(`/products/${productId}`);
    } catch (err) {
        console.error('Error while deleting review:', err);
        req.flash('error', 'An error occurred while trying to delete the review.');
        res.status(500).redirect(`/products/${productId}`);
    }
});
module.exports = router;