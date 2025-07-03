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
let {title, desc, date,genre_id,dir,lang,country,rup,rev,time,img,url,movie} = req.body;

    async function addmovie(){
            try
            {
            let result=await model.addmovie(title, desc, date,dir,lang,country,rup,rev,time,img,url,genre_id,movie);
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
exports.viewmovies = async (req, res) => {
    try {
        let r = await model.getmoviedata(); // Get all movies (array)
        //for pagination
        const page = parseInt(req.query.page) || 1;
        const limit = 3;

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const pagedMovies = r.slice(startIndex, endIndex);
        const totalPages = Math.ceil(r.length / limit);

        res.render("AdminDashBoard.ejs", {
            filename: "moviesadmin.ejs",
            childfilename: "viewmovies.ejs",
            msg: "",
            movie: pagedMovies,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (err) {
        res.render("AdminDashBoard.ejs", {
            filename: "moviesadmin.ejs",
            childfilename: "viewmovies.ejs",
            msg: "Something went wrong",
            movie: [],
            currentPage: 1,
            totalPages: 1
        });
    }
};


//for viewuserpage to render and data
exports.viewuserpagead = async (req, res) => {
  try {
    let r = await model.viewuser(); // Fetch ALL users

    const perPage = 5;
    const page = parseInt(req.query.page) || 1;
    const totalUsers = r.length;
    const totalPages = Math.ceil(totalUsers / perPage);

    const start = (page - 1) * perPage;
    const paginatedUsers = r.slice(start, start + perPage);

    res.render("AdminDashBoard.ejs", {
      filename: "useradmin.ejs",
      childfilename: "viewuser.ejs",
      msg: "",
      user: paginatedUsers,
      currentPage: page,
      totalPages,
      perPage
    });
  } catch (err) {
    res.render("AdminDashBoard.ejs", {
      filename: "useradmin.ejs",
      childfilename: "viewuser.ejs",
      msg: "something went wrong",
      user: [],
      currentPage: 1,
      totalPages: 1,
      perPage: 5
    });
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
exports.viewadmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let r = await model.getadmin(); // original logic stays the same

    const paginatedAdmins = r.slice(startIndex, endIndex); // JS-side pagination
    const totalPages = Math.ceil(r.length / limit);

    res.render("AdminDashBoard.ejs", {
      filename: "addadminbyadmin.ejs",
      childfilename: "viewadmin.ejs",
      msg: "",
      admin: paginatedAdmins,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (err) {
    res.render("AdminDashBoard.ejs", {
      filename: "addadminbyadmin.ejs",
      childfilename: "viewadmin.ejs",
      msg: "something went wrong",
      admin: [],
      currentPage: 1,
      totalPages: 1
    });
  }
};


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

//for feecthing particular data of the movie
exports.getmoviedatabyadmintoview=async(req,res)=>
{
    let  movie_id=req.query.id;
    try
    {
        let data=await model.getmoviedatabyid(movie_id);
        console.log(data)
         res.render("AdminDashBoard.ejs", {
            filename: "moviesadmin.ejs",
            childfilename: "viewparticularmovie.ejs",
            msg: "",
            d:data,
        });
    }
    catch(err)
    {
        console.log(err);
    }
}

//to delete the movies
exports.deletemoviebyId=async(req,res)=>
{
    let movie_id=req.query.id;

    try
    {
            let r=await model.deleteMovie(movie_id);
    }
   catch(err) 
   {
    console.log(err);
   }
   res.redirect("/admin/viewmovies");
}


//to delete particular user

exports.deleteuser=async(req,res)=>
{
    let id=req.query.id;

    try
    {
            let r=await model.deleteuserByid(id);
    }
    catch(err)
    {
        console.log(err);
    }
    res.redirect("/admin/viewuserpagead");
}

//to view pariticular user
exports.viewProfileparticular=async(req,res)=>
{
    let id=req.query.id;

    try
    {
        let r=await model.viewProfile(id);
         res.render("AdminDashBoard.ejs", {
            filename: "useradmin.ejs",
            childfilename:"viewparticularuser.ejs",
            msg: "",
            user:r,
        });
    }
    catch(err)
    {
        console.log(err);
    }
}

exports.watchlist=async(req,res)=>
{
    let id=req.query.id;
    try
    {
            let watch=await model.watchdata(id);
            console.log(watch);
              res.render("AdminDashBoard.ejs", {
            filename: "useradmin.ejs",
            childfilename:"ViewWatchlist.ejs",
            movies:watch.result,
            user_id:watch.id,
        });
    }
    catch(err)
    {
        console.log(err);
    }
}

