const mongoose = require("mongoose")
require("dotenv").config()

async function connection(){
    await mongoose.connect(process.env.CONNECTION_STRING)
    console.log("Database Connected successfully!!")
}

module.exports = connection