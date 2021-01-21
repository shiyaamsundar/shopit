const ErrorHandler = require("../utlis/errorHandler");




module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || 'Internal server Error'

    if(process.env.NODE_ENV==='DEVELOPMENT')
    {
            res.status(err.statusCode).json({
                success:false,
                error:err,
                errMessage:err.message,
                stack:err.stack
            })
    }

    if(process.env.NODE_ENV==='PRODUCTION')
    {
        let errror={...err}
        error.message=err.message


        //id error
        if(err.name=='CastError'){
            const message=`Resource not found Invalid :$${err.path}`
            error=new ErrorHandler(message,400)
        }

        //mangoose validation

        if(err.name==='ValidationError'){
            const message=Object.values(err.errors ).map(value=>value.message)
            error=new ErrorHandler(message,400)
        }


        if(err.code===11000)
        {
            const message=`Duplicate ${Object.keys(err.keyValue)} entered`
            error=new ErrorHandler(message,400)
        
        }    

        if(err.name==='TokenExpiredError')
        {
            const message='Token is expried ...   !! try again....'
            error=new ErrorHandler(message,400)
        
        }       



        if(err.name==='JsonWebTokenError')
        {
            const message='Json Web Token is Invalid ...   !! try again....'
            error=new ErrorHandler(message,400)
        
        }        

    res.status(err.statusCode).json({
        success:false,
        message:err.message || 'Internal Server Error'
    })
}


}