const express = require('express');
const { registrerUser, 
    forgotPassword, 
    resetPassword, 
    getUserProfile, 
    changePassword,
    updateProfile,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser} = require('../controllers/authControlleer');
const{loginUser, logoutUser} = require('../controllers/authControlleer')
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate')

router.route('/register').post(registrerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/password/change').put(isAuthenticatedUser,changePassword);
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile);
router.route('/update').put(isAuthenticatedUser, updateProfile);

//Admin routes
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'), getAllUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles('admin'), getUser)
.put(isAuthenticatedUser,authorizeRoles('admin'), updateUser)
.delete(isAuthenticatedUser,authorizeRoles('admin'), deleteUser);




module.exports= router;
