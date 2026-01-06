# Neighborhood Community Help Portal - MySQL Setup Guide

## Prerequisites
- Node.js installed
- MySQL Server installed and running

## Database Setup

### 1. Install MySQL
If you don't have MySQL installed, download it from [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)

### 2. Create Database and Tables
Run the SQL schema file to create the database and tables:

```bash
mysql -u root -p < server/database/schema.sql
```

Or manually:
1. Open MySQL command line or MySQL Workbench
2. Copy and paste the contents of `server/database/schema.sql`
3. Execute the SQL statements

### 3. Configure Database Connection
1. Navigate to the `server` folder
2. Copy `.env.example` to `.env`:
   ```bash
   cp server/.env.example server/.env
   ```
3. Edit `server/.env` and update with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=neighborhood_help_portal
   ```

## Running the Application

### Option 1: Run Frontend and Backend Together
```bash
npm run dev:all
```

### Option 2: Run Separately
Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run dev:server
```

### URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user by ID

### Help Requests
- `POST /api/requests` - Create help request
- `GET /api/requests` - Get all requests (with optional filters)
- `GET /api/requests/:id` - Get request by ID
- `PUT /api/requests/:id` - Update request status
- `DELETE /api/requests/:id` - Delete request

### Chat
- `GET /api/chat/:requestId` - Get messages for a request
- `POST /api/chat` - Send a message

## Troubleshooting

### Database Connection Error
- Verify MySQL is running: `mysql --version`
- Check credentials in `server/.env`
- Ensure database exists: `SHOW DATABASES;` in MySQL

### Port Already in Use
- Frontend (3000): Change in `vite.config.ts`
- Backend (5000): Change PORT in `server/.env`

### CORS Issues
- Backend already configured to allow cross-origin requests
- If issues persist, check `server/server.js` cors configuration
