const express = require("express");
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const path = require("path");
const mongoose = require("mongoose");
// New parser 
const { MongoClient } = require('mongodb');
const mongoURI = 'mongodb://localhost/node-app';
const app =express();
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require("passport");


const ideas = require('./routes/ideas');
const users = require('./routes/users');

require("./config/passport")(passport);

const { transcode } = require("buffer");
// connect to mongoose
  /*const db =require('./config/keys').mongoURI;

  MongoClient.connect(db,{useNewUrlParser:true})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));
  */

const db = require("./config/database");

mongoose.connect(db.mongoURL,{useNewUrlParser:true})
        .then(() => {
          console.log("MongoDB connected...")
        })
        .catch(err => {
          console.log(err)
        })

         // use model
require("./models/Idea");

const Idea = mongoose.model('ideas');

// useUnifiedTopology

mongoose.set('useUnifiedTopology', true);

// handlebars middleware
app.engine('handlebars',exphbs({
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine','handlebars');

// body-parser
var jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// use static doc
app.use(express.static(path.join(__dirname,'public')));

// method-override middleware
app.use(methodOverride('_method'));

//session & flash middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// config global environment var
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})

// config route
app.get("/",(req,res) => {
  const title = "Welcome, I am Mr Wang!";
  res.render("index",{
    title:title
  });
})

// app.use("/",ideas); if use ideas, delete path /ideas in routes/ideas
app.use("/ideas",ideas); 
app.use("/users",users); 

app.get("/about",(req,res) => {
  res.render("about");
})


const port = process.env.PORT || 8000;

app.listen(port,() => {
  console.log(`Server started on ${port}`);
})