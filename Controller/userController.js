const userValidate = require("../Validator/validateUser");
const userModel = require("../Model/authModel")
const bcrypt = require("bcrypt")
require("dotenv").config()
const jWT = require("jsonwebtoken")
const nodemailer = require("nodemailer");
const profileValidate = require("../Validator/validateProfile");
const profileModel = require("../Model/profileModel");
const authModel = require("../Model/authModel");

const secret_key = process.env.secret_key

exports.userCreate = async (req, res) => {
    try {
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



            const user = userModel(req.body) //PROVIDEA DATA TO MODEL
            await user.save()

            console.log(secret_key)
            const token = jWT.sign({ user_id: user._id }, secret_key, { expiresIn: "2h" })


            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.smtpemail,
                    pass: process.env.smtppasskey,
                },
                tls: {
                    rejectUnauthorized: false
                }

            })

            const info = {
                from: process.env.smtpemail,
                to: email,
                subject: "Welcome to SMIT MAIL SERVICE",
                html: `
                <h1>Verify Account</h1>
                <p>your otp is : ${otp}</p>   
                `

            }

            transporter.sendMail(info, (err, result) => {
                if (err) {
                    console.log(err)
                }
                else {

                }
            })

            return res.status(201).json({
                message: "User Crteated ",
                data: user,
                token
            })
        }


    }
    catch (e) {
        return res.status(500).json({
            message: "VALIDATE",
            error: e
        });

    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { body, headers } = req
        const { authorization } = headers
        const { otp } = body
        if (!authorization) {
            return res.status(401).json({
                message: "token not provide"
            })
        }
        else {
            if (otp == undefined) {
                return res.status(401).json({
                    message: "otp not provide"
                })
            }
            else if (otp.length != 6) {
                return res.status(401).json({
                    message: "Otp must be 6 letter"
                })
            }
            else {
                jWT.verify(authorization, secret_key, async (err, decode) => {
                    if (err) {
                        return res.status(401).json({
                            message: "unauthorization"
                        })
                    }
                    console.log(decode)
                    req.userid = decode.user_id
                    var userFind = await userModel.findById(req.userid)
                    console.log(userFind)
                    if (userFind.otp == otp) {
                        await userFind.updateOne({
                            isVerify: true
                        })
                        const token = jWT.sign({ user_id: req.userid }, secret_key, { expiresIn: "2h" })
                        return res.status(200).json({
                            message: "verify otp ",
                            token
                        })
                    }
                    else {
                        return res.status(401).json({
                            message: "invalid otp"
                        })
                    }

                })
            }
        }



    }
    catch (e) {
        return res.status(500).json({
            message: "Internal server error",
            error: e
        });


    }

}

exports.completeProfile = async (req, res) => {
    const { body, headers } = req
    const { authorization } = headers
    try {

        if (!authorization) {
            return res.status(401).json({
                message: "token not provide"
            })
        }

        jWT.verify(authorization, secret_key, async (err, decode) => {
            if (err) {
                return res.status(401).json({
                    message: "unauthorization"
                })
            }
            else {
                console.log(decode)
                req.userId = decode.user_id

                var user = await  authModel.findById(req.userId)

                if(user.completeProfile==false){
                      await profileValidate.validateAsync(req.body)

                var obj = {
                    gender: req.body.gender,
                    contactNo: req.body.contactNo,
                    address: req.body.address,
                    Image: req.file.path,
                    authId:req.userId
                }

                var userProfile = profileModel(obj)
                await userProfile.save()
                console.log(userProfile)

                await  authModel.findByIdAndUpdate(req.userId,{
                    completeProfile :true,
                    // profileId:

                })
                return res.status(200).json({
                    message: "profile update",
                    // data: obj

                })
                }
                else{
                    return res.status(200).json({
                        message: "already complete profile",
                        // data: obj
    
                    })
                }

              
            }

        })



    }
    catch (e) {
        return res.status(500).json({
            message: "error",
            e
        })
    }

    // return res.status(200).json({
    //     message:"upoads"
    // })

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


