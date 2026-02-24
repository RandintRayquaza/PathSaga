# PathFinder AI - Backend API Documentation

## Server Setup

The backend is ready to run. Start it with:
```bash
npm start          # Run once
npm run dev        # Run with auto-reload
```

Server runs on: `http://localhost:3000`

---

## API Endpoints

### 1. **Signup** (Create new user)
**POST** `/api/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "mobileNumber": "+91 9876543210",
  "email": "john@example.com",
  "password": "securePassword123",
  "age": 22,
  "educationalQualification": "Bachelor's in Science",
  "languagePreference": "English",
  "interests": ["coding", "technology", "problem-solving"]
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "message": "User already exists"
}
```

---

### 2. **Login** (Generate JWT token)
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Invalid email or password"
}
```

---




### 3. **Logout** (Logout from account - Protected)
**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "message": "Logged out successfully. Please remove the token from client-side."
}
```

---

### 4. **Update Profile** (Update name, email, mobile number - Protected)
**PATCH** `/api/auth/update-profile`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body (all fields optional):**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "mobileNumber": "+91 9876543215"
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id_here",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "mobileNumber": "+91 9876543215"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Email already in use"
}
```

---

### 5. **Change Password** (Update password - Protected)
**PUT** `/api/auth/change-password`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "oldPassword": "securePassword123",
  "newPassword": "newSecurePassword456"
}
```

**Success Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Error Response (400):**
```json
{
  "message": "Old password is incorrect"
}
```

---

### 6. **Delete Account** (Permanently delete account - Protected)
**DELETE** `/api/auth/delete-account`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Account deleted successfully"
}
```

**Error Response (400):**
```json
{
  "message": "Password is incorrect"
}
```

---

### 7. **Career Guidance Query** (Protected endpoint)
**POST** `/api/career/ask`

**Headers:**
```
Authorization: Bearer <your_jwt_token_from_login>
```

**Request Body:**
```json
{
  "query": "I'm interested in computer science and software development"
}
```

**Success Response (200):**
```json
{
  "message": "Career guidance generated successfully",
  "data": {
    "query": "I'm interested in computer science and software development",
    "category": "tech",
    "career_paths": [
      "Software Developer",
      "Web Developer",
      "Data Analyst",
      "Cloud Engineer",
      "Mobile App Developer",
      "AI/ML Engineer"
    ],
    "skills": [
      "Programming",
      "Problem Solving",
      "System Design",
      "Databases",
      "Web Development"
    ],
    "next_steps": [
      "Start learning a programming language (Python, JavaScript)",
      "Build small projects to strengthen portfolio",
      "Learn web development with HTML, CSS, JavaScript",
      "Contribute to open-source projects"
    ]
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid token"
}
```

---

## Step-by-Step Testing Guide

### 1. Test Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "mobileNumber": "+91 9876543211",
    "email": "jane@example.com",
    "password": "password123",
    "age": 20,
    "educationalQualification": "12th pass",
    "languagePreference": "English",
    "interests": ["medicine", "health", "helping people"]
  }'
```

### 2. Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

Copy the returned `token` for the next requests.

### 3. Test Update Profile (use token from login)
```bash
TOKEN="your_token_here"

# Update name and email
curl -X PUT http://localhost:3000/api/auth/update-profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "mobileNumber": "+91 9999999999"
  }'
```

### 4. Test Change Password (use token from login)
```bash
TOKEN="your_token_here"

curl -X PUT http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "oldPassword": "password123",
    "newPassword": "newPassword456"
  }'
```

### 5. Test Logout (use token from login)
```bash
TOKEN="your_token_here"

curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Test Career Guidance (use token from login)
```bash
TOKEN="your_token_here"

curl -X POST http://localhost:3000/api/career/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "I want to become a doctor"
  }'
```

### 7. Test Delete Account (use token from login)
```bash
TOKEN="your_token_here"

# Use the NEW password if you changed it
curl -X DELETE http://localhost:3000/api/auth/delete-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "password": "newPassword456"
  }'
```

---

## Architecture

```
backend/
├── index.js                    # Entry point
├── .env                        # Environment variables
├── package.json
└── src/
    ├── app.js                  # Express app configuration
    ├── db/
    │   └── connectDB.js        # MongoDB connection
    ├── models/
    │   └── user.model.js       # User schema with bcrypt
    ├── controllers/
    │   ├── auth.controller.js  # Signup/Login logic
    │   └── career.controller.js# Career guidance logic
    ├── services/
    │   └── careerEngine.js     # Rule-based career matching
    ├── routes/
    │   ├── auth.routes.js      # Auth endpoints
    │   └── career.routes.js    # Career endpoints
    └── middleware/
        └── auth.middleware.js  # JWT verification
```

---

## Features

✅ User signup with password hashing (bcrypt)  
✅ User login with JWT token generation  
✅ Logout functionality  
✅ Update user profile (name, email, mobile number)  
✅ Change password with old password verification  
✅ Delete account with password verification  
✅ Protected career guidance API endpoint  
✅ Rule-based career matching engine  
✅ Clean layered architecture  
✅ Error handling  
✅ MongoDB integration  
✅ CORS enabled  

---

## Environment Variables (.env)

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## Future Enhancements

- Replace `careerEngine` with AI/ML model
- Add user history/favorites
- Add email verification
- Add role-based access control
- Add comprehensive logging
- Add unit/integration tests
