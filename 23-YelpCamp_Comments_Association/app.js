// ===============================================================================================
//    Requirements and init variables
// ===============================================================================================
var express       = require('express'),
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose'),
    passport      = require('passport'),
    localStrategy = require('passport-local'),
    methodOverrid = require('method-override'),
    // Import models, before they were in this file, but now it's in another one
    Campground    = require('./models/campground'),
    Comment       = require('./models/comment'),
    User          = require('./models/user'),
    // To have our data base very cool
    seedDB        = require('./seeds'),
    // Routes import
    commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes      = require('./routes/index'),
  
    app           = express(),
    port          = 5000;

// ===============================================================================================
//    Set Up
// ===============================================================================================
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// To use PUT, UPDATE and more methods
app.use(methodOverrid("_method"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
// To have our data base very cool
// seedDB();

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// WITH THIS CODE, YOU ARE SURE TO PASS "currentUser: req.user" to all the routes
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

// ===============================================================================================
//    Routes
// ===============================================================================================
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", indexRoutes);

// ===============================================================================================
//    Run the server
// ===============================================================================================
app.listen(port, function() {
    console.log("Campground page running in: " + port);
});

// mongod --dbpath=/data