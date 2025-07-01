const {signupService,loginService} = require('./../service/service');
const db  =require('./../../../../libs/common/src/config/db');
const logger = require('./../../../../libs/common/src/logger/logger');
const { verifyTokenAndGetPayload } = require('../../../../libs/common/src/jwt/token_helper');
async function signupController(req,res) {
    const userData = req.body;
    console.log('this is the user data from request body',userData)
    const response = await signupService(userData);
    if (response && response.success) {
        return res.status(201).json({
            success: response.success,
            message: response.message
         })
    } else {
        return res.status(400).json({
            success: response.success,
            message: response.message
        })
    }
}

async function verifyEmailController(req, res) {
    const token = req.query.token;

    if (!token) {
        return res.status(400).send('Missing verification token.');
    }

     const userResult = await db.query('SELECT * FROM users WHERE verification_token = $1', [token]);

     if (userResult.rows.length === 0) {
        return res.status(400).send({success:false, message:'Invalid verification token.'});
    }

     const user = userResult.rows[0];
    user.is_email_verified = true;
    user.verification_token = null;

     await db.query('UPDATE users SET is_email_verified = $1, verification_token = $2 WHERE id = $3', 
        [user.is_email_verified, user.verification_token, user.id]);

    return res.status(200).send({success:true, message:'Email verified successfully.'});
}

async function loginController(req,res) {
    const userData = req.body;
    const response = await loginService(userData);
    if (response && response.success) {
        return res.status(201).json({
            success: response.success,
            message: response.message,
            data: response.data,
            token:response.token

         })
    } else {
        return res.status(400).json({
            success: response.success,
            message: response.message
        })
    }
    
}




module.exports = {signupController,loginController, verifyEmailController};