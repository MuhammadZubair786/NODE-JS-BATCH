const exp = require("express")
const userValidate = require("../Validator/validateUser")
const router = exp.Router()
const userController = require('../Controller/userController')

router.post("/signup",userController.userCreate )
router.post("/verify-otp",userController.verifyOtp )

router.post("/signin",userController.signup )



module.exports = router
