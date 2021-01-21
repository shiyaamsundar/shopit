const app=require('./app')

const dotenv=require('dotenv')
const connectDatabase = require('./config/database')
const cloudinary=require('cloudinary')


dotenv.config({path:'config/config.env'})

connectDatabase()

const server=app.listen(process.env.PORT,()=>{
    console.log(`server is started on PORT ${process.env.PORT} in ${process.env.NODE_ENV}`)
})

process.on('unhandledRejection',err=>{
    console.log(`ERROR:${err.message}`)
    console.log('Shutting down the server due to Unhandled Promies ')
    server.close(()=>{
        process.exit(1)
    })

})

if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })




cloudinary.config({
    cloud_name:process.env.C_NAME,
    api_key:process.env.C_KEY,
    api_secret:process.env.C_SECRET,

})