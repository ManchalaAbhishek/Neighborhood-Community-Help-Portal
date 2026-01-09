import { Router } from 'express';
import { createRequest, getAllRequests, getRequestById, updateRequestStatus } from '../controllers/requestController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Protected Routes
router.post('/', authenticateToken, createRequest);
router.get('/', authenticateToken, getAllRequests); // Helpers view all
router.get('/:id', authenticateToken, getRequestById);
router.put('/:id/status', authenticateToken, updateRequestStatus);

export default router;
