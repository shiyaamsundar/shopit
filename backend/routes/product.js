const express=require('express')
const {newProduct, getallProducts,getProductbyid,updateProduct ,deleteproduct, createProductReview,getProductReviews,deleteProductReviews, getAdminProducts} = require('../controllers/productController')
const { isAuthenticatedUser,authorizedRoles } = require('../middlewares/auth')
const router=express.Router()



router.route('/product/new').post(isAuthenticatedUser,authorizedRoles('admin'),newProduct)
router.route('/product/:id').get(getProductbyid)
router.route('/product/:id').put(isAuthenticatedUser,authorizedRoles('admin'),updateProduct)
router.route('/products').get(getallProducts)
router.route('/product/:id').delete(isAuthenticatedUser,authorizedRoles('admin'),deleteproduct)
router.route('/review').put(isAuthenticatedUser,createProductReview)

router.route('/reviews').get(isAuthenticatedUser,getProductReviews)
router.route('/reviews').delete(isAuthenticatedUser,deleteProductReviews)


router.route('/admin/products').get(getAdminProducts)



module.exports=router


