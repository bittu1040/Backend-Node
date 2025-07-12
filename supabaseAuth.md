# 📘 Supabase Auth Quick Reference

This file documents the Supabase authentication flow using email and password, including registration, login, and backend access.

---

## ✅ 1. Register User (Sign-Up)

**Endpoint**:  
`POST https://opuqrfkbmdpboskseodv.supabase.co/auth/v1/signup`

**Headers**:
- `Content-Type: application/json`
- `apikey: <your-anon-key>`   - you will get api key from supabase project settings

**Request Body**:

```json
{
  "email": "bittu.nist@gmail.com",
  "password": "your_new_password"
}
```

📩 This sends a verification email to the user.

> ✅ User must verify their email before they can log in.

---

## ✅ 2. Login User (Sign-In)

**Endpoint**:  
`POST https://opuqrfkbmdpboskseodv.supabase.co/auth/v1/token?grant_type=password`

**Headers**:
- `Content-Type: application/json`
- `apikey: <your-anon-key>`

**Request Body**:

```json
{
  "email": "bittu1040@gmail.com",
  "password": "your_new_password"
}
```

📥 Successful response contains:

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "bittu1040@gmail.com"
  }
}
```

---

## ✅ 3. Call Protected Backend API

**Endpoint**:  
`GET http://localhost:5000/api/v1/profile`

**Headers**:

```http
Authorization: Bearer <access_token>
```

ℹ️ Replace `<access_token>` with the token returned from Step 2.

---
