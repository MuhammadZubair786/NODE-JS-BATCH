const exp = require("express")
const router = exp.Router()
const adminController = require("../Controller/adminController")
const MiddleWare = require("./authMedialWare")

// router.post("/signup",adminController.signUp)
router.post("/login",adminController.login)
router.get("/getAllUser",adminController.getAllUser)
router.get("/getprofile",MiddleWare.authMedialWare,adminController.getProfile)
router.delete("/deleteUser",MiddleWare.authMedialWare,adminController.deleteUser)



module.exports = router