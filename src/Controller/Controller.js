let express=require("express");
let model=require("../Model/Model")
exports.indexpage=(req,res)=>
{
    res.render("index",{status:"login",msg:""});
}
exports.indexreg=(req,res)=>
{
    res.render("index",{status:"signup",msg:""});
}
// exports.getadminreg=(req,res)=>
// {
//     res.render("index",{status:"adminLogin"})
// }
exports.loginuser=(req,res)=>
{
    let{username,password,role}=req.body;
    async function getuser() {
        let result=await model.loginuser(username,password,role);
        if(result==="Success")
        {
            if(role==="Admin")
            {
                res.send("Admin DashBoard");
            }
            else
            {
                // res.send("User Dashboard");
                res.render("userdashboard");//after login
            }
        }
        else
        {
            res.render("index",{status:"login",msg:result});
        }
    }
    getuser();
}
exports.savereguser=(req,res)=>
{
    let{username,email,password,role}=req.body;
    async function getreg() {
        let r=await model.savereguser(username,email,password,role);
        if(r==="Sucess")
        {
            res.render("index",{status:"signup", msg:"Registration Sucessfull"})
        }
        else
        {
            res.render("index",{status:"signup", msg:r})
        }
    } 
    getreg();
}
exports.userdashboard=(req,res)=>
{
    res.render("userdashboard"); //before login
}