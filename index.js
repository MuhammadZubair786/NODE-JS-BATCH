const exp = require("express")
const app = exp()
const port = 5000 //assign 
var bodyParser = require('body-parser') //backend data (json)
const formData = require('express-form-data'); //
const mainRouter = require("./Router/mainRouter")
const mongoose = require("mongoose")
require("dotenv").config() //ENV =>SMTP=>PORT 

const dbUrl = process.env.ConnectString
mongoose.connect(dbUrl)

const db = mongoose.connection

db.once("open",()=>{
    console.log("MONGODB CONNECT  ")
})

db.on("error",()=>{
    console.log("connect error ")
})



app.use(bodyParser.json())
app.use(mainRouter) //ROUTER

//port assign 
app.listen(port, () => {
    console.log("Node js Listen on this port ", port)
})