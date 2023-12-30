const exp = require("express")
const router = exp.Router()
const jWT = require("jsonwebtoken")
const secret_key = process.env.secret_key

exports.authMedialWare = async (req, res,next) => {
    const { headers } = req
    const { authorization } = headers
    try {
        if (!authorization) {
            return res.status(401).json({
                message: "token not provide 123"
            })
        }
        jWT.verify(authorization, secret_key, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    message: "unauthorization"
                })
            }
            else {
                req.userId = decode.user_id
                console.log("*********************")
                console.log(decode)

            }
        })
        return next();



    }
    catch (e) {
        return res.status(401).json({
            message: "error"
        })
    }
}

