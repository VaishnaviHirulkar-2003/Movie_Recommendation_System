let router=require("express").Router();
let ctrl=require("../Controller/Controller");
router.get("/",ctrl.indexpage);
router.get("/getregister",ctrl.indexreg);
router.get("/registeradmin",ctrl.getadminreg)
module.exports=router;