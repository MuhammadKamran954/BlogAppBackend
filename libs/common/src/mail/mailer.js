const nodemailer = require('nodemailer');
require('dotenv').config();
async function sendSignupEmail({to, firstName,verificationToken}){
        try{
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_SECURE === 'false', // true for 465, false for 587
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                },
                tls:{
                        rejectUnauthorized: false
                },
                logger:false,
                debug: false
            });

            const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`
            const mailOptions = {
                from: `"Blogs App" <${process.env.SMTP_USER}>`,
                to: to,
                subject: 'Verify Your Email',
                html: `
                <h2>Hi ${firstName},</h2>
                <p>Thank you for signing up. Please verify your email by clicking the link below:</p>
                <a href="${verificationUrl}">Verify Email</a>
                <p>If you did not sign up, please ignore this email.</p>
            `           
         };
            await transporter.sendMail(mailOptions);
            console.log('Signup email sent successfully to', to);
            return {
                success:false,
                message: 'Signup email sent successfully to', to
            }
        }catch (err) {
            console.error('Failed to send signup email:', err);
            return {
                success:false,
                message: 'Failed to send signup email'
            }
        }
}


module.exports = { sendSignupEmail };