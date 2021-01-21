const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,'Please enter your name'],
        maxlength:[30,'Your name cant exceed 30 char'],
        
        
    },
    email:{
        type:String,
        required:[true,'please enter your email'],
        unique:true,
        validate:[validator.isEmail,'Please enter a valid email ']
    },
    password:{
        type:String,
        required:[true,'please enter your password'],
        minlength:[6,'your password must b longer than 6 char'],
        select:false

    },
    avatar:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            require:true
        }
    },role:{
        type:String,
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,



})

//password bcrypt
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }

    this.password=await bcrypt.hash(this.password,10)
})



//jwt token

userSchema.methods.getJwtToken= function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXIPRES_TIME
    })
}

//compare password

userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
    }



    //password reset token

    userSchema.methods.getResetPasswordToken=function(){

        //gen token
        const resetToken=crypto.randomBytes(20).toString('hex')

        //hash and set to reset password token
        this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex')

        //set token expire time

        this.resetPasswordExpire=Date.now()+30*60*1000

        return resetToken


    }


module.exports=mongoose.model('User',userSchema)