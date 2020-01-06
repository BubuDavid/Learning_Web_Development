// ===============================================================================================
//    Auth Routes
// ===============================================================================================
var express  = require('express'),
    router   = express.Router(),
    passport = require('passport'),
    User     = require('../models/user');

// ROOT ROUTE
router.get("/", function(req, res) {
    res.render("landing");
});

// Show the register form
router.get("/register", function(req, res) {
    res.render("register");
});

// HANDLE SIGN UP LOGIC
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log("OH NOOOOOOOOOOOOOOOOOOOOOOO REGISTER!")
            console.log(err);
            res.render("register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/campgrounds");
            });
        }
    });
});

// SHOW LOGIN FORM
router.get("/login", function(req, res) {
    res.render("login");
});

// RENDER LOGIN LOGIC
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
    res.send("Simon ese");
});

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

// The middleware 
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;