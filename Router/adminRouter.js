const exp = require("express")
const router = exp.Router()
const adminController = require("../Controller/adminController")

// router.post("/signup",adminController.signUp)
router.post("/login",adminController.login)
router.get("/getAllUser",adminController.getAllUser)


module.exports = router