
let express=require("express");
let mysql=require("mysql2");
let bcrypt=require("bcrypt");
require("dotenv").config();
let con=mysql.createConnection(
    {
            host:process.env.DB_HOST,
            user:process.env.DB_USER,
            password:process.env.DB_PASS,
            database:process.env.DB_NAME
    }
);
con.connect((err)=>
{
    if(err)
    {
        console.log("Database Not Connected");
    }
    else{
        console.log("database connected sucessfully");
    }
});
module.exports=con;