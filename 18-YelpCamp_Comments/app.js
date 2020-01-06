// ===============================================================================================
//    Requirements and init variables
// ===============================================================================================
var express    = require('express'),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    // Import models, before they were in this file, but now it's in another one
    Campground = require('./models/campground'),
    Comment    = require('./models/comment'),
    // To have our data base very cool
    seedDB     = require('./seeds'),

    app        = express(),
    port       = 5000;

// ===============================================================================================
//    Set Up
// ===============================================================================================
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
// To have our data base very cool
seedDB();

// ===============================================================================================
//    Routes
// ===============================================================================================
app.get("/", function(req, res) {
    res.render("landing");
});

// INDEX ROUTE
app.get("/campgrounds", function(req, res) {
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
app.post("/campgrounds", function(req, res) {
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
            res.redirect("/campgrounds");
        }
    });
});

// NEW ROUTE
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

// SHOW ROUTE
app.get("/campgrounds/:id", function(req, res) {
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

// ===============================================================================================
//    Comments Routes
// ===============================================================================================
app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log("An error was made!");
            console.log(err);
        } else {
         res.render("comments/new", {campground: foundCampground});    
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res) {
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

// ===============================================================================================
//    Run the server
// ===============================================================================================
app.listen(port, function() {
    console.log("Campground page running in: " + port);
});