let express=require("express");
let adminmodel=require("../Model/AdminModel");
let model=require("../Model/Model");
let usermodel=require("../Model/usermodel");
const session = require("express-session");

//for adding in watchlist
exports.addwatchlist = async (req, res) => {
  const mid = req.query.mid;
  const user = req.session.username || req.session.u;
    console.log(req.session.username+""+req.session.u)
  if (!user) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }

  try {
  
    let r=await usermodel.addwatchlist(mid,user);
    console.log(`Movie ID ${mid} added to ${user}'s watchlist`);
    return res.json({ success: true, message: r });
  } catch (err) {
    console.error("Watchlist error:", err);
    return res.status(500).json({ success: false, message: "Not added" });
  }
};

exports.savedmovies=async(req,res)=>
{
        console.log(req.session.username+" "+req.session.u);
}; 

