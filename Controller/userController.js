const userValidate = require("../Validator/validateUser");
const userModel = require("../Model/authModel")
const bcrypt = require("bcrypt")
require("dotenv").config()
const jWT = require("jsonwebtoken")

const secret_key = process.env.secret_key

exports.userCreate = async (req, res) => {
    // try {
        await userValidate.validateAsync(req.body)

        const { email, password } = req.body  //desctructing


        let checkEmail = await userModel.findOne({ email })
        if (checkEmail) {
            return res.status(201).json({
                message: "User Already Regsister",
                data: checkEmail
            })
        }
        else {
            const hashPassword = await bcrypt.hash(password, 12)

            const otp = Math.floor(Math.random() * 900000)

            req.body.password = hashPassword
            req.body.otp = otp



            const user = userModel(req.body)
            await user.save()

            console.log(secret_key)
            const token = jWT.sign({ user_id: user._id }, secret_key, { expiresIn: "2h" })
          
            return res.status(201).json({
                message: "User Crteated ",
                data: user,
                token
            })
        }


    // }
    // catch (e) {
    //     return res.status(500).json({
    //         message: "VALIDATE",
    //         error: e
    //     });

    // }
}

exports.signup = async (req, res) => {
    try {
        await userValidate.validateAsync(req.body)

        // console.log(req.body)

        res.send("Hello test")
    }
    catch (e) {
        return res.status(500).json({
            message: "Internal server error",
            error: e
        });

    }
}


