# Quick Start Guide

## Prerequisites
- Node.js installed
- MongoDB Atlas account with connection string in .env

## Installation

```bash
cd backend
npm install
```

## Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start at: `http://localhost:3000`

## Project Structure

The backend follows a clean **layered architecture**:

- **Routes** → Endpoints definition
- **Controllers** → Request handling logic
- **Services** → Business logic (e.g., careerEngine)
- **Models** → Database schemas
- **Middleware** → Cross-cutting concerns (e.g., auth)
- **DB** → Database connection

## Key Technologies

- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests

## Features Implemented

### Authentication
- ✅ User signup with validation
- ✅ Password hashing with bcrypt
- ✅ Login with JWT token generation
- ✅ Token-based authorization

### Career Guidance API
- ✅ Protected endpoint (requires JWT)
- ✅ Rule-based career matching
- ✅ Keyword recognition for different fields
- ✅ Returns career paths, skills, and next steps

### Data Model
- User documents with all required fields
- Timestamps for created/updated tracking
- Password comparison method for verification

## Testing the API

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API endpoints and curl examples.

Quick test:
```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","mobileNumber":"1234567890","email":"test@test.com","password":"123","age":20,"educationalQualification":"12th","languagePreference":"English","interests":["coding"]}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123"}'

# Use the returned token for career guidance
```

## Features Implemented

- ✅ User signup with password hashing (bcrypt)
- ✅ User login with JWT token generation
- ✅ **Logout functionality** (stateless JWT)
- ✅ **Update user profile** (name, email, mobile number)
- ✅ **Change password** with old password verification
- ✅ **Delete account** with password verification
- ✅ Protected career guidance API endpoint
- ✅ Rule-based career matching engine
- ✅ Clean layered architecture
- ✅ Error handling
- ✅ MongoDB integration
- ✅ CORS enabled

## Testing the API

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API endpoints and curl examples.

Quick test flow:
```bash
# 1. Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","mobileNumber":"1234567890","email":"test@test.com","password":"123","age":20,"educationalQualification":"12th","languagePreference":"English","interests":["coding"]}'

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123"}'

# 3. Update Profile
TOKEN="your_token_here"
curl -X PATCH http://localhost:3000/api/auth/update-profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Updated Name","email":"new@test.com"}'

# 4. Change Password
curl -X PUT http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"oldPassword":"123","newPassword":"456"}'

# 5. Career Guidance (protected)
curl -X POST http://localhost:3000/api/career/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query":"I want to code"}'

# 6. Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"

# 7. Delete Account
curl -X DELETE http://localhost:3000/api/auth/delete-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"password":"456"}'
```

## Code Quality

- ✅ ES modules (type: module)
- ✅ Clean and readable code
- ✅ Proper error handling
- ✅ Input validation
- ✅ Secure password handling
- ✅ Environment configuration

## Notes

- The career engine uses simple rule-based matching and can be extended with AI/ML
- JWT tokens expire in 7 days
- All endpoints return JSON responses
- MongoDB connection is logged on startup
- All account modification endpoints (update, change password, delete) require authentication

