const express = require("express");
const con = require("./Config/db");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express(); //to call a express function inside the express module to return the createapplication function

// Middleware to use before run 
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); 
//for form data
app.use(express.static("public"));
//for accesing the folder inside the public
app.use(cookieParser());

// Session setup
app.use(session({
    secret: 'vaishnavidipali',   
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }    
}));

// Export app
module.exports = app;
