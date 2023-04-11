// LEVEL 2 AUTHENTICATION
require('dotenv').config();

const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/userDB');
  
  }
main();

// Schema for the user in the Database
const userSchema = new mongoose.Schema({
    email:String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]}); // only encrypt the passwrod field

// create a new model for the user

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register", function(req, res){
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
  
    newUser.save() // when the deatils of the new user is saved the password is encrypted
      .then(function() {
        res.render("secrets");
      })
      .catch(function(err) {
        console.log(err);
      });
  });
  
  

  app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    User.findOne({email: username}) // while finding the user the password is decrypted
      .then((foundUser) => {
        if (foundUser && foundUser.password === password) {
          res.render("secrets");
        } else {
          res.redirect("/login");
        }
      })
      .catch((err) => console.log(err));
  });
  
  







app.listen(3000,function(){
    console.log("Server Started on Port 3000");
})