import { db } from '../config/db';
import { User, UserCreationParams } from '../types/user';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const UserModel = {
    create: async (user: UserCreationParams): Promise<number> => {
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO Users (name, email, password, contact_info, location, role) VALUES (?, ?, ?, ?, ?, ?)`,
            [user.name, user.email, user.password, user.contact_info, user.location, user.role]
        );
        return result.insertId;
    },

    findByEmail: async (email: string): Promise<User | null> => {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT * FROM Users WHERE email = ?`,
            [email]
        );
        return (rows.length > 0 ? rows[0] : null) as User | null;
    },

    findById: async (id: number): Promise<User | null> => {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT id, name, email, contact_info, location, role, created_at FROM Users WHERE id = ?`,
            [id]
        );
        return (rows.length > 0 ? rows[0] : null) as User | null;
    }
};
