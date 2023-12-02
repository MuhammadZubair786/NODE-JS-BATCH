const exp = require("express")
const userValidate = require("../Validator/validateUser")
const router = exp.Router()
const userController = require('../Controller/userController')
const multer = require("multer")


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads/")
    },
    filename:function(req,file,cb){
        const uniqeString =  Date.now()+ "-"+Math.round(Math.random()*1E9)
        const ext = file.originalname.split('.').pop()
        cb(null,"media-"+uniqeString + "."+ ext )
    }
})

const upload = multer({storage:storage})

router.post("/signup",userController.userCreate )
router.post("/verify-otp",userController.verifyOtp )
router.post("/complete-profile",upload.single("Image"),userController.completeProfile )


router.post("/signin",userController.signup )



module.exports = router
