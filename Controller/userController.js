const userValidate = require("../Validator/validateUser");
const userModel = require("../Model/authModel")
const bcrypt = require("bcrypt")
require("dotenv").config()
const jWT = require("jsonwebtoken")
const nodemailer = require("nodemailer");
const profileValidate = require("../Validator/validateProfile");
const profileModel = require("../Model/profileModel");
const authModel = require("../Model/authModel");
const { sendEmail } = require("../constants/sendEmailOtp");

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

            const otp = Math.floor(100000 + Math.random() * 900000)

            req.body.password = hashPassword
            req.body.otp = otp



            const user = userModel(req.body) //PROVIDEA DATA TO MODEL
            await user.save()

            const token = jWT.sign({ user_id: user._id }, secret_key, { expiresIn: "2h" })
            sendEmail("create Account", email, otp)
            return res.status(201).json({
                message: "User Created",
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

    const { body, headers } = req
    const { authorization } = headers
    const { otp, otp_type } = body
    if (!authorization) {
        return res.status(401).json({
            message: "token not provide"
        })
    }
    else {
        if (otp_type != null && otp_type == "verify_Account" || otp_type == "forgot_password") {
            if (otp_type == "verify_Account") {
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
                                message: "verify otp",
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
            else if (otp_type == "forgot_password") {
            
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
                    jWT.verify(authorization, secret_key, async (error, decode) => {
                        if (error) {
                            return res.status(400).json({
                                message: "invalid token"
                            })
                        }
                        else {

                            var userFind = await authModel.findById(decode.user_id)
                            if (userFind != null) {
                                if (userFind.otp == otp) {
                                    return res.status(200).json({
                                        message: "verify Otp for change password",
                                        // data:decode
                                    })

                                }
                                else {
                                    return res.status(400).json({
                                        message: "invalid otp",
                                        data: decode
                                    })

                                }

                            }
                            else {
                                return res.status(404).json({
                                    message: "user not found",
                                    data: decode
                                })
                            }

                        }

                    })

                }

            }
        }
        else {
            return res.status(200).json({
                message: "otp type required[verify_Account,forgot_password]",
                // data:decode
            })
        }



    }



    // }
    // catch (e) {
    //     return res.status(500).json({
    //         message: "Internal server error",
    //         error: e
    //     });


    // }

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

                var user = await authModel.findById(req.userId)

                if (user.completeProfile == false) {
                    await profileValidate.validateAsync(req.body)

                    var obj = {
                        gender: req.body.gender,
                        contactNo: req.body.contactNo,
                        address: req.body.address,
                        Image: req.file.path,
                        authId: req.userId
                    }

                    var userProfile = profileModel(obj)
                    await userProfile.save()



                    await authModel.findByIdAndUpdate(req.userId, {
                        completeProfile: true,
                        profileId: userProfile._id

                        // profileId:

                    })
                    return res.status(200).json({
                        message: "profile update",
                        // data: obj

                    })
                }
                else {
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

exports.login = async (req, res) => {

    let { body } = req
    var { email, password } = body
    if (email == undefined || password == undefined) {
        return res.status(200).json({
            message: "Enter All Required Field (Email,Password)",
            status: false
        });
    }
    else {
        var checkEmail = await authModel.findOne({ email }).populate({
           path:"profileId",
           populate:{
            path :"authId",
            populate:{
                path:"profileId"
            }
           
        }
    }
        )

        if (checkEmail) {
            var checkpassword = await bcrypt.compare(password, checkEmail.password)
            console.log(checkpassword)
            if (checkpassword) {
                if (checkEmail.isVerify == false) {
                    return res.status(200).json({
                        message: "plz verify your account",
                        data: checkEmail
                    });

                }
                else {
                    return res.status(200).json({
                        message: "get user",
                        data: checkEmail
                    });
                }

            }
            else {
                return res.status(400).json({
                    message: "Incorrect password",
                    // data: checkEmail
                });
            }


        }
        else {
            return res.status(404).json({
                message: "user not found",

            });
        }


    }


    // console.log(req.body)

    res.send("Hello test")
    // }
    // catch (e) {
    //     return res.status(500).json({
    //         message: "Internal server error",
    //         error: e
    //     });

    // }
}

exports.fortgotPasssword = async (req, res) => {
    try {
        const { body } = req
        const { email } = body
        if (email == undefined || email.length == 0) {
            return res.status(400).json({
                message: "email required",

            })

        }
        else {
            let userFind = await authModel.findOne({ email })
            console.log(userFind)

            if (userFind == null) {
                return res.status(404).json({
                    message: "user not found",

                })
            }
            else {
                const otp = Math.floor(Math.random() * 900000)

                sendEmail("forgot Password Mail", email, otp)
                await userFind.updateOne({ otp })

                const token = jWT.sign({ user_id: userFind._id }, secret_key, { expiresIn: "2h" })



                return res.status(200).json({
                    message: "get Data",
                    data: userFind,
                    token


                })
            }

        }




    }
    catch (e) {
        return res.status(400).json({
            message: "error",
            error: e



        })

    }


}


