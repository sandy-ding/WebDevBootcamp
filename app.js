var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
seedDB();

app.get("/", function(req, res){
    res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allcampgrounds){
       if (err){
           console.log(err);
       } else {
           res.render("campgrounds/index", {campgrounds: allcampgrounds});
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
    res.render("campgrounds/new");
});

// SHOW - show more info about one campground
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

//COMMENTS ROUTES
app.get("/campgrounds/:id/comments/new", function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
})

app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using ID
    //create new comment
    //connect new comment to campground
    //redirect
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server Has Started!!!");
});