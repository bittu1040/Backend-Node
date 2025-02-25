# API Documentation

This API provides authentication and food tracking features using Node.js, Express, MongoDB (Cloud), and JWT. It supports user registration, login, token-based authentication, and food management operations.

## Features
- User authentication with JWT
- Secure registration and login
- Token expiration and refresh mechanism
- Food tracking functionality (add, delete, list food items)
- Protected routes requiring authentication

---

1. Register User
**Endpoint:** POST /api/auth/register

**Description:** Registers a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

---

2. Login User
**Endpoint:** POST /api/auth/login

**Description:** Logs in an existing user and returns access and refresh tokens.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "your_access_token",
  "refreshToken": "your_refresh_token"
}
```

---

3. Get User Profile
**Endpoint:** GET /api/auth/profile

**Description:** Retrieves the profile of the logged-in user.

**Request Headers:**
```json
{
  "Authorization": "Bearer your_access_token"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "date": "2025-02-25T00:00:00.000Z"
}
```

---

4. Add Food
**Endpoint:** POST /api/food/add

**Description:** Adds a new food item for the logged-in user.

**Request Headers:**
```json
{
  "Authorization": "Bearer your_access_token"
}
```

**Request:**
```json
{
  "name": "Apple",
  "calories": 95
}
```

**Response:**
```json
{
  "_id": "food_id",
  "user": "user_id",
  "name": "Apple",
  "calories": 95,
  "date": "2025-02-25T00:00:00.000Z"
}
```

---

5. Delete Food
**Endpoint:** DELETE /api/food/delete/:id

**Description:** Deletes a food item by ID for the logged-in user.

**Request Headers:**
```json
{
  "Authorization": "Bearer your_access_token"
}
```

**Response:**
```json
{
  "message": "Food item removed"
}
```

---

6. List All Food
**Endpoint:** GET /api/food/list

**Description:** Lists all food items for the logged-in user.

**Request Headers:**
```json
{
  "Authorization": "Bearer your_access_token"
}
```

**Response:**
```json
[
  {
    "_id": "food_id",
    "user": "user_id",
    "name": "Apple",
    "calories": 95,
    "date": "2025-02-25T00:00:00.000Z"
  },
  {
    "_id": "another_food_id",
    "user": "user_id",
    "name": "Banana",
    "calories": 105,
    "date": "2025-02-24T00:00:00.000Z"
  }
]
```

---

7. Refresh Token
**Endpoint:** POST /api/auth/refresh-token

**Description:** Refreshes the access token using the refresh token.

**Request:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

**Response:**
```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

