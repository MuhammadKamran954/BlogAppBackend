const express = require('express');
const router = express.Router();
const { userNotificationController, adminNotificationController ,markAsReadController} = require('../controller/controller');
router.get('/user_notification', userNotificationController);
router.get('/admin_notification', adminNotificationController);
router.post('/mark_as_read',markAsReadController);


module.exports = router;