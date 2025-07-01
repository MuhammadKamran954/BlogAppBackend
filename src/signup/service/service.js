require('dotenv').config();
const db = require('../../../../libs/common/src/config/db');
const { validateEmail, validateName } = require('./../dto/email_password');
const JwtServices = require('./../../../../libs/common/src/jwt/jwt_service');
const crypto = require('crypto');
const { sendSignupEmail } = require('../../../../libs/common/src/mail/mailer');

async function signupService(userData) {

    const nameValidation = validateName(userData.first_name, userData.last_name);
    if (!nameValidation.status) {
        return {
            success: false,
            message: nameValidation.message,
            data: null
        }
    }
    const validation = validateEmail(userData.email, userData.password);
    if (!validation.status) {
        return {
            success: false,
            message: validation.message,
            data: null
        }
    }

    if (process.env.BUILD_TYPE === 'production') {
        const verificationToken = generateToken();
        const findUserQuery = 'SELECT * FROM users WHERE email = $1';
        const userResult = await db.query(findUserQuery, [userData.email]);
        if (userResult.rows.length > 0) {
            return { success: false, message: 'User already exists' }
        }
        await sendSignupEmail({ to: userData.email, firstName: userData.first_name,verificationToken: verificationToken})

        const insertQuery = 'INSERT INTO users (first_name, last_name, email, password,verification_token) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const savingUser = await db.query(insertQuery, [userData.first_name, userData.last_name, userData.email, userData.password, verificationToken]);
        const user = savingUser.rows[0];
        if (!user) {
            return {
                success: false,
                message: 'User registration failed'
            };
        }
        return { success: true, message: 'Verification email sent successfully' };

    }
    const findUserQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await db.query(findUserQuery, [userData.email]);
    if (userResult.rows.length > 0) {
        return { success: false, message: 'User already exists' }
    }
    const insertQuery = 'INSERT INTO users (first_name, last_name, email, password,is_email_verified) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const savingUser = await db.query(insertQuery, [userData.first_name, userData.last_name, userData.email, userData.password, true]);
    const user = savingUser.rows[0];
    if (!user) {
        return {
            success: false,
            message: 'User registration failed'
        };
    }
    return { success: true, message: 'thank you for signing up' };
}

async function loginService(userData) {
    const validation = validateEmail(userData.email, userData.password);
    if (!validation.status) {
        return {
            success: false,
            message: validation.message,
            data: null
        }
    }
    if (process.envBUILD_TYPE == 'production') {
        //production code here
    }
    try {
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [userData.email]);

        if (userResult.rows.length === 0) {
            return {
                success: false,
                message: 'User not found',
                data: null
            };
        }

        const user = userResult.rows[0];
        if (user.is_email_verified == false) {
            return {
                success: false,
                message: 'You are not registered yet, please verify your email'
            }
        }

        user.is_active = true;
        const isPasswordMatch = userData.password === user.password;
        if (!isPasswordMatch) {
            return {
                success: false,
                message: 'Invalid password',
                data: null
            };
        }

        const token = JwtServices.generateToken({ id: user.id, email: user.email, password: user.password, role:user.role });

        return {
            success: true,
            message: 'User logged in successfully',
            data: user,
            token: token
        };
    } catch (err) {
        return { success: false, message: `Error in login: ${err.message}` }
    }




}

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}


module.exports = { signupService, loginService }