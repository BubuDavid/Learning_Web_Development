// ===============================================================================================
//    Requirements and init variables
// ===============================================================================================
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = 5000;

// Campgrounds
var campgrounds = [
    {name: "Salmon Creek", image: "https://i.ytimg.com/vi/mRf3-JkwqfU/hqdefault.jpg"},
    {name: "Granite Hill", image: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Salmon Creek", image: "https://i.ytimg.com/vi/mRf3-JkwqfU/hqdefault.jpg"},
    {name: "Granite Hill", image: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Mountain Goat's Rest", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
];

// ===============================================================================================
//    Set Up
// ===============================================================================================
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))

// ===============================================================================================
//    Routes
// ===============================================================================================
app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
    // get data from a form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampGround = {name: name, image: image};
    campgrounds.push(newCampGround);
    // Redirect back to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

// ===============================================================================================
//    Run the server
// ===============================================================================================
app.listen(port, function() {
    console.log("Campground page running in: " + port);
});