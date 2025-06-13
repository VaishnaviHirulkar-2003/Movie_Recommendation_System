let router=require("express").Router();
let ctrl=require("../Controller/Controller");
router.get("/",ctrl.indexpage);
router.get("/getregister",ctrl.indexreg);
// router.get("/registeradmin",ctrl.getadminreg)
router.post("/loginuser",ctrl.loginuser);
router.post("/savereguser",ctrl.savereguser);
router.get("/userdashboard",ctrl.userdashboard);

module.exports=router;