var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEME SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campgrounds", campgroundSchema);

app.get("/", function(req, res){
    res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allcampgrounds){
       if (err){
           console.log(err);
       } else {
           res.render("index", {campgrounds: allcampgrounds});
       }
   });
});

app.post("/campgrounds", function(req, res){
   //get data from form and add to campgrounds
   //redirect back to campgrounds page
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var newCampground = {name:name, image:image, description: desc};
   
   //Create a new campground and save to DB
   Campground.create(newCampground, function(err, newlyCreated){
       if (err){
           console.log(err);
       } else {
           res.redirect("campgrounds");
       }
   })
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

// SHOW - show more info about one campground
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server Has Started!!!");
});