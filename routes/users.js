const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser")
const router = express.Router();
const passport = require("passport");

// body-parser
var jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// load model
require('../models/User');
const User = mongoose.model("users");

// user login & register
router.get("/login",(req,res) => {
  res.render("users/login");
})

router.post("/login",urlencodedParser,(req,res,next) => {

  passport.authenticate('local', { 
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash:true
  })(req,res,next)
  // check database
  // User.findOne({email:req.body.email})
  //   .then((user) => {
  //     if(!user) {
  //       req.flash("error_msg","User is not exited!")
  //       res.redirect("/users/login");
  //       return;
  //     }
  //     // valid password
  //     bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
  //       if(err) throw err;

  //       if(isMatch){
  //         req.flash("success_msg","Login successful!");
  //         res.redirect("/ideas");
  //       }else{
  //         req.flash("error_msg","Login error!");
  //         res.redirect("/users/login");
  //       }
        
  //     });
  //     bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
  //         // result == false
  //     });
  //   })
})


router.get("/register",(req,res) => {
  res.render("users/register");
})

router.post("/register",urlencodedParser,(req,res) => {
  //console.log(req.body)
  //res.render("register");
  let errors = [];

  if(req.body.password != req.body.password2){
    errors.push({
      text:"Password is not same!"
    })
  }

  if(req.body.password.length < 4){
    errprs.push({
      text:"Length of password cannot less than 4 degree!"
    })
  }

  if(errors.length > 0){
    res.render("users/register", {
      errors:errors,
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      password2:req.body.passwords,
    })
  }else{
    const newUser = new User({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password
    })

    User.findOne({email:req.body.email})
      .then((user) => {
        if(user){
          req.flash("error_msg","Email is existed!");
          res.redirect("/users/register");
        }else{
          const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
          })

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                  .then((user) => {
                  req.flash("success_msg","Register success!");
                  res.redirect("/users/login")
                  }).catch((err) => {
                  req.flash("error_msg","Register failed!");
                  res.redirect("/users/register")
                  });
            });
          });

        }
      })
  }
})


router.get("/logout",(req,res) => {
  req.logout();
  req.flash("success_msg","Logout successful!");
  res.redirect("/users/login");
})
module.exports = router;