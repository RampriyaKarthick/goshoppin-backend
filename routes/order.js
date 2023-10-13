const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/authenticate");
const { newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder} = require("../controllers/orderController");
const router = express.Router();


router.route('/order/new').post(isAuthenticatedUser , newOrder);
router.route('/order/:id').get(isAuthenticatedUser , getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser , myOrders);

//admin routes
router.route('/admin/orders').get(isAuthenticatedUser , authorizeRoles('admin'), orders);
router.route('/admin/order/:id').put(isAuthenticatedUser , authorizeRoles('admin'), updateOrder);
router.route('/admin/order/:id').delete(isAuthenticatedUser , authorizeRoles('admin'), deleteOrder);

module.exports= router;