// ===============================================================================================
//    Routes
// ===============================================================================================
var express    = require('express'),
    router     = express.Router(),
    Campground = require('../models/campground');
    
// INDEX ROUTE
router.get("/", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds) {
        if(err) {
            console.log("AN ERROR SIR");
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

// CREATE ROUTE
router.post("/", isLoggedIn, function(req, res) {
    // get data from a form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: description, author: author};
    // Create a new campground and adding to the database
    Campground.create(newCampground, function(err, campground) {
        if(err) {
            console.log("AN ERROR SIR");
            console.log(err)
        } else {
            // Redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// NEW ROUTE
router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW ROUTE
router.get("/:id", function(req, res) {
    // Find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log("ERROR");
            console.log(err);
        } else {
            // Show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwner, function(req, res) {
    // Find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground:foundCampground}); 
        }
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", checkCampgroundOwner, function(req, res) {
    // Find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            // Redirect somewhere
            res.redirect("/campgrounds/" + req.params.id);    
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", checkCampgroundOwner, function(req, res) {
    Campground.findByIdAndDelete(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds")
        }
    });
});

// Another middleware
function checkCampgroundOwner(req, res, next) {
    if(req.isAuthenticated()) {
        // Find and update the correct campground
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();    
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

// The middleware 
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = router;