const mongoose = require("mongoose")

//connect node to mongodb database
mongoose.connect("mongodb://localhost:27017/login") //last 'login' is name of database
.then(()=>{
    console.log("mongo connected")
})
.catch(()=> {
    console.log("failed to connect")
})

//schema for the document
const LogInSchema = new mongoose.Schema( {
    name: {
        type:String,
        require: true
    },
    password: {
        type:String,
        require: true
    }
})

//define the colletion
const collection = new mongoose.model("Collection1", LogInSchema)

//necesssary to get into index.js
module.exports = collection
