//LEVEL 6 AUTHENTICATION  THROUGH GOOGLE 
require('dotenv').config();

const express = require("express");
const  mongoose  = require("mongoose");


const session = require("express-session");
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(session({
  secret: "Our little secret",
  resave:  false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userDB');

}
main();

// Schema for the user in the Database
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId:String,
  secret:String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// create a new model for the user

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});




passport.use(new GoogleStrategy({
    clientID:   process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    passReqToCallback   : true,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/secrets");
  }
);

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});


app.get("/secrets", function(req,res){
  
  User.find({"secret":{$ne: null}})
  .then(foundUsers => {
    if(foundUsers){
      res.render("secrets", {usersWithSecrets:foundUsers});
    }
  })
  .catch(err => {
    console.log(err);
  });

});

app.get("/submit", function(req,res){

  if(req.isAuthenticated()){
    res.render("submit");
  }
  else{
      res.redirect("/login");
  }

});



app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { 
      return next(err); 
      }
    res.redirect('/');
  });
});

app.post("/submit", function (req, res) {
  User.findById(req.user)
    .then(foundUser => {
      if (foundUser) {
        foundUser.secret = req.body.secret;
        return foundUser.save();
      }
      return null;
    })
    .then(() => {
      res.redirect("/secrets");
    })
    .catch(err => {
      console.log(err);
    });
});


app.post("/register", function (req, res) {

      User.register({username:req.body.username}, req.body.password, function(err, user){

        if(err){
          console.log(err);
          res.redirect("/register");
        } 
        else{
          passport.authenticate("local")(req, res, function(){
            res.redirect("/secrets");
          })
        }
      })
 
  });



  app.post("/login", passport.authenticate("local"), function(req, res){
    res.redirect("/secrets");
});





app.listen(3000, function () {
  console.log("Server Started on Port 3000");
})