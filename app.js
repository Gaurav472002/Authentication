// LEVEL 1 AUTHENTICATION

const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/userDB');
  
  }
main();

// Schema for the user in the Database
const userSchema ={
    email:String,
    password: String
}

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
  
    newUser.save()
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
  
    User.findOne({email: username})
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