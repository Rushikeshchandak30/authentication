//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();


console.log(process.env.API_KEY);
const encrypt = require("mongoose-encryption");
require('dotenv').config();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded(
    {extended: true}
    ));

mongoose.connect("mongodb://0.0.0.0:27017/authentication", {useNewUrlParser: true, useUnifiedTopology: true});
app.get("/", function(req, res){
    res.render("home");
}
);  
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ["password"]    });

const user = new mongoose.model("user",userSchema);

app.get("/login", function(req, res){
    res.render("login");
}
);
app.get("/register", function(req, res){
    res.render("register");
}
);
app.post("/register",function(req,res){
    const newUser=new user({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()
    .then(()=>{
        res.render("secrets");
    })
    .catch((err)=>{
        console.log(err);
    });
});
app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    User.findone({email: username},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets");
                }
            }
        }
    }
)
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
}
);

