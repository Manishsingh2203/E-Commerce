const mongoose = require('mongoose');
const Review = require('./review');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    img: {
        type: String,
        trim: true,
        default: '/images/product.jpg'
    },
    price: {
        type: Number,
        min: 0,
        default: 0
    },
    category: String,  
    desc: {
        type: String,
        trim: true
    },
    avgRating: {
        type: Number,
        default: 0 
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});


productSchema.index({ name: "text", desc: "text" });

// Middleware to delete all associated reviews when a product is deleted
productSchema.post('findOneAndDelete', async function(product) {
    if (product.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: product.reviews } });
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
