import { db } from '../config/db';

const initDb = async () => {
    try {
        // Create Users Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS Users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                contact_info VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                role ENUM('Resident', 'Helper') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Users table ready');

        // Create HelpRequests Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS HelpRequests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                resident_id INT NOT NULL,
                helper_id INT,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                category VARCHAR(100) NOT NULL,
                status ENUM('Pending', 'Accepted', 'In-progress', 'Completed') DEFAULT 'Pending',
                attachments TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (resident_id) REFERENCES Users(id) ON DELETE CASCADE,
                FOREIGN KEY (helper_id) REFERENCES Users(id) ON DELETE SET NULL
            )
        `);
        console.log('✅ HelpRequests table ready');

        // Create Messages Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS Messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sender_id INT NOT NULL,
                receiver_id INT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE,
                FOREIGN KEY (receiver_id) REFERENCES Users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Messages table ready');

    } catch (error) {
        console.error('❌ Error creating tables:', error);
        process.exit(1);
    }
};

export default initDb;
