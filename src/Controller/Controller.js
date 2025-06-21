let express=require("express");
let model=require("../Model/Model")
exports.indexpage=(req,res)=>
{
    if(req.session.adminname)
    {
        // console.log("yes"+req.session.adminname);
          res.render("AdminDashBoard.ejs",{filename:"no",childfilename:"no",msg:"",genre:[]});
    }
    else if(req.session.username || req.session.regusername)
    {
         res.redirect("/userdashboard");
    }
    else{
    res.render("index",{status:"login",msg:"",u:""});
    }
}
exports.indexreg=(req,res)=>
{
    console.log(req.query.u);
    if(req.session.regusername)
     {
            res.redirect("/userdashboard");
     }
     else
     {//onlu user
            res.render("index",{status:"signup",msg:"",u:""});
     }
}

exports.loginuser=(req,res)=>
{
    let{username,password,role}=req.body;
    async function getuser() {
        try{
        let result=await model.loginuser(username,password,role);
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
                res.redirect("/userdashboard");//after login
            }
        }
        else
        {
            res.render("index",{status:"login",msg:result,u:""});
        }
    }
     catch (err) {
        res.render("index", { status: "login", msg: err ,u:""});  // For database error or invalid password
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
            res.render("index",{status:"signup", msg:"Registration Sucessfull",u:username})
        }
        else
        {
            res.render("index",{status:"signup", msg:r,u:""})
        }
    } 
    getreg();
}
exports.userdashboard=(req,res)=>
{
    req.session.regusername=req.query.u;
    // console.log(req.session.regusername);
    async function getdataforteaser() {
        try
        {
            let r=await model.gettodata();
            let latestr=await model.getlatest();
            let marathimovie=await model.getmarathimovie();
            // console.log(latestr);
            res.render("userdashboard",{topdata:r,latest:latestr,msg:"",module:"home",marathi:marathimovie}); //before login
        }
        catch(err)
        {
            res.render("userdashboard",{topdata:{poster_url :"./Image/sairat.png",trailer_url:"linkrel",Title:"Gum Hain Kisi Ke Pyar Main"},latest:[],msg:"",module:"home",marathi:[]} );
        }   
    }
    getdataforteaser();
}