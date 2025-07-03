let router=require("express").Router();
let ctrl=require("../Controller/AdminController");
const multer = require("multer");
let con=require("../Config/db")
const upload = multer(); // no storage, just read fields


router.get("/moviesapi",ctrl.moviespage);
router.get("/addmoviepage",ctrl.addmoviepage);

// Route to handle add movie with file upload
router.post("/addmovie", upload.none(), ctrl.addmovie);

//for user menu for admin
router.get("/usersapi",ctrl.userapi);
router.get("/adduserpage",ctrl.adduserpage);
router.post("/savereguserbyadmin",ctrl.savereguserbyadmin);
router.get("/profileapi",ctrl.profileapi);
router.post("/updateadmin",ctrl.updateadmin);
router.get("/adminapi",ctrl.adminapi);
router.get("/addadmin",ctrl.addadmin);
router.get("/viewmovies",ctrl.viewmovies);
router.get("/viewuserpagead",ctrl.viewuserpagead);
router.get("/logoutapi",ctrl.logoutapi);
router.get("/viewadmin",ctrl.viewadmin);
router.get("/Deleteapi",ctrl.deleteadminfile);
router.post("/deleteadminapi",ctrl.deleteadmin);
router.get("/getmoviedatabyadmintoview",ctrl.getmoviedatabyadmintoview);
router.get("/deletemoviebyId",ctrl.deletemoviebyId);


//delete use or handle user

router.get("/deleteuser",ctrl.deleteuser);

//to view particular profile after click on view button

router.get("/viewProfileparticular",ctrl.viewProfileparticular);

//to view the particular movies of the user watchlist
router.get("/watchlist",ctrl.watchlist);

//to search movies
// routes/admin.js

// Search route using promises
router.get('/searchmovie', (req, res) => {
  const search = req.query.query || '';

  const sql = `SELECT * FROM movies WHERE title LIKE ?`;
  con.query(sql, [`%${search}%`], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).send("Server Error");
    }

    let html = '';
    results.forEach((m, i) => {
      html += `
        <tr>
          <td>${i + 1}</td>
          <td>${m.title}</td>
          <td>${m.director}</td>
          <td><a href="/admin/getmoviedatabyadmintoview?id=${m.movie_id}" class="view-link">View</a></td>
          <td><a href="/admin/deletemoviebyId?id=${m.movie_id}"><button><i class="fas fa-trash-alt"></i></button></a></td>
          <td><a href="#"><button><i class="fas fa-pen-to-square"></i></button></a></td>
        </tr>
      `;
    });

    res.send(html); // send <tr> rows directly
  });
});

//to search user

router.get('/searchuser', (req, res) => {
  const search = req.query.query || '';

  const sql = `SELECT * FROM users WHERE username LIKE ?`;
  con.query(sql, [`%${search}%`], (err, results) => {
    if (err) {
      console.error("Search error:", err);
      return res.status(500).send("Server Error");
    }

    if (results.length === 0) {
      return res.send(`
        <tr>
          <td colspan="7"><strong>No matching users found.</strong></td>
        </tr>
      `);
    }

    let html = '';
    results.forEach((u, index) => {
      html += `
        <tr>
          <td>${index + 1}</td>
          <td>${u.username}</td>
          <td>${u.email}</td>
          <td><a href="/admin/viewProfileparticular?id=${u.user_id}">View</a></td>
          <td>
            <a href="/admin/deleteuser?id=${u.user_id}">
              <button><i class="fas fa-trash-alt"></i></button>
            </a>
          </td>
        </tr>
      `;
    });

    res.send(html);
  });
});
module.exports=router;
