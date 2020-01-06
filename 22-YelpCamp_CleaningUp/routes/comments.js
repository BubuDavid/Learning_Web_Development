// ===============================================================================================
//    Comments Routes
// ===============================================================================================
var express = require('express'),
    router  = express.Router({mergeParams: true}),
    Campground = require('../models/campground'),
    Comment = require('../models/comment');

// FORM TO CREATE A COMMENT
router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log("An error was made!");
            console.log(err);
        } else {
         res.render("comments/new", {campground: foundCampground});    
        }
    });
});

// COMMENTS CREATE
router.post("/", isLoggedIn, function(req, res) {
    // Look up campgrounds using ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log("An error was made!");
            console.log(err);
            res.redirect("/campgrounds")
        } else {
                // Create new comment
                Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    // Connect new comment to campground
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    // Redirect to campground Show page
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });  
        }
    });
});

// The middleware 
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
