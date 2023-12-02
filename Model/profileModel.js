const mongoose = require("mongoose")

const profileSchema = mongoose.Schema({
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"]
    },
    address: {
        type: String,
        required: true,
    },
    contactNo: {
        type: Number,
        required: true,
    },
    Image: {
        type: String,
        required: true
    },
    authId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "auth"
    }

})

module.exports = mongoose.model("Profile",profileSchema)