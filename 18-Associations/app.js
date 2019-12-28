// ===============================================================================================
//    Requirements and init variables
// ===============================================================================================
var express    = require('express'),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),

    app        = express(),
    port       = 5000

// ===============================================================================================
//    Set Up
// ===============================================================================================
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

// Schema Set up
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Init Campgrounds
//  Campground.create({
//      name: "Salmon Creek", 
//      image: "https:i.ytimg.com/vi/mRf3-JkwqfU/hqdefault.jpg",
//      description: "This is awful too"
//  }, function(err, camp) {
//          if(err) {
//              console.log("Oh no, an error");
//              console.log(err);
//          } else {
//              console.log("LISTATION");
//              console.log(camp);
//          }
//      }
//  );
//  Campground.create({
//      name: "Granite Hill",
//      image: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//      description: "This a huge granite hill, no bathrooms, no water, beaautiful granite."
//  }, function(err, camp) {
//          if(err) {
//              console.log("Oh no, an error");
//              console.log(err);
//          } else {
//              console.log("LISTATION");
//              console.log(camp);
//          }
//      }
//  );

// ===============================================================================================
//    Routes
// ===============================================================================================
app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds) {
        if(err) {
            console.log("AN ERROR SIR");
            console.log(err);
        } else {
            res.render("index", {campgrounds: campgrounds});
        }
    });
});

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

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.get("/campgrounds/:id", function(req, res) {
    // Find the campground with the provided ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log("ERROR");
            console.log(err);
        } else {
            res.render("show", {campground:foundCampground});
        }
    });
});

// ===============================================================================================
//    Run the server
// ===============================================================================================
app.listen(port, function() {
    console.log("Campground page running in: " + port);
});