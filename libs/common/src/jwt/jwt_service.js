const jwt = require('jsonwebtoken');
require('dotenv').config();

class JwtServices{
    static generateToken(payload){
        const secretKey = process.env.JWT_SECRET_KEY;
        const options ={
            expiresIn:process.env.JWT_SECRET_KEY_EXPIRY || '3h'
        };
        return jwt.sign(payload,secretKey,options);
    }
    static verifyToken(token){
        const secretKey = process.env.JWT_SECRET_KEY;
        try{
            return jwt.verify(token,secretKey);
        }catch(err){
            throw new Error('Invalid token');
        }
    }

}

module.exports = JwtServices;