var userProfile;
const {config} = require("./config.js")

const express  = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const collection = require("./mongodb")
const session = require('express-session');
const passport = require('passport');

const url = "https://api.nasa.gov/planetary/apod?api_key=";
const api_key = config.NASA_API_KEY;

//google stuff:

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
  }));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', async(req, res) => {
    const response = await fetch(`${url}${api_key}`);
       const dat = await response.json();
    res.render("home", {d:dat});
});

app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '429980988181-10hbqt2r575qpvuckgeq9p22774l6mgf.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });


const templatePath = path.join(__dirname, "../templates")
 //functions for google auth






//to get the hbs and mongodb connected
app.use(express.json())
app.set("view engine", "hbs")   //our view engine is hbs
app.set("views", templatePath)  //instead of views, use templates
app.use(express.urlencoded({extended:false}))


//function for JS for fetch




//login
app.get("/", (req,res)=>{
   res.render("login")
})


//signup
app.get("/signup", (req,res)=>{
   res.render("signup")
})


//async for mongo
app.post("/signup", async(req,res)=> {


   const data = {
       name:req.body.name,
       password:req.body.password
   }


   //creates data and fill into collection
   await collection.insertMany([data])
   const response = await fetch(`${url}${api_key}`);
       const dat = await response.json();
       res.render("home", {d:dat});
})


//async for mongo
app.post("/login", async(req,res)=> {


   try {
       const check = await collection.findOne({name:req.body.name})


       if(check.password == req.body.password) {
           const response = await fetch(`${url}${api_key}`);
       const dat = await response.json();
       res.render("home", {d:dat});
       } else {
           res.send("wrong password")
       }
   }
   catch {
       res.send("wrong details")
   }


})


//get the port number
app.listen(3000,()=>{
   console.log("port connected");
})
