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
exports.savedmovies = async (req, res) => {
    console.log("Session info:", req.session.username, req.session.u);

    if (req.session.username || req.session.u) {
        try {
            let r = await model.gettodata();
            console.log("Top data result:", JSON.stringify(r, null, 2));

            try {
                let saved = await usermodel.savedmovies(req.session.username,req.session.u);
                console.log(saved);
                // console.log("Saved movies:", JSON.stringify(saved, null, 2));
                res.render("userdashboard", { topdata: r, latest: saved, msg: "", module: "saved" });
            } catch (err) {
                console.log("Error in savedmovies():", err);
                res.render("userdashboard", { topdata: r, latest: [], msg: "", module: "saved" });
            }
        } catch (err) {
            console.log("Error in gettodata():", err);
            res.render("userdashboard", { topdata: [], latest: [], msg: "", module: "saved" });
        }
    } else {
        console.log("Nothing in your watchlist");
        res.redirect("/login"); // or whatever route you want
    }
};


