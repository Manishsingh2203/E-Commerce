/*

if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const seedDB = require("./seed");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/review");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const productApi = require("./routes/api/productapi"); //api
const passport = require("passport"); //pass
const LocalStrategy = require("passport-local"); //pass
const User = require("./models/user"); //pass
//const MongoStore = require('connect-mongo')
const paymentRoutes = require("./routes/payumoney"); 
const punycode = require('punycode/');

const dbURL = process.env.dbURL || "mongodb://127.0.0.1:27017/julybatch"

mongoose.set("strictQuery", true);
mongoose.connect(dbURL)
  .then(() => {console.log("DB connected")})
  .catch((err) => {console.log(err)});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// now for public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/payment_gateway", paymentRoutes);  // ✅ Mount the payment routes properly

// seeding dummy data
// seedDB();

let configSession = {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(configSession));
app.use(flash());

// use static serialize and deserialize of model for passport session support
app.use(passport.initialize()); //pass
app.use(passport.session()); //pass
passport.serializeUser(User.serializeUser()); //pass
passport.deserializeUser(User.deserializeUser()); //pass

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate())); //pass

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

// Routes
app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(productApi);

const port = 5000;
app.listen(port, () => {
  console.log(`server connected at port : ${port}`);
});
*/


if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport =  require('passport');
const LocalStrategy =  require('passport-local');
const User = require('./models/user');
const seedDB = require('./seed')
const MongoStore = require('connect-mongo');

const dbURL = process.env.dbURL || "mongodb://127.0.0.1:27017/ecommerceDB";

mongoose.set('strictQuery', true);
mongoose.connect(dbURL)
  .then(() => console.log('DB Connected'))
  .catch((err) => console.log(err));


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

let secret = process.env.SECRET || 'weneedabettersecretkey';

let store = MongoStore.create({
  secret:secret,
  mongoUrl: dbURL,
  touchAfter:24*60*60
})

const sessionConfig = {
  store:store,
  name:'bhaukaal',
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie:{
      httpOnly:true,
      expires:Date.now() + 1000*60*60*24*7,
      maxAge: 1000*60*60*24*7
  }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



passport.use(new LocalStrategy(User.authenticate()));


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

 //seedDB();

// Routes require
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const productApi = require('./routes/api/productapi');
const paymentRoutes = require('./routes/payment');


app.get('/' , (req,res)=>{
  res.render('home');
})

// middle express
app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(productApi);
app.use(paymentRoutes);


app.listen(`${process.env.PORT}` || 8000, () => {
  console.log(`server running at port ${port}`);
});





