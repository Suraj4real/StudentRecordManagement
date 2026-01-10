class ApiError extends Error{ //Inherits behavior/attributes from built-in JS class called Error
    constructor(statusCode,message){
        super(message)
        this.statusCode = statusCode
    }
}
module.exports = ApiError