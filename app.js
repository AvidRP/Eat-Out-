//zomato api key   :   a14399473dda131cb917e581b48c21bb


//express setup
var express = require("express"),
    app = express();


//to make requests
var request = require("request");

//body-parser for extracting user input
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//using mongoose to store info about the city that the user enters
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/explore", {useMongoClient: true});

//for userAuth
var passport = require("passport"),
    LocalStrategy = require("passport-local")
    //importing user model file
    User = require("./models/user.ejs");

//using the expression session package
app.use(require("express-session")({
  secret: "Krabby patty secret formula",
  resave: false,
  saveUninitialized: false
}));

//passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//for ejs files
app.set("view engine", "ejs");

//for css files
app.use(express.static('public'));

//server setup
app.listen(3000, function () {
  console.log("Server is up now!")
});


//ROUTES



//AUTH ROUTES
//register route
app.get("/register", function (req, res) {
  res.render("register");
})

app.post("/register", function (req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function (err, user){
    if(err) {
      console.log(err);
      return res.render("register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/");
      })
    }
  })
});

console.log(User.find({"name": "avid"}))

//login routes
app.get("/login", function(req, res) {
  res.render("login")
})

app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/register"
}), function (req, res) {
  //callback doesnt do anything
})

//index route
app.get("/", function (req, res) {
  res.render("index")
});

//this is where the search form gets posted
app.post("/", function (req, res) {
  //getting the search term from the forum
  var restaurant = req.body.restaurant;

  //redirecting to the result display page
  res.redirect("/" + restaurant);
})

//logout route
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
})

app.get("/:id", function (req, res) {
  //to find out what restaurant a user searched for
  var restaurant = req.params.id;
  //making a request to the api
  request('https://developers.zomato.com/api/v2.1/search?q='+restaurant+'&apikey=a14399473dda131cb917e581b48c21bb', function (error, response, body) {
    if(!error && response.statusCode == 200) {
      //so that we can access the JSON files
      var searchResults = JSON.parse(body);

      res.render("results", {searchResults: searchResults});
    } else {
      console.log(error)
    }
  });
})
