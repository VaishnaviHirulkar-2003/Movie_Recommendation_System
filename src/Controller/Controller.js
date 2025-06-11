let express=require("express");

exports.indexpage=(req,res)=>
{
    res.render("index",{status:"login"});
}
exports.indexreg=(req,res)=>
{
    res.render("index",{status:"signup"});
}
exports.getadminreg=(req,res)=>
{
    res.render("index",{status:"adminLogin"})
}