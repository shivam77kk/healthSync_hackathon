# HealthSync Setup Guide

## Quick Start

### Option 1: Automatic Setup (Windows)
1. Double-click `start.bat` in the root directory
2. Wait for both servers to start
3. Open http://localhost:3000 in your browser

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend will run on: http://localhost:5000

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: http://localhost:3000

## Environment Configuration

### Backend (.env)
Already configured with:
- MongoDB connection
- Google OAuth credentials
- JWT secrets
- API keys

### Frontend (.env.local)
Already configured with:
- API URL: http://localhost:5000/api

## Features Working

✅ **Authentication**
- Email/Password login and signup
- Google Sign-In integration
- JWT token management
- Session persistence

✅ **User Management**
- User registration with real API
- Profile management
- Password changes
- Profile image upload

✅ **Dashboard**
- Dynamic user greeting
- Real-time data updates
- Responsive design

✅ **Appointments**
- Real appointment data from database
- No fake appointments
- Proper error handling

## API Endpoints

### Authentication
- POST `/api/users/register` - User registration
- POST `/api/users/login` - User login
- GET `/api/auth/google` - Google OAuth
- POST `/api/auth/logout` - Logout

### User Management
- GET `/api/users/profile` - Get user profile
- POST `/api/users/change-password` - Change password
- POST `/api/users/upload-profile-image` - Upload profile image

### Appointments
- GET `/api/appointments/user` - Get user appointments
- POST `/api/appointments/book` - Book appointment
- POST `/api/appointments/cancel/:id` - Cancel appointment

## Troubleshooting

### Backend Issues
1. Check MongoDB connection in console
2. Verify environment variables are loaded
3. Ensure port 5000 is available

### Frontend Issues
1. Check API connection in browser console
2. Verify backend is running on port 5000
3. Clear browser cache and localStorage

### CORS Issues
- Backend already configured for localhost:3000
- Credentials included in API requests

## Testing the Application

1. **Registration**: Create new account with email/password
2. **Google Sign-In**: Use Google OAuth flow
3. **Dashboard**: See personalized greeting with your name
4. **Appointments**: View real appointment data
5. **Logout**: Proper session cleanup

## Production Deployment

### Backend
- Update CORS origin to production domain
- Set NODE_ENV=production
- Use production MongoDB URI

### Frontend
- Update NEXT_PUBLIC_API_URL to production API
- Build with `npm run build`
- Deploy with `npm start`

The application is now fully connected and ready to use!