const express = require('express');
const { registrerUser, forgotPassword, resetPassword } = require('../controllers/authControlleer');
const{loginUser, logoutUser} = require('../controllers/authControlleer')
const router = express.Router();

router.route('/register').post(registrerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);

module.exports= router;
