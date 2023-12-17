const exp = require("express")
const router = exp.Router()
const userRouter = require("./userRouter")
const adminRouter = require("./adminRouter")

router.use("/user",userRouter)
router.use("/admin",adminRouter)


module.exports = router
