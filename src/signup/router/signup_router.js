const express = require('express');
const router = express.Router();
const limiter = require('./../../../../libs/common/src/limitation/limit');
const {signupController,loginController, verifyEmailController} = require('./../controller/controller');
const checkApiKey = require('./../../../../libs/common/src/jwt/jwt_strategy');

router.post('/signup',checkApiKey,limiter, signupController);
router.post('/login',checkApiKey,limiter, loginController);
router.get('/verify-email',checkApiKey,limiter, verifyEmailController);


module.exports = router;