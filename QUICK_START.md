# HealthSync Quick Start Guide

## Fix for "Failed to fetch" Error

The error occurs because the backend server is not running. Here's how to fix it:

## 1. Start Backend Server

### Option A: Use the batch file
```bash
# From the root directory
start-backend.bat
```

### Option B: Manual start
```bash
cd backend
npm start
```

### Option C: Start both servers
```bash
# From the root directory
start-servers.bat
```

## 2. Verify Backend is Running

The backend should start on `http://localhost:5000`

You can verify by visiting: `http://localhost:5000/api/news` in your browser

## 3. Frontend Configuration

The frontend is already configured to connect to the backend via:
- Environment variable: `VITE_API_URL=http://localhost:5000`
- API Base URL: `http://localhost:5000/api`

## 4. Key Backend Routes Connected

✅ **Authentication**
- Login: `POST /api/auth/login`
- Register: `POST /api/auth/signup`
- Logout: `POST /api/auth/logout`

✅ **User Data**
- Profile: `GET /api/users/profile`
- Appointments: `GET /api/appointments/user`
- Health Logs: `GET /api/health/logs`
- Reminders: `GET /api/reminders`

✅ **Features**
- Doctors: `GET /api/doctors`
- Documents: `POST /api/documents/upload`
- Chatbot: `POST /api/chatbot`
- News: `GET /api/news`
- Predictive Scoring: `POST /api/predictive-score/calculate`

## 5. Error Handling

The frontend now includes proper error handling:
- Graceful fallbacks when backend is unavailable
- Proper authentication token management
- Loading states for better UX

## 6. Development Workflow

1. Start backend: `npm start` (from backend directory)
2. Start frontend: `npm run dev` (from frontend directory)
3. Access app: `http://localhost:3000`

## Troubleshooting

- **Port 5000 in use**: Change PORT in backend/.env
- **MongoDB connection**: Ensure MONGO_URI is correct in backend/.env
- **CORS issues**: Backend already configured for localhost:3000