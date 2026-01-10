function errorHandler(err,req,res,next){
    console.error(err);

    if(err.name == "ValidationError"){
        const messages = Object.values(err.errors).map(e => e.message)
        return res.status(400).json({
            success:false ,
            message: "Validation Error",
            data: {errors:messages},
        })
    }
    const statusCode = err.statusCode || 500
    return res.json({
        success:false,
        message:"Internal Server Error" || err.message,
        data:null
    })
    
}
module.exports = errorHandler