const db = require('./../../../../libs/common/src/config/db');

const blogs = async ()=>{
    const query = `CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image VARCHAR(255),
        is_active BOOLEAN DEFAULT FALSE,
        is_verified BOOLEAN DEFAULT FALSE,
        author VARCHAR(255) NOT NULL,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        await db.query(query);
}

module.exports = blogs;