let router=require("express").Router();
let ctrl=require("../Controller/usercontroller");

router.get("/addwatchlist",ctrl.addwatchlist);
router.get("/savedmovies",ctrl.savedmovies);
router.get("/search",ctrl.search);
router.get("/userProfile",ctrl.userProfile);

//for user update
router.post("/updateprofile",ctrl.updateprofile);
router.post("/deleteaccount",ctrl.deleteaccount);

//to delete from watchlist

router.get("/removewatchlist",ctrl.removewatchlist);

//to search movi
router.get('/searchmovie', async (req, res) => {
  const query = req.query.query;
  const results = await db.query("SELECT * FROM movies WHERE title LIKE ?", [`%${query}%`]);
  res.render("partials/movieRows", { movie: results }); // this renders only <tr>...</tr>
});

module.exports=router;