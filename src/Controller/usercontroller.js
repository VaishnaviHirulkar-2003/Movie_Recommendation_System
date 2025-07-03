let express = require("express");
let adminmodel = require("../Model/AdminModel");
let model = require("../Model/Model");
let usermodel = require("../Model/usermodel");
const session = require("express-session");
const con = require("../Config/db");
let bcrypt = require("bcrypt");
// const { use } = require("react");

//for adding in watchlist
exports.addwatchlist = async (req, res) => {
  const mid = req.query.mid;
  const user = req.session.username || req.session.u;
  console.log(req.session.username + "" + req.session.u)
  if (!user) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }

  try {

    let r = await usermodel.addwatchlist(mid, user);
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
        let saved = await usermodel.savedmovies(req.session.username, req.session.u);
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
    res.redirect("/loginuser"); // or whatever route you want
  }
};


//to search data
exports.search = async (req, res) => {
  try {
    const data = req.query.name;
    const search = await usermodel.getsearch(data);
    console.log(search);
    res.render("SerachResult.ejs", { latest: search });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading search results");
  }
};
exports.userProfile = async (req, res) => {
  let data = req.session.username;

  try {
    let udata = await usermodel.getuserdata(data);
    res.render("ViewUserProfile.ejs", { udata, msg: "" });
    console.log(data);
  }
  catch (err) {
    console.log(err);
  }
};


exports.updateprofile = async (req, res) => {
  let { id, username, email, oldpass, newpass } = req.body;
  console.log(req.body);
  try {
    // Get user by ID (or username)
    let udata = await usermodel.getuserdata(username); // make sure this includes hashed password

    if (!udata || !udata.password) {
      return res.render("ViewUserProfile.ejs", { udata, msg: "User not found" });
    }

    // Compare old password with hashed one
    const isMatch = await bcrypt.compare(oldpass, udata.password);
    if (!isMatch) {
      return res.render("ViewUserProfile.ejs", { udata, msg: "Incorrect old password" });
    }

    // Hash new password
    const newHashedPass = await bcrypt.hash(newpass, 10);

    // Update user in DB
    const updateSuccess = await usermodel.UpdateuserafterProfile(id, oldpass, newHashedPass, username, email);
    console.log(updateSuccess);
    if (updateSuccess === "true") {
      res.render("ViewUserProfile.ejs", { udata: { ...udata, username, email }, msg: "Updated successfully" });
    } else {
      res.render("ViewUserProfile.ejs", { udata, msg: "Update failed" });
    }
  } catch (err) {
    console.error(err);
    res.render("ViewUserProfile.ejs", { udata: {}, msg: "Something went wrong" });
  }
};

exports.deleteaccount = async (req, res) => {
  let { userid } = req.body;
  console.log("Deleting user:", userid);

  try {
    let deleter = await usermodel.deleteuser(userid);

    // ✅ Destroy session after successful deletion
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        // Even if session fails, continue to inform user
        return res.render("index", {
          status: "signup",
          msg: "Account deleted, but session not cleared. Please clear cookies manually.",
          u: ""
        });
      }

      // ✅ Session destroyed, render homepage
      res.render("index", {
        status: "signup",
        msg: "Your account was deleted successfully.",
        u: ""
      });
    });
  } catch (err) {
    console.error("Delete error:", err);
    let udata = await usermodel.getuserdatabyid(userid);
    res.render("ViewUserProfile.ejs", {
      udata,
      msg: "Profile delete failed. Please try again."
    });
  }
};

//for clewar watchlist

const util = require('util');
const query = util.promisify(con.query).bind(con); // Make `con.query` awaitable

exports.removewatchlist = async (req, res) => {
  const id = req.query.id;
  const uid = req.query.uid;
  console.log(id,uid);
  try {
    // Remove from watchlist
    await usermodel.removewatchlistuser(id, uid);

    // Get teaser content
    const topdata = await model.gettodata();

    // Get username from user_id
    const result = await query("SELECT username FROM users WHERE user_id = ?", [uid]);

    if (result.length === 0) throw new Error("User not found");

    const username = result[0].username;

    // Get saved movies for user
    const saved = await usermodel.savedmovies(username, username);

    console.log(saved);

    res.render("userdashboard", {
      topdata,
      latest: saved,
      msg: "",
      module: "saved",
    });

  } catch (err) {
    console.error(err);

    const topdata = await model.gettodata();
    res.redirect("/userdashboard");
  }
};

