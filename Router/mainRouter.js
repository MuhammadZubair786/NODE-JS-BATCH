const exp = require("express")
const router = exp.Router()
const userRouter = require("./userRouter")

router.use("/user",userRouter)


module.exports = router
