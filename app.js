require("dotenv").config()
const express = require("express")
const connection = require("./database/connection")
const {
    registerStudent,
    loginStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    searchByRollNumber
} = require("./controllers/studentController")

const app = express()
connection()

app.use(express.json())

// Routes
app.post("/register", registerStudent)
app.post("/login", loginStudent)
app.get("/students", getAllStudents)
app.get("/students/:id", getStudentById)
app.patch("/students/:id", updateStudent)
app.delete("/students/:id", deleteStudent)
app.get("/search", searchByRollNumber)

app.listen(3000, function(){
    console.log("Server started on port 3000")
})