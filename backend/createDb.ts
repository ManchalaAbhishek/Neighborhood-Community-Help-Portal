import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS neighborhood_portal`);
        console.log('✅ Database "neighborhood_portal" created successfully');

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating database:', error);
        process.exit(1);
    }
}

createDatabase();
