import { Response } from 'express';
import { MessageModel } from '../models/messageModel';

export const getChatHistory = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const otherUserId = parseInt(req.params.id);

        if (!otherUserId) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }

        const messages = await MessageModel.getHistory(userId, otherUserId);
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
