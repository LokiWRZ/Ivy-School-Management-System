const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");

require("../models/Idea");

const Idea = mongoose.model('ideas'); 


// body-parser
var jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// class
router.get("/",ensureAuthenticated,(req,res) => {
  Idea.find({user:req.user.id})
  .sort('date')
    .then(ideas => {
      res.render("ideas/index",{
        ideas:ideas
      });
    })
})

router.get("/add",ensureAuthenticated,(req,res) => {
  res.render("ideas/add");
})

// edit
router.get("/edit/:id",ensureAuthenticated,(req,res) => {
  Idea.findOne({
    _id:req.params.id,
  })
  .then( idea => {
    if(idea.user != req.user.id){
      req.flash("error_msg","Operation is invalid!");
      res.redirect("/ideas")
    }else{
      res.render("ideas/edit", {
        idea:idea
      })
    }
  })
})

router.post("/",urlencodedParser,(req,res) => {
  // console.log(req.body)
  let errors = [];
  if(!req.body.title){
    errors.push({text:"Please enter title!"});
  }

  if(!req.body.details){
    errors.push({text:"Please enter description!"});
  }

  if(errors.length > 0){
    res.render("ideas/add",{
      errors:errors,
      title:req.body.title,
      details:req.body.details
    })
  }else{
    const newUser = {
      title:req.body.title,
      details:req.body.details,
      user:req.user.id
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash("success_msg","Add success!");
        res.redirect("/ideas")
      })
  }
  // res.send(console.log("OK"))
  // res.render("ideas/add");
})

// implement edit
router.put("/:id",urlencodedParser,(req,res) => {
  Idea.findOne({
    _id:req.params.id
  })
  .then( idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        req.flash("success_msg","Edit success!");
        res.redirect("/ideas")
      })
  })
});

// implement delete
router.delete("/:id",ensureAuthenticated,(req,res) => {
  Idea.deleteOne({   // Replace remove() with deleteOne() or deleteMany().
    _id:req.params.id
  })
  .then(() => {
    req.flash("success_msg","Delete success!");
    res.redirect("/ideas")
  })
  res.render("ideas/add");
});

module.exports = router;