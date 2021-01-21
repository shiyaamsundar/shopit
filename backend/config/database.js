const mongoose = require('mongoose');

const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true
    }).then(res=>{
        console.log(`mongo DB connected successfully host :${res.connection.host}`)
    })


}

module.exports=connectDatabase