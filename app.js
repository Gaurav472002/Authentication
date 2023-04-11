//LEVEL 5 AUTHENTICATION Using Passport which automatically salts and hash
require('dotenv').config();

const express = require("express");
const  mongoose  = require("mongoose");


const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require('passport');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


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
  password: String
});

userSchema.plugin(passportLocalMongoose);

// create a new model for the user

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});


app.get("/secrets", function(req,res){
  if(req.isAuthenticated()){
    res.render("secrets");
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