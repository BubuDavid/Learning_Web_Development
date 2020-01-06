// ===============================================================================================
//    Requirements and init variables
// ===============================================================================================
var express               = require('express'),
    bodyParser            = require('body-parser'),
    mongoose              = require('mongoose'),
    passport              = require('passport'),
    localStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User                  = require('./models/user'),

    app        = express(),
    port       = 3000;

// ===============================================================================================
//    Set Up
// ===============================================================================================
// Allow our application to use ejs files
app.set("view engine", "ejs");
// Connecting to a data base
mongoose.connect("mongodb://localhost:27017/auth_demo_app", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(require("express-session")({
    // This is gonna be used to encode and un-encode the thigys.
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended:true}));

// Init passport authentication 
app.use(passport.initialize());
// persistent login sessions 
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

// These are very important to session, they are responsable to read all the session and 
// send all the information
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===============================================================================================
//    Routes
// ===============================================================================================
// HOME ROUTE
app.get("/", function(req, res) {
    res.render("home");
});

// SECRET ROUTE
app.get("/secret", isLoggedIn, function(req, res) {
    res.render("secret");
});

// ===============================================================================================
//    Auth Routes
// ===============================================================================================
// SIGN UP FORM ROUTE
app.get("/register", function(req, res) {
    res.render("register");
});

// HANDLING USER SIGN UP
app.post("/register", function(req, res) {
    // This works to never ever has the password in the code
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if(err) {
            console.log("OH NOOOOOOO!")
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/secret");
        });
    });
});

// LOGIN ROUTE
app.get("/login", function(req, res) {
    res.render("login");
});

// LOGIN LOGIC ROUTE
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/"
}), function(req, res) {
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}
// ===============================================================================================
//    Run the server
// ===============================================================================================
app.listen(port, function() {
    console.log("Campground page running in: " + port);
});

// mongod --dbpath=/data