const exp = require("express")
const app = exp()
const port = 5000 //assign 
var bodyParser = require('body-parser') //backend data (json)
const formData = require('express-form-data'); //
const mainRouter = require("./Router/mainRouter")


app.use(bodyParser.json())
app.use(mainRouter)

//port assign 
app.listen(port, () => {
    console.log("Node js Listen on this port ", port)
})