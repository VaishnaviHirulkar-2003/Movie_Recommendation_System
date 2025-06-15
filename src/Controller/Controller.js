let express=require("express");
let model=require("../Model/Model")
exports.indexpage=(req,res)=>
{
    if(req.session.adminname)
    {
        // console.log("yes"+req.session.adminname);
          res.render("AdminDashBoard.ejs",{filename:"no",childfilename:"no",msg:"",genre:[]});
    }
    else if(req.session.username)
    {
         res.render("userdashboard");
    }
    else{
    res.render("index",{status:"login",msg:""});
    }
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
        try{
        let result=await model.loginuser(username,password,role);
        // console.log(result)
        if(result==="Success")
        {
            if(role==="Admin")
            {
                req.session.adminname=username;
                // res.send("Admin DashBoard");
                res.render("AdminDashBoard.ejs",{filename:"no",childfilename:"no",msg:"",genre:[]});
            }
            else
            {
                // res.send("User Dashboard");
                req.session.username=username;
                res.render("userdashboard");//after login
            }
        }
        else
        {
            res.render("index",{status:"login",msg:result});
        }
    }
     catch (err) {
        res.render("index", { status: "login", msg: err });  // For database error or invalid password
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
    async function getdataforteaser(params) {
        try
        {
            let r=await model.gettodata();
            res.render("userdashboard",{topdata:r}); //before login
        }
        catch(err)
        {
            res.render("userdashboard",{topdata:{poster_url :"./Image/sairat.png",trailer_url:"linkrel",Title:"Gum Hain Kisi Ke Pyar Main"}} );
        }   
    }
    getdataforteaser();
}