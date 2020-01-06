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
router.post("/", function(req, res) {
    // get data from a form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    // Create a new campground and adding to the database
    Campground.create(newCampground, function(err, campgrounds) {
        if(err) {
            console.log("AN ERROR SIR");
            console.log(err)
        } else {
            // Redirect back to campgrounds page
            res.redirect("/");
        }
    });
});

// NEW ROUTE
router.get("/new", function(req, res) {
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


module.exports = router;