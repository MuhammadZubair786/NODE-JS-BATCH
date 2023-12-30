const authModel = require("../Model/authModel")
const profileModel = require("../Model/profileModel")
const userValidate = require("../Validator/validateUser")
const secret_key = process.env.secret_key
const jWT = require("jsonwebtoken")

exports.signUp = async (req, res) => {
    try {
        await userValidate.validateAsync(req.body)
        req.body.otp = 123456

        var signUpAdmin = authModel(req.body)
        await signUpAdmin.save()


        return res.status(200).json({
            message: "api call",
            data: signUpAdmin
        })

    }
    catch (e) {
        return res.status(401).json({
            message: "error",
            e
        })
    }


}

exports.login = async (req, res) => {
    try {

        let { email, password } = req.body

        //     var piplines = [
        //         {
        //             $match: {
        //               userType: 'admin',
        //               email: 'adminapp@yopmail.com',
        //               password: '12345678'
        //             }
        //           }
        //     ] 

        //    var result =  await authModel.aggregate(piplines) 
        //    console.log(result)

        var findemail = await authModel.findOne({ email })

        console.log(findemail)
        if (findemail == null) {
            return res.status(400).json({
                message: "email not regsister",
                data: findemail
            })
        }
        else {
            var passwordCheck = await authModel.findOne({ password })


            if (passwordCheck != null) {
                const token = jWT.sign({ user_id: findemail._id }, secret_key, { expiresIn: "2h" })
                return res.status(200).json({
                    message: "admin login",
                    data: passwordCheck,
                    token
                })
            }
            else {
                return res.status(200).json({
                    message: "inncoreect password",

                })
            }

        }








    }
    catch (e) {
        return res.status(401).json({
            message: "error",
            e
        })
    }
}

exports.getAllUser = async (req, res) => {
    try {

        const { headers } = req
        const { authorization } = headers

        if (!authorization) {
            return res.status(401).json({
                message: "token not provide"
            })
        }
        else {
            console.log(authorization)
            jWT.verify(authorization, secret_key, async (err, decode) => {
                if (err) {
                    return res.status(401).json({
                        message: "unauthorizationaSDADFASDAS"
                    })
                }
                console.log(decode)
                if (decode.type == "admin") {
                    var piplines = [
                        {
                            $match: {
                                userType: 'user',

                            }
                        }
                    ]

                    var result = await authModel.aggregate(piplines)
                    console.log(result)

                    return res.status(401).json({
                        message: "result",
                        data: result
                    })


                }
                else {
                    return res.status(401).json({
                        message: "please login as admin andf then ",
                        data: result
                    })
                }

                // req.userid = decode.user_id
            })
        }





    }
    catch (e) {
        return res.status(401).json({
            message: "error",
            e
        })
    }
}


exports.getProfile = async (req, res) => {
    

        let checkAdmin = await authModel.findById(req.userId)
      
        if(checkAdmin.userType=="admin"){
            let getAllUser = await authModel.find({})
            return res.status(200).json({
                message: "get all user ",
                data:getAllUser        
            })

        }
           return res.status(401).json({
            message: "plz login as admin",
             
        })
        
      
    // }
    // catch (e) {
    //     return res.status(401).json({
    //         message: "error",
    //         e
    //     })
    // }
}


exports.deleteUser = async(req,res)=>{
    // try{
        console.log(req.userId)
        let checkAdmin = await authModel.find({_id:req.userId,userType:"admin"})
        console.log(checkAdmin.length)
        if(checkAdmin.length>0){

            let deleteUser = await authModel.findByIdAndDelete(req.query.id)
            console.log(deleteUser)
            if(deleteUser.completeProfile){
                let deleteProfile = await profileModel.findByIdAndDelete(deleteUser.profileId)
                return res.status(200).json({
                    message: "user delete an dprofile successfully",
                })

            }
            return res.status(200).json({
                message: "user delete successfully",
            })

        }
        return res.status(200).json({
            message: "plz login as admin",
        }) 


        
    // }
    // catch(e){
    //     return res.status(401).json({
    //         message: "plz login as admin",
    //     })

    // }
}