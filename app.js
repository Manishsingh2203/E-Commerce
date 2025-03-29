
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
  const User = require('./models/user.js')
  const seedDB = require('./seed')
  const MongoStore = require('connect-mongo');
  const authRoutes = require('./routes/auth');
  const searchRoutes = require("./routes/search"); 
  const returnPolicyRoutes = require("./routes/returnPolicy");
  const returnsReplacementsRoutes = require("./routes/returnsReplacements");
  const dbURL = process.env.dbURL || "mongodb://127.0.0.1:27017/shoppingDB";
  const trackOrderRoutes = require("./routes/trackOrder");
  const careersRoutes = require("./routes/careers");
  const policiesRoutes = require('./routes/policies');
  const pressRoutes = require('./routes/press');
  const affiliateRouter = require('./routes/affiliate');
  const pageRoutes = require("./routes/pages");
  
  
  
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
  app.use(express.json());
  app.use("/search", searchRoutes); 
  
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
  
  //flash middleware
  app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.messages = req.flash();
    next();
  })
  
   //seedDB();
  
  // Routes require
  const productRoutes = require('./routes/product');
  const reviewRoutes = require('./routes/review');
  
  const cartRoutes = require('./routes/cart');
  const productApi = require('./routes/api/productapi');
  const paymentRoutes = require('./routes/payment');
  const user = require('./models/user.js');
  
  
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
  app.use(authRoutes);
  app.use('/cart', cartRoutes);
  app.use("/return-policy", returnPolicyRoutes);
  app.use("/track-order", trackOrderRoutes)
  app.use("/careers", careersRoutes);
  app.use('/', policiesRoutes);
  app.use(pressRoutes);
  app.use( affiliateRouter);
  app.use("/", pageRoutes);
  app.use("/", returnsReplacementsRoutes);
 
  
  app.use(session({
      secret: "12345678",
      resave: false,
      saveUninitialized: true
  }));
  
 
  
  
  app.listen(`${process.env.PORT}` || 8000, () => {
    console.log(`server running at port ${process.env.PORT}`);
  });
  




 
