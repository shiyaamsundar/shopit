const  jwt  = require("jsonwebtoken")
const User = require("../models/user")
const ErrorHandler = require("../utlis/errorHandler")
const catchAsyncErrors = require("./catchAsyncErrors")



exports.isAuthenticatedUser=catchAsyncErrors(async (req,res,next)=>{


    const {token}=req.cookies

    if(!token)
    {
        return next(new ErrorHandler('Login first t0 access the resource',401))
    }



    const decoded=jwt.verify(token,process.env.JWT_SECRET)

    req.user=await User.findById(decoded.id)

    next()
    


})


exports.authorizedRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
            new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`,403)
            )}
        next()
    }
}


