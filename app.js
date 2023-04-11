// LEVEL 3 AUTHENTICATION  (HASHING)
// Same password will be turned into same hash no matter if the users are different but their passwords are same

/* How hackers crack passwords using dictionary tables thorugh hash tables 

Make a hash table -> Take all words from dictionaray. All numbers from a telephone book, all combindations of characters upto 6 places
total combinations formed = 19775759664 a high end GPU will take 0.9 sec to calculate all this combinations and crack the password */
require('dotenv').config();

const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();

const md5 = require("md5");

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
      password: md5(req.body.password)
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
    const password = md5(req.body.password); // converting password to hashed password so that we are able to match both the fields
  
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