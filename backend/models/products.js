const mongoose = require('mongoose');



let productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter product name'],
        trim:true,
        maxlength:[100,'product nae cant exceed 100 char']
    },
    price:{
        type:Number,
        required:[true,'please enter product price'],
        maxlength:[5,'product nae cant exceed 5 char'],
        default:0.0,
    },
    description:{
        type:String,
        required:[true,'please enter product description'],
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[{
        public_id:{
            type:String,
           // required:true
        },
        url:{
            type:String,
            //required:true
        },
    }],
    category:{
        type:String,
        required:[true,'please select category for this product'],
        enum:{
            values:[
                'Electronics',
                'Cameras',
                'Laptop',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Cloths/Shoes',
                'Beauty/health','Sports',
                'Outdoor',
                'Home',
                'Others'
            ],
            message:'please select correct category for product'
        }
    },
    seller:{
        type:String,
        required:[true,'Please enter product seller'],
    },stock:{
        type:Number,
        required:[true,'please enter product stock'],
        maxlength:[5,'product name cnt exceed 5 char'],
    },
    numofEeviews:{
        type:Number,
        default:0
    },
    reviews:[{
        name:{
            type:String,
            //required:true
        },
        rating:{
            type:Number,
            //required:true
        },
        comment:{
            type:String,
            //required:true
        },user:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true
    
        }
    }],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true

    }
})


module.exports=mongoose.model('Product',productSchema)
