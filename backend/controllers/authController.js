const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/user");
const ErrorHandler = require("../utlis/errorHandler");
const sendToken = require("../utlis/jwtToken");
const sendEmail = require("../utlis/sendemail");
const crypto = require('crypto');
const cloudinary = require('cloudinary');

exports.registerUser=catchAsyncErrors(async(req,res,next)=>{

    const result=await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:'avatar',
        width:150,
        crop:"scale"
    })

    const {name,email,password}=req.body;

    const user=await User.create({
        name,email,password,
        avatar:{
            public_id:result.public_id,
            url:result.secure_url
        }
    })



    sendToken(user,200,res)


})


exports.loginUser=catchAsyncErrors(async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password){

        return next(new ErrorHandler('please enter email and password',400))
        
    }

    const user=await User.findOne({email}).select('+password')



    if(!user)
    {
        return next(new ErrorHandler('Invalid Email or Password',404))
    }

    const isPasswordMatched=await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler('invalid Email or Password',401))
    }

    // const token=user.getJwtToken()

    // res.status(200).json({
    //     success:true,
    //     token
    // })

    sendToken(user,200,res)
    

})



exports.logoutUser=catchAsyncErrors(async (req,res,next)=>{

    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })


    res.status(200).json({
        success:true,
        message:'Logged Out'
    })


})


exports.forgotPassword=catchAsyncErrors(async(req,res,next)=>{

    const user=await User.findOne({email:req.body.email})



    if(!user){
        return next(new ErrorHandler('User not found with this gmail',401))

    }

    //resert token
    const resetToken=user.getResetPasswordToken()

    await user.save({validateBeforeSave:false})

    //create reset password url

    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`


    const message=`Your password reset token is as follow :\n\n ${resetUrl}\n\n If you have not requested this email then , ignore it.`


    try{

        await sendEmail({
            email:user.email,
            subject:'shopIt password reset..',
            message
        })

        res.status(200).json({
            success:true,
            message:`Email send to : ${user.email}`
        })

    }catch(err){
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined


        await user.save({validateBeforeSave:false})

        return next(
            new ErrorHandler(err.message,500)
        )
    }




})



exports.resetPassword=catchAsyncErrors(async(req,res,next)=>{


        const resetPasswordToken=crypto.createHash('sha256').update(req.params.token).digest('hex')


        const user=await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}})
    
        if(!user){
            return next(new ErrorHandler('password reset token is invalid or has expired',400))
        }

        if(req.body.password!==req.body.confirmPassword){
            return next(new ErrorHandler('password dosent match',400))
        }

        user.password=req.body.password
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined

        await user.save()

        sendToken(user,200,res)


})



exports.getUserProfile=catchAsyncErrors(async (req,res,next)=>{

    const user=await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        user
    })
})



exports.updatePassword=catchAsyncErrors(async (req,res,next)=>{




    const user=await User.findById(req.user.id).select('+password')

    //check prev password

    const isMatched=await user.comparePassword(req.body.oldPassword)

    if(!isMatched){
        return next(new ErrorHandler('old Password is incorrect',400))


    }



    user.password=req.body.password
    await user.save()


    sendToken(user,200,res)





})



exports.updateProfile=catchAsyncErrors(async (req,res,next)=>{
    

    const newUserData={
        name:req.body.name,
        email:req.body.email,

    }

    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})




exports.allUsers=catchAsyncErrors(async (req,res,next)=>{
    const users= await User.find()

    res.status(200).json({
        success:true,
        users
    })
})


exports.getUserDetails=catchAsyncErrors(async (req,res,next)=>{
    const user= await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User dosent exist with this id :${req.params.id} `,400))

    }



    res.status(200).json({
        success:true,
        user
    })
})


exports.updateUser=catchAsyncErrors(async (req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }




    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,runValidators:true,useFindAndModify:false
    })

        res.status(200).json({
            success:true,

        })

})



exports.deleteUser=catchAsyncErrors(async (req,res,next)=>{

    

    const user=await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User dosent exist with if: ${req.params.id}`))
    }

    await user.remove()
    
        res.status(200).json({
            success:true,

        })


})
