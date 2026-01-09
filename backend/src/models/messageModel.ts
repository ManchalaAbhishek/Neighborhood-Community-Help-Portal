import { db } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    created_at: Date;
}

export const MessageModel = {
    create: async (senderId: number, receiverId: number, content: string): Promise<number> => {
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO Messages (sender_id, receiver_id, content) VALUES (?, ?, ?)`,
            [senderId, receiverId, content]
        );
        return result.insertId;
    },

    getHistory: async (userId1: number, userId2: number): Promise<Message[]> => {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT * FROM Messages 
             WHERE (sender_id = ? AND receiver_id = ?) 
                OR (sender_id = ? AND receiver_id = ?)
             ORDER BY created_at ASC`,
            [userId1, userId2, userId2, userId1]
        );
        return rows as Message[];
    }
};
