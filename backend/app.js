const express = require('express');
const errorMiddleware = require('./middlewares/errors');

const products=require('./routes/product')
const auth=require('./routes/auth');
const order=require('./routes/order');
const payment=require('./routes/payment')

const cookieParser = require('cookie-parser');
const app=express();
const fileupload = require('express-fileupload');
const dotenv=require('dotenv')
dotenv.config({path:'config/config.env'})

const bodyparser = require('body-parser');
const path = require('path')

app.use(express.json())
app.use(cookieParser())
app.use(bodyparser.urlencoded({extended:true}))
app.use(fileupload())






app.use('/api/v1',products)
app.use('/api/v1',auth)
app.use('/api/v1',order)
app.use('/api/v1',payment)

if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })

if(process.env.NODE_ENV==='PRODUCTION')
{
    app.use(express.static(path.join(__dirname,'../frontend/build')))
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'../frontend/build/index.html'))
    })
}


app.use(errorMiddleware)

module.exports=app