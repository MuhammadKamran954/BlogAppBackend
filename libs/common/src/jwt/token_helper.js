const JwtServices = require('./jwt_service');

function verifyTokenAndGetPayload(req, res) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        res.status(401).json({ success: false, message: 'Authorization token is required' });
        return { success: false };
    }

    try {
        const decoded = JwtServices.verifyToken(token);
        return { success: true, decoded };
    } catch (err) {
        console.error('JWT Error:', err.message); 
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
        return { success: false };
    }
}



module.exports = { verifyTokenAndGetPayload };