const db = require('./../../../../libs/common/src/config/db');


const users = async ()=>{

    const createEnum = `
    DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
            CREATE TYPE user_role AS ENUM ('author', 'admin');
        END IF;
    END $$;
  `;
    const query = `

    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,        
        is_active BOOLEAN DEFAULT FALSE,
        role user_role DEFAULT 'author',
        is_email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verification_token VARCHAR(255),
        UNIQUE(email)
        )`;
        await db.query(createEnum);       
        await db.query(query);       
}
module.exports = users;