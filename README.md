# Node.js Authentication API with JWT & Refresh Token

A simple authentication API using Node.js, Express, MongoDB (Cloud), and JWT.

## Features

- ✅ User Registration & Login
- ✅ JWT-Based Authentication
- ✅ Token Expiration & Refresh Mechanism
- ✅ Protected Routes

## Additional Features

- 🔹 Image Upload Feature
- 🔹 Role-Based Access Control (RBAC)
- 🔹 Secure Cookie-Based Authentication



## API Documentation

### Register User

- **URL:** https://backend-node-kappa.vercel.app/api/auth/register
- **Method:** POST
- **Request Body:**
  - name: Bittu
  - email: Bittu@example.com
  - password: 123456
- **Response:**
  - message: User registered successfully

### Login User

- **URL:** https://backend-node-kappa.vercel.app/api/auth/login
- **Method:** POST
- **Request Body:**
  - email: Bittu@example.com
  - password: 123456
- **Response:**
  - token: ....

### Get User Profile

- **URL:** https://backend-node-kappa.vercel.app/api/auth/profile
- **Method:** GET
- **Request Header:** Authorization: Bearer <token>
- **Response:**
  - _id: 67b53533f0da12211f122773
  - name: Bittu
  - email: Bittu12@example.com
  - createdAt: 2025-02-19T01:34:43.497Z
  - updatedAt: 2025-02-19T01:34:43.497Z
  - __v: 0
 
### Refresh Token

- **URL:** https://backend-node-kappa.vercel.app/api/auth/refresh-token
- **Method:** POST
- **Request Body:**
  - refreshToken: your_refresh_token_here
- **Response:**
  - accessToken: new_access_token_here
  - refreshToken: new_refresh_token_here
- **Error Responses:**
  - 401 Unauthorized: 
    - ```json
      {
        "message": "Refresh token is required"
      }
      ```
    - ```json
      {
        "message": "Invalid refresh token"
      }
      ```
  - 500 Internal Server Error:
    - ```json
      {
        "message": "Server error",
        "error": "Detailed error message"
      }
      ```
