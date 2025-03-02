# Food Preference API

This API allows users to manage their food preferences, storing a list of foods they commonly consume.

## Base URL
```
http://your-api-domain/api/food-preferences
```

## Authentication
All endpoints require authentication via a JWT token.

---

## **Food Preference Schema**

---

## **Endpoints**

### **1. Add a Food Preference**
**Endpoint:**
```
POST /add
```
**Headers:**
```json
{
  "Authorization": "Bearer <your_token>"
}
```
**Body:**
```json
{
  "name": "Apple"
}
```
**Response:**
```json
{
  "_id": "65a1b23c4d5e6f7890123456",
  "userId": "65a1a1a1b2b2c3c3d4d4e5e5",
  "name": "Apple",
  "date": "2024-07-05T12:00:00.000Z"
}
```

---

### **2. Get All Food Preferences**
**Endpoint:**
```
GET /list
```
**Headers:**
```json
{
  "Authorization": "Bearer <your_token>"
}
```
**Response:**
```json
[
  {
    "_id": "65a1b23c4d5e6f7890123456",
    "userId": "65a1a1a1b2b2c3c3d4d4e5e5",
    "name": "Apple",
    "date": "2024-07-05T12:00:00.000Z"
  },
  {
    "_id": "65a1b23c4d5e6f7890123457",
    "userId": "65a1a1a1b2b2c3c3d4d4e5e5",
    "name": "Banana",
    "date": "2024-07-06T12:00:00.000Z"
  }
]
```

---

### **3. Delete a Food Preference**
**Endpoint:**
```
DELETE /delete/:id
```
**Headers:**
```json
{
  "Authorization": "Bearer <your_token>"
}
```
**Response:**
```json
{
  "message": "Food preference deleted"
}
```

