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

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/node-auth-api.git
   cd node-auth-api
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Install & Setup MongoDB Locally:**
   - **Download MongoDB Community Edition:**
     - [Download here](https://www.mongodb.com/try/download/community)
   - **Install MongoDB:**
     - Follow the installation instructions for your operating system.
   - **Add MongoDB to PATH (if needed):**
     ```sh
     export PATH=/usr/local/bin/mongodb/bin:$PATH  # macOS/Linux
     ```
   - **Start MongoDB Service:**
     ```sh
     mongod --dbpath /path/to/data/directory
     ```
     If you haven't created a data directory, do:
     ```sh
     mkdir -p ~/data/db
     mongod --dbpath ~/data/db
     ```
   - **Verify MongoDB is Running:**
     ```sh
     mongo
     ```
     If connected successfully, you should see the MongoDB shell.
4. **Generate environment variables:**
   - **MongoDB Local Development URI:**
     ```sh
     mongodb://localhost:27017/authDB
     ```
   - **Generate JWT Secret & Refresh Token Secret:**
     ```sh
     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
     ```
     Run this twice to get a JWT secret and a refresh token secret.
5. **Create a `.env` file and configure environment variables:**
   ```env
   MONGO_URI=mongodb://localhost:27017/authDB
   JWT_SECRET=your_generated_jwt_secret
   REFRESH_TOKEN_SECRET=your_generated_refresh_token_secret
   ```
6. **Replace `process.env` references with `.env` variables in your code:**
   - Open your project files and update any `process.env.CODE` to use the corresponding environment variable from the `.env` file.
   - Example:
     ```js
     const JWT_SECRET = require("dotenv").config().parsed.JWT_SECRET || process.env.JWT_SECRET;
     const jwtSecret = JWT_SECRET; // Change to use .env file.env" >> .gitignore
     ```
7. **Start the server:**
   ```sh
   npm start
   ```
   The server will run on `http://localhost:5000`

## API Documentation

### Register User

- **URL:** `/api/auth/register`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully"
  }
  ```

### Login User

- **URL:** `/api/auth/login`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "your_access_token_here"
  }
  ```

### Get User Profile

- **URL:** `/api/auth/profile`
- **Method:** GET
- **Request Header:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "createdAt": "2025-03-30T12:00:00.000Z",
    "updatedAt": "2025-03-30T12:00:00.000Z"
  }
  ```

### Refresh Token

- **URL:** `/api/auth/refresh-token`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "refreshToken": "your_refresh_token_here"
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "new_access_token_here",
    "refreshToken": "new_refresh_token_here"
  }
  ```

## Contribution Guide

We welcome contributions to improve this API! Follow these steps to contribute:

1. **Fork the repository** and clone it locally.
2. **Create a new branch** for your feature or fix:
   ```sh
   git checkout -b feature/new-feature
   ```
3. **Commit your changes**:
   ```sh
   git commit -m "Added a new feature"
   ```
4. **Push to your fork**:
   ```sh
   git push origin feature/new-feature
   ```
5. **Create a pull request** explaining your changes.

Happy coding! 🚀