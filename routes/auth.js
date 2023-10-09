const express = require('express');
const { registrerUser } = require('../controllers/authControlleer');
const{loginUser, logoutUser} = require('../controllers/authControlleer')
const router = express.Router();

router.route('/register').post(registrerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);

module.exports= router;
