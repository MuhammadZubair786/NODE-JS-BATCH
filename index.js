const exp = require("express")
const app = exp()
const port = 5000
var bodyParser = require('body-parser')
const formData = require('express-form-data');

app.use(formData.parse());
app.use(bodyParser.urlencoded({}))
app.use(bodyParser.json())

app.get("/", (req, res) => {

    res.send("Hello world")
})
app.post("/", (req, res) => {
    console.log(req.files)
    res.send("req.body")

})



//port assign 
app.listen(port, () => {
    console.log("Node js Listen on this port ", port)
})