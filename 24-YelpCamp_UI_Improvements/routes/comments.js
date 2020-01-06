// ===============================================================================================
//    Comments Routes
// ===============================================================================================
var express = require('express'),
    router  = express.Router({mergeParams: true}),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    middleware = require('../middleware');


// FORM TO CREATE A COMMENT
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
router.post("/", middleware.isLoggedIn, function(req, res) {
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
                    // Add username id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    // Connect new comment to campground
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    req.flash("success", "Successfully comment created");
                    // Redirect to campground Show page
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });  
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id:req.params.id, comment:foundComment});
        }
    })
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, newComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res) {
    Comment.findByIdAndDelete(req.params.comment_id, function(err) {
        if(err) {
            console.log("HUBO UN ERROR SID");
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("back");
        }
    });
});

module.exports = router;
