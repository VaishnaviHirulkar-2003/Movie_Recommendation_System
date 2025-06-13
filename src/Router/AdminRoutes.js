let router=require("express").Router();
let ctrl=require("../Controller/AdminController");
const multer = require("multer");
const upload = multer(); // no storage, just read fields



router.get("/moviesapi",ctrl.moviespage);
router.get("/addmoviepage",ctrl.addmoviepage);

// Route to handle add movie with file upload
router.post("/addmovie", upload.none(), ctrl.addmovie);

//for user menu for admin

router.get("/usersapi",ctrl.userapi);

router.get("/adduserpage",ctrl.adduserpage);
router.post("/savereguserbyadmin",ctrl.savereguserbyadmin);
module.exports=router;