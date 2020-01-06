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
            req.flash("error", err.message);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome to YelpCamp" + user.username);
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
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;