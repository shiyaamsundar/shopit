const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const Product = require("../models/products")
const ErrorHandler = require("../utlis/errorHandler")
const APIFeatures = require("../utlis/apiFeatures")

const cloudinary = require('cloudinary');
const products = require("../models/products");


exports.newProduct=catchAsyncErrors(async(req,res,next)=>{



    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    req.body.user = req.user.id;

    
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})


exports.getallProducts=catchAsyncErrors(async (req,res,next)=>{


     
    const resPerPage=8

    const productscount=await Product.countDocuments()




    const apiFeatures=new APIFeatures(Product.find(),req.query)
    .search().filter()

    let products=await apiFeatures.query;
    let filterProductsCount=products.length


    apiFeatures.pagination(resPerPage)
    
    
    

     products=await apiFeatures.query

    



    res.status(200).json({
        success:true,
        productscount,
        products,resPerPage,filterProductsCount
    })
})


exports.getProductbyid=catchAsyncErrors(async (req,res,next)=>{

    

    const product=await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler('product not found',404))
    }
    
        res.status(200).json({
            success:true,
            product
        })
})


exports.updateProduct=catchAsyncErrors(async(req,res,next)=>{

    let product=await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler('product not found',404))
    }
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLinks

    }



    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })

})


exports.deleteproduct=catchAsyncErrors(async(req,res,next)=>{



    const product=await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler('product not found',404))
    }
    await product.remove()

    res.status(200).json({
        success:true,
        message:'Product is deleted'
    })

})



//crt new review


exports.createProductReview=catchAsyncErrors(async (req,res,next)=>{

    const {rating,comment,productId}=req.body

    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(req.body.rating),
        comment
    }




    const product=await Product.findById(productId)


    const isReviewed=product.reviews.find(
        r=>r.user.toString()===req.user._id.toString()
        )

        if(isReviewed)
        {
            
            product.reviews.forEach(review=>{
                
                if(review.user.toString()===req.user._id.toString())
                {
                    review.comment=comment
                    review.rating=rating
                }
            })

        }
        else{
            product.reviews.push(review),
            product.numofEeviews=product.reviews.length

            await product.save()
        }


        product.ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length


        await product.save({validateBforeSave:false})

        res.status(200).json({
            success:true
        })


})




//get product reviews..


exports.getProductReviews=catchAsyncErrors(async(req,res,next)=>{
    
    const product=await Product.findById(req.query.id)

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})

exports.deleteProductReviews=catchAsyncErrors(async(req,res,next)=>{


    const product=await Product.findById(req.query.productId)
   

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfEeviews=reviews.length
    
    const ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/reviews.length

    await Product.findByIdAndUpdate(req.query.productId,{

        reviews,ratings,numOfEeviews},{
            new:true,
            runValidators:true,
            useFindAndModify:false
        
    })

    Product.numOfEeviews=numOfEeviews
    




    

        


    res.status(200).json({
        success:true
    })
    await Product.save()
})


exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })

})