const express = require('express');
const { registerUser, loginUser, logoutUser, forgotPassword,resetPassword, getUserProfile, updatePassword ,updateProfile, getUserDetails, allUsers, updateUser, deleteUser} = require('../controllers/authController');
const { isAuthenticatedUser, authorizedRoles } = require('../middlewares/auth');
const router=express.Router()





router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/getprofile').get(isAuthenticatedUser,getUserProfile)
router.route('/password/update').put(isAuthenticatedUser,updatePassword)
router.route('/profile/update').put(isAuthenticatedUser,updateProfile)


router.route('/admin/users').get(isAuthenticatedUser,authorizedRoles('admin'),allUsers)

router.route('/admin/user/:id').get(isAuthenticatedUser,authorizedRoles('admin'),getUserDetails)

router.route('/admin/user/:id').put(isAuthenticatedUser,authorizedRoles('admin'),updateUser)

router.route('/admin/user/:id').delete(isAuthenticatedUser,authorizedRoles('admin'),deleteUser)

module.exports=router