const express = require("express");
const con = require("./Config/db");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
let route=require("./Router/Router");
let adminroute=require("./Router/AdminRoutes");
const app = express(); //to call a express function inside the express module to return the createapplication function

// Middleware to use before run 
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); 
//for form data
app.use(express.static("public"));
//for accesing the folder inside the public
app.use(cookieParser());

// Session setup
app.set('trust proxy', 1); // if behind proxy (e.g. Heroku)
app.use(session({
  secret: 'VaishnaviDipali',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production', // Only true in production
    httpOnly: true
  }
}));

app.set("view engine","ejs");
app.use("/",route);
app.use("/admin",adminroute);
// Export app
module.exports = app;
