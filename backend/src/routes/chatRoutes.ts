import { Router } from 'express';
import { getChatHistory } from '../controllers/chatController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/:id', authenticateToken, getChatHistory);

export default router;
