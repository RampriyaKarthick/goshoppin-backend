const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview } = require('../controllers/productControllers');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate')

router.route('/products').get(isAuthenticatedUser, getProducts);
router.route('/product/:id').get(getSingleProduct)
                            .put(updateProduct)
                            .delete(deleteProduct)

router.route('/review').put(isAuthenticatedUser, createReview);    
router.route('/review').delete(isAuthenticatedUser,authorizeRoles('admin'), deleteReview);      
router.route('/review').get(getReviews);                     
                            
//Admin routes
router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles('admin') , newProduct);

module.exports = router;