const { productSchema } = require("./schema");
const { reviewSchema } = require("./schema");
const passport = require('passport');
const Product = require("./models/product");

const isLoggedIn = (req,res,next)=>{
    // console.log(req.originalUrl);
    // console.log(req.xhr);
    if(req.xhr && !req.isAuthenticated()){
        return res.status(401).json({msg:'you need to login first'});
    }
    
    if(!req.isAuthenticated()){
        req.flash('error' , 'you need to login first');
        return res.redirect('/login');
    }
    next();
} 


const validateProduct = (req,res,next)=>{
    const {name, img, price , desc} = req.body;
    const {error} = productSchema.validate({name,img,price,desc});
    
    if(error){
        const msg = error.details.map((err)=>err.message).join(',');
        return res.render('error' , {err:msg});
    }
    next();
}

const validateReview = (req,res,next)=>{

    const {rating, comment} = req.body;
    const {error} = reviewSchema.validate({rating,comment});

    if(error){
        const msg = error.details.map((err)=>err.message).join(',');
        return res.render('error' , {err:msg});
    }
    next();
}

const isSeller = (req,res,next)=>{
    if(!req.user.role){
        req.flash('error' , 'you donot have the permission to do that');
        return res.redirect('/products');
    }
    else if(req.user.role !== 'seller'){
        req.flash('error' , 'you donot have the permission to do that');
        return res.redirect('/products');
    }
    next();
}


const isProductAuthor = async (req, res, next) => {
    try {
        let { id } = req.params;
        const product = await Product.findById(id);

        // Check if product exists
        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/products");
        }

        // Check if req.user is defined
        if (!req.user || !req.user._id) {
            req.flash("error", "You must be logged in to perform this action");
            return res.redirect("/login");
        }

        // Check if product.author exists
        if (!product.author) {
            req.flash("error", "This product has no author assigned");
            return res.redirect(`/products/${id}`);
        }

        // Convert req.user._id to ObjectId if necessary
        if (!product.author.equals(req.user._id)) {
            req.flash("error", "You do not have permission to do that");
            return res.redirect(`/products/${id}`);
        }

        next();
    } catch (error) {
        console.error("Error in isProductAuthor middleware:", error);
        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect("/products");
    }
};

    

module.exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();  // User is logged in, continue
    } else {
        res.redirect("/login");  // Redirect to login if not logged in
    }
};



module.exports = {validateProduct ,validateReview , isLoggedIn , isSeller , isProductAuthor} ;