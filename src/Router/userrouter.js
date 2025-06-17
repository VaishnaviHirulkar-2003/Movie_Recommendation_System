let router=require("express").Router();
let ctrl=require("../Controller/usercontroller");

router.get("/addwatchlist",ctrl.addwatchlist);
router.get("/savedmovies",ctrl.savedmovies);
module.exports=router;