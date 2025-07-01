const { date } = require('joi');
const { verifyTokenAndGetPayload } = require('./../../../../libs/common/src/jwt/token_helper');
const { getUserNotificationService, adminNotificationService, markAsReadService } = require('./../service/service');


async function userNotificationController(req, res) {
    const tokenResult = verifyTokenAndGetPayload(req, res);
    if (!tokenResult.success) return;
    const userId = tokenResult.decoded.id;
    const response = await getUserNotificationService(userId);
    if (response && response.success) {
        return res.status(200).json({
            success: response.success,
            message: response.message,
            data: response.data
        })
    } else {
        return res.status(400).json({
            success: response.success,
            message: response.message
        })
    }
}

async function adminNotificationController(req, res) {
    const tokenResult = verifyTokenAndGetPayload(req, res);
    if (!tokenResult.success) return;
    const userId = tokenResult.decoded.id;
    const response = await adminNotificationService(userId);
    if (response && response.success) {
        return res.status(200).json({
            success: response.success,
            message: response.message,
            data: response.data
        })
    } else {
        return res.status(400).json({
            success: response.success,
            message: response.message
        })
    }
}

async function markAsReadController(req, res) {
    const tokenResult = verifyTokenAndGetPayload(req, res);
    if (!tokenResult.success) return;
    const userId = tokenResult.decoded.id;
    const notificationId = req.query.notificationId;
    const response = await markAsReadService(userId, notificationId);
    if (response && response.success) {
        return res.status(200).json({
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

module.exports = { userNotificationController, adminNotificationController, markAsReadController }