import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { checkConnection } from './config/db';
import initDb from './models/initDb';
import authRoutes from './routes/authRoutes';
import requestRoutes from './routes/requestRoutes';
import chatRoutes from './routes/chatRoutes';
import { MessageModel } from './models/messageModel';

dotenv.config();

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Socket.io Logic
io.on('connection', (socket) => {
    socket.on('join_room', (userId) => {
        socket.join(userId.toString());
    });

    socket.on('send_message', async (data) => {
        try {
            await MessageModel.create(data.senderId, data.receiverId, data.message);
        } catch (err) {
            console.error('Error saving message:', err);
        }
        io.to(data.receiverId.toString()).emit('receive_message', data);
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/chat', chatRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'Neighborhood Portal API' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Check DB and Init
checkConnection().then(async (connected) => {
    if (connected) {
        await initDb();
    }
});

// Start Server
server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

export default app;
