const db = require('./../../../../libs/common/src/config/db');

const userNotification = async () =>{
     const query = `CREATE TABLE IF NOT EXISTS user_notifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        user_id INTEGER,
        blog_id INTEGER,
        recipient_type VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    await db.query(query);
}
module.exports = userNotification;