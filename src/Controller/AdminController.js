let express=require("express");
let model=require("../Model/AdminModel");
let commodel=require("../Model/Model");
//common model
let con=require("../Config/db");
exports.moviespage=(req,res)=>
{
    res.render("AdminDashBoard.ejs",{filename:"moviesadmin.ejs",childfilename:"no",msg:"",genre:[]});
}
exports.addmoviepage=(req,res)=>
{

    con.query("select * from genres",(err,result)=>
    {
         res.render("AdminDashBoard.ejs",{filename:"moviesadmin.ejs",childfilename:"addmoviesform.ejs",msg:"",genre:result})
    })
}
exports.addmovie=(req,res)=>
{
    // console.log(req.body);
let {title, desc, date,genre_id,dir,lang,country,rup,rev,time,img,url} = req.body;

    async function addmovie(){
            try
            {
            let result=await model.addmovie(title, desc, date,dir,lang,country,rup,rev,time,img,url,genre_id);
                    con.query("select * from genres",(err,gr)=> //for again genre dropdwon menu
                {
                     res.render("AdminDashBoard.ejs",{filename:"moviesadmin.ejs",childfilename:"addmoviesform.ejs",msg:"Movie Added",genre:gr})
                })
            }
            catch(err)
            {
                 con.query("select * from genres",(err,gr)=> //for again genre dropdwon menu
                {
                     res.render("AdminDashBoard.ejs",{filename:"moviesadmin.ejs",childfilename:"addmoviesform.ejs",msg:"Some Problem is here",genre:gr})
                })

            } 
            
    }
         addmovie();
}


exports.userapi=(req,res)=>
{
   res.render("AdminDashBoard.ejs",{filename:"useradmin.ejs",childfilename:"no",msg:"",genre:[]});
}

exports.adduserpage=(req,res)=>
{
    res.render("AdminDashBoard.ejs",{filename:"useradmin.ejs",childfilename:"adduserbyadminform.ejs",msg:"",genre:[]});
}
exports.savereguserbyadmin=(req,res)=>
{
    let{username,email,password,role}=req.body;
    async function getreg() {
            let r=await commodel.savereguser(username,email,password,role);
            if(r==="Sucess")
            {
                res.render("AdminDashBoard.ejs",{filename:"useradmin.ejs",childfilename:"adduserbyadminform.ejs",msg:"User Regsiter Sucessfully ",genre:[]});
            }
            else
            {
                res.render("AdminDashBoard.ejs",{filename:"useradmin.ejs",childfilename:"adduserbyadminform.ejs",msg:r,genre:[]});
            }
        } 
        getreg();
}

//for admin profile
exports.profileapi=(req,res)=>
{
    let username=req.session.adminname;
    console.log(username);
    async function getadmindata() 
    {
        let r=await model.profileapi(username);
        console.log(r);
        res.render("AdminDashBoard.ejs",{filename:"adminprofile.ejs",childfilename:"",msg:r,genre:[]});
    }
    getadmindata();
}
exports.updateadmin = (req, res) => {
  let { userid, username, password, npass, email } = req.body;

  async function updateprofile() {
    try {
      let r = await model.updateadmin(userid, username, password, npass, email);
      let updatedData = await model.profileapi(username);
      res.render("AdminDashBoard.ejs", {
        filename: "adminprofile.ejs",
        childfilename: "",
        msg: updatedData,
        genre: "Profile Updated Successfully",
      });
    } catch (err) {
      let originalData = await model.profileapi(username);
      console.log("helo");
      res.render("AdminDashBoard.ejs", {
        filename: "adminprofile.ejs",
        childfilename: "",
        msg: originalData,
        genre: err,
      });
    }
  }

  updateprofile();
};
exports.adminapi=(req,res)=>
{
    res.render("AdminDashBoard.ejs",{filename:"addadminbyadmin.ejs",childfilename:"no",msg:"",genre:[]});
}
exports.addadmin=(req,res)=>
{
    res.render("AdminDashBoard.ejs",{filename:"addadminbyadmin.ejs",childfilename:"addadminfile.ejs",msg:"",genre:[]})
}

exports.savereguserbyadmin = (req,res) => {
    console.log("yes");
     let uname=req.session.adminname;
     console.log(uname+"hello");
  const { username, email, oldpass,password, role } = req.body;
        async function getuserinsert() {
                try
                {
                    let r=await model.saveregadmin(username,email,oldpass,password,role,uname);
                    console.log(r);
                     res.render("AdminDashBoard.ejs",{filename:"addadminbyadmin.ejs",childfilename:"addadminfile.ejs",msg:r,genre:[]})

                }
                catch(err)
                {
                         console.log(err);
                         res.render("AdminDashBoard.ejs",{filename:"addadminbyadmin.ejs",childfilename:"addadminfile.ejs",msg:"Something wnet wrong",genre:[]})
                }
        }
        getuserinsert();
};
exports.viewmovies=async(req,res)=>
{
        try
        {   
        let r=await model.getmoviedata();
        console.log(r);
        res.render("AdminDashBoard.ejs",{filename:"moviesadmin.ejs",childfilename:"viewmovies.ejs",msg:"",movie:r})
        }
        catch(err)
        {
            res.render("AdminDashBoard.ejs",{filename:"moviesadmin.ejs",childfilename:"viewmovies.ejs",msg:"something went wrong",movie:[]})
        }
};

//for viewuserpage to render and data
exports.viewuserpagead=async(req,res)=>
{
    try
    {
        let r=await model.viewuser();
        res.render("AdminDashBoard.ejs",{filename:"useradmin.ejs",childfilename:"viewuser.ejs",msg:"",user:r})
    }
    catch(err)
    {
        res.render("AdminDashBoard.ejs",{filename:"useradmin.ejs",childfilename:"viewuser.ejs",msg:"something went wrong",user:[]})
    }
};

exports.logoutapi=(req,res)=>
{
    req.session.destroy((err) => {
    if (err) {
        console.log("Error destroying session:", err);
        res.status(500).send("Could not log out.");
    } else {
       res.render("index",{status:"login",msg:"",u:""});; // or wherever you want to redirect after logout
    }
    });

}

//view admin
exports.viewadmin=async(req,res)=>{
    try{
        let r=await model.getadmin();
         res.render("AdminDashBoard.ejs",{filename:"useradmin.ejs",childfilename:"viewadmin.ejs",msg:"",admin:r})

    }
    catch(err){
        res.render("AdminDashBoard.ejs",{filename:"useradmin.ejs",childfilename:"viewadmin.ejs",msg:"something went wrong",admin:[]})

    }

}

//delete
exports.deleteadminfile = (req, res) => {
    console.log("hii");
    res.render("AdminDashBoard.ejs",{filename:"Delete.ejs",msg:" "});
}
exports.deleteadmin =async(req,res)=>{
    let{username,password}=req.body;
try{
        let r=await model.deleteadmin(username,password)
          res.render("AdminDashBoard.ejs",{filename:"Delete.ejs",msg:r});
}
catch(err){
          res.render("AdminDashBoard.ejs",{filename:"Delete.ejs",msg:"Invalid"});
}
}


