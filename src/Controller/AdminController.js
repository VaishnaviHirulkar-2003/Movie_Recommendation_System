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