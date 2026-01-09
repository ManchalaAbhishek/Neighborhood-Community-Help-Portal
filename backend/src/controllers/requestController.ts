import { Request, Response } from 'express';
import { RequestModel } from '../models/requestModel';

interface AuthRequest extends Request {
    user?: any;
}

export const createRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, category, attachments } = req.body;
        const resident_id = req.user.id;

        if (!title || !description || !category) {
            res.status(400).json({ message: 'Title, description, and category are required' });
            return;
        }

        const requestId = await RequestModel.create({
            resident_id,
            title,
            description,
            category,
            attachments
        });

        res.status(201).json({ message: 'Help request created', requestId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllRequests = async (req: Request, res: Response) => {
    try {
        const requests = await RequestModel.findAll();
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getRequestById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const request = await RequestModel.findById(id);
        if (!request) {
            res.status(404).json({ message: 'Request not found' });
            return;
        }
        res.json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Logic check: Only helpers can accept/complete (usually), or residents can cancel?
        // Simple logic for now: Helpers accept.

        let helperId = undefined;
        if (status === 'Accepted' && userRole === 'Helper') {
            helperId = userId;
        }

        const success = await RequestModel.updateStatus(id, status, helperId);
        if (!success) {
            res.status(400).json({ message: 'Update failed' });
            return;
        }

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
