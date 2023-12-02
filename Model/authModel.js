const mongoose = require("mongoose")


const authSchema  =new  mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    userType:{
        type:String,
        required:true,
        enum : ["admin","user"]
    },
    isVerify :{
        type:Boolean,
        default : false
    },
    otp : {
        type:Number,
        required:true

    },
    completeProfile:{
        type:Boolean,
        default : false

    },
    profileId: {
        type:mongoose.Schema.Types.ObjectId,
        ref : "Profile" 
    }
})

module.exports = mongoose.model("auth",authSchema)

