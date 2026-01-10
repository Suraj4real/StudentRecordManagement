const Student = require("../Models/studentModel")
const bcrypt = require("bcrypt")
const ApiError =require("../Utils/ApiError")

// Register student
async function registerStudent(req, res,next){
    try{
    const {name, email, rollNumber, class: studentClass, password} = req.body
    if(!name || !email || !rollNumber || !studentClass || !password){
        throw new ApiError(400,"Required Field is Missing bro.")
    }
    const existing = await Student.findOne({ $or: [ {email}, {rollNumber}]})
    if (existing){
        throw new ApiError(409,"Email or Roll Number is already registered bro.")
    }
    const student = await Student.create({
        name: name,
        email: email,
        rollNumber: rollNumber,
        class: studentClass,
        password: bcrypt.hashSync(password, 12)
    })
    return res.status(201).json({
        success:true ,
        message:"Registration ko lagi धन्यवाद!!",
        data:{id:student._id},
    })
    
}
catch(err){
    next(err)
}}

// Login student
async function loginStudent(req, res){
    const {email, password} = req.body
    
    const student = await Student.findOne({email: email})
    
    if(!student){
        return res.json({
            message: "Student not registered!"
        })
    }
    
    const isMatched = bcrypt.compareSync(password, student.password)
    
    if(isMatched){
        res.json({
            message: "Login successful!",
            student: {
                id: student._id,
                name: student.name,
                rollNumber: student.rollNumber,
                class: student.class
            }
        })
    } else {
        res.json({
            message: "Invalid password!"
        })
    }
}

// Get all students
async function getAllStudents(req, res){
    const students = await Student.find().select("-password")
    res.json({
        data: students
    })
}

// Get single student
async function getStudentById(req, res){
    const student = await Student.findById(req.params.id).select("-password")
    res.json({
        data: student
    })
}

// Update student
async function updateStudent(req, res){
    const {name, email, rollNumber, class: studentClass} = req.body
    
    await Student.findByIdAndUpdate(req.params.id, {
        name: name,
        email: email,
        rollNumber: rollNumber,
        class: studentClass
    })
    
    res.json({
        message: "Student updated successfully!"
    })
}

// Delete student
async function deleteStudent(req, res){
    await Student.findByIdAndDelete(req.params.id)
    res.json({
        message: "Student deleted successfully!"
    })
}

// Search by roll number
async function searchByRollNumber(req, res){
    const {rollNumber} = req.query
    
    const student = await Student.findOne({rollNumber: rollNumber}).select("-password")
    
    if(!student){
        return res.json({
            message: "Student not found!"
        })
    }
    
    res.json({
        data: student
    })
}

module.exports = {
    registerStudent,
    loginStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    searchByRollNumber
}