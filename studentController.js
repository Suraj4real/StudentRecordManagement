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
     try {
        const {email, password} = req.body
        const student = await Student.findOne({ email })
        if (!student) {
            throw new ApiError(404, "Student not registered")
        }
        const isMatched = bcrypt.compareSync(password, student.password)
        if (!isMatched) {
            throw new ApiError(401, "Invalid password");
        }
        return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
        id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        class: student.class,
  }
})
  } catch (err) {
    next(err);
  }
}

// Get all students
async function getAllStudents(req, res){
    try{
        const { class: className,rollNumber } = req.query
        const query ={}
        if(className){
            query.class=className
        }
        if(rollNumber){
            query.rollNumber=rollNumber
        }
        const students = await Student.find(query).select("-password")
        return res.status(200).json({
        success: true,
        message: "Students fetched successfully",
        data: students
})
    }
    catch (err) {
    next(err)
  }
}

// Get single student
async function getStudentById(req, res){
    try{
    const student = await Student.findById(req.params.id).select("-password")
    if (!student) {
      throw new ApiError(404, "Student not found")
    }
    return res.status(200).json({
        success: true,
        message:"Student fetched successfully",
        data:student
    })
    }
    catch(err){
        next(err)

    }
}

// Update student
async function updateStudent(req, res){
    try{
    const {name, email, rollNumber, class: studentClass} = req.body
    const updateStudent= 
    await Student.findByIdAndUpdate(req.params.id, {
        name: name,
        email: email,
        rollNumber: rollNumber,
        class: studentClass
    })
    if (!updateStudent) {
      throw new ApiError(404, "Student not found")
    }
    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updateStudent,
    })
    }
    catch(err){
        next(err)
    }
}

// Delete student
async function deleteStudent(req, res){
    try{
        const deleteStudent =await Student.findByIdAndDelete(req.params.id)
        if (!deleteStudent){
            throw new ApiError(404,"Student not found")
        }
        return res.status(200).json({
            success:true,
            message:"Student deleted sucessfully",
            data:null
        })
    }
    catch(err){
        next(err)
    }
}

// Search by roll number
async function searchByRollNumber(req, res){
    try{
        const {rollNumber} = req.query
    
    
        const student = await Student.findOne({rollNumber: rollNumber}).select("-password")
    
        if(!student){
        throw new ApiError(404,"Student not found")
        }
        return res.status(200).json({
        success: true,
        message: "Student fetched successfully",
        data: student
        })
    }
    catch(err){
        next(err)
    }
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