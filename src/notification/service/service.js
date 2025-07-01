const db = require('./../../../../libs/common/src/config/db');

async function getUserNotificationService(userId) {
    try {
        const findNotification = await db.query('SELECT * FROM user_notifications WHERE user_id =$1 AND is_read = $2', [userId, false])
        const notification = findNotification.rows;
        return {
            success: true,
            message: notification.length > 0 ? 'Notification fetched successfully' : 'No notification found',
            data: {
                total: notification.length,
                notification: notification
            }
        }
    } catch (error) {
        console.error(`error user notifications service:${error.message}`)
        return { success: false, message: `Something went wrong` }
    }
}

async function adminNotificationService(userId) {
    try {
        const user = await db.query('SELECT * FROM users WHERE id=$1', [userId])
        if (user.rows.length > 0) {
            if (user.role == 'admin') {
                const notificationQuery = await db.query('SELECT * FROM user_notifications WHERE recipient_type=$1 AND is_read=$2', ['admin', false]);
                const notification = notificationQuery.rows

                return {
                    success: true,
                    message: notification.length > 0 ? 'Notification fetched successfully' : 'No notification found',
                    data: {
                        total: notification.length,
                        notification: notification
                    }
                }
            } else {
                return {
                    success: false,
                    message: `you are not authorized for this action`
                }
            }
        }
    } catch (error) {
        console.error(`error admin notifications service:${error.message}`)
        return {
            success: false,
            message: `Something went wrong`
        };
    }

}
async function markAsReadService(userId, notificationId) {
    try {
        const notificationFetch = await db.query('SELECT * FROM user_notifications WHERE id=$1', [notificationId])
        if (notificationFetch.rows.length === 0) {
            return {
                success: false,
                message: 'notification not found'
            };
        }
        const notification = notificationFetch.rows[0];
        if (notification.recipient_type === 'admin') {
            await db.query('UPDATE user_notifications SET is_read=$1 WHERE id=$2', [true, notificationId])
            return {
                success: true,
                message: 'notification marked as read successfully'
            }
        } else if (notification.recipient_type === 'author') {
            if (notification.user_id != userId) {
                return {
                    success: false,
                    message: 'you are not authorized for this action'
                }
            }
            await db.query('UPDATE user_notifications SET is_read=$1 WHERE id=$2', [true, notificationId])
            return {
                success: true,
                message: 'notification marked as read successfully'
            }
        }

    } catch (error) {
        console.error(`error mark as read notifications service:${error.message}`)
        return {
            success: false,
            message: `Something went wrong`
        }
    }
}
module.exports = { getUserNotificationService, adminNotificationService, markAsReadService };