import { db } from '../config/db';
import { HelpRequest, CreateRequestParams } from '../types/helpRequest';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const RequestModel = {
    create: async (data: CreateRequestParams): Promise<number> => {
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO HelpRequests (resident_id, title, description, category, attachments) VALUES (?, ?, ?, ?, ?)`,
            [data.resident_id, data.title, data.description, data.category, data.attachments || null]
        );
        return result.insertId;
    },

    findAll: async (): Promise<HelpRequest[]> => {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT hr.*, u.name as resident_name 
             FROM HelpRequests hr 
             JOIN Users u ON hr.resident_id = u.id 
             ORDER BY hr.created_at DESC`
        );
        return rows as HelpRequest[];
    },

    findById: async (id: number): Promise<HelpRequest | null> => {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT hr.*, u.name as resident_name, h.name as helper_name
             FROM HelpRequests hr 
             JOIN Users u ON hr.resident_id = u.id 
             LEFT JOIN Users h ON hr.helper_id = h.id
             WHERE hr.id = ?`,
            [id]
        );
        return (rows.length > 0 ? rows[0] : null) as HelpRequest | null;
    },

    updateStatus: async (id: number, status: string, helperId?: number): Promise<boolean> => {
        let query = `UPDATE HelpRequests SET status = ?`;
        const params: any[] = [status];

        if (helperId) {
            query += `, helper_id = ?`;
            params.push(helperId);
        }

        query += ` WHERE id = ?`;
        params.push(id);

        const [result] = await db.query<ResultSetHeader>(query, params);
        return result.affectedRows > 0;
    }
};
