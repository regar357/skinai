# SkinAI Backend API Specification

## Overview
SkinAI is a mobile web service for AI-based skin diagnosis. This document outlines all required APIs for backend integration.

## Base Configuration
- **Base URL**: `https://api.skinai.com`
- **API Version**: `v1`
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer Token

---

## 1. Authentication APIs

### 1.1 User Registration
**POST** `/api/v1/auth/register`

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "createdAt": "string"
    },
    "token": "string"
  },
  "message": "Registration successful"
}
```

### 1.2 User Login
**POST** `/api/v1/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string"
    },
    "token": "string"
  },
  "message": "Login successful"
}
```

### 1.3 Refresh Token
**POST** `/api/v1/auth/refresh`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "string"
  }
}
```

### 1.4 Logout
**POST** `/api/v1/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 2. User Profile APIs

### 2.1 Get User Profile
**GET** `/api/v1/user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### 2.2 Update User Profile
**PUT** `/api/v1/user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "updatedAt": "string"
  },
  "message": "Profile updated successfully"
}
```

### 2.3 Delete Account
**DELETE** `/api/v1/user/account`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 3. Skin Diagnosis APIs

### 3.1 Analyze Skin Image
**POST** `/api/v1/analyze`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
image: File
gender: string (male|female)
age: number
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "imagePreview": "string",
    "overallScore": number,
    "status": "good|warn",
    "summary": "string",
    "details": {
      "moisture": number,
      "uv": number,
      "barrier": number,
      "sebum": number
    },
    "recommendations": ["string"],
    "createdAt": "string"
  },
  "message": "Analysis completed"
}
```

---

## 4. History Management APIs

### 4.1 Get Diagnosis History
**GET** `/api/v1/history`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `sortBy`: string (date|score, default: date)
- `order`: string (asc|desc, default: desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "date": "string",
        "result": "string",
        "score": number,
        "status": "good|warn",
        "summary": "string",
        "thumbnail": "string",
        "details": {
          "moisture": number,
          "uv": number,
          "barrier": number,
          "sebum": number
        }
      }
    ],
    "pagination": {
      "currentPage": number,
      "totalPages": number,
      "totalItems": number,
      "itemsPerPage": number
    }
  }
}
```

### 4.2 Get Diagnosis Detail
**GET** `/api/v1/history/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "date": "string",
    "imagePreview": "string",
    "overallScore": number,
    "status": "good|warn",
    "summary": "string",
    "details": {
      "moisture": number,
      "uv": number,
      "barrier": number,
      "sebum": number
    },
    "recommendations": ["string"],
    "createdAt": "string"
  }
}
```

### 4.3 Delete Diagnosis Records
**DELETE** `/api/v1/history/batch-delete`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "ids": ["string"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Records deleted successfully"
}
```

---

## 5. Hospital Finder APIs

### 5.1 Get Nearby Hospitals
**GET** `/api/v1/hospitals`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `lat`: number (latitude)
- `lng`: number (longitude)
- `radius`: number (km, default: 10)
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `sortBy`: string (distance|rating, default: distance)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "name": "string",
        "address": "string",
        "phone": "string",
        "hours": "string",
        "rating": number,
        "distance": number,
        "isOpen": boolean,
        "coordinates": {
          "lat": number,
          "lng": number
        }
      }
    ],
    "pagination": {
      "currentPage": number,
      "totalPages": number,
      "totalItems": number,
      "itemsPerPage": number
    }
  }
}
```

### 5.2 Get Hospital Details
**GET** `/api/v1/hospitals/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "address": "string",
    "phone": "string",
    "hours": "string",
    "rating": number,
    "distance": number,
    "isOpen": boolean,
    "coordinates": {
      "lat": number,
      "lng": number
    },
    "services": ["string"],
    "description": "string",
    "website": "string"
  }
}
```

---

## 6. Encyclopedia/Content APIs

### 6.1 Get Encyclopedia Articles
**GET** `/api/v1/encyclopedia`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `category`: string (optional)
- `search`: string (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "title": "string",
        "content": "string",
        "category": "string",
        "icon": "string",
        "iconBg": "string",
        "iconColor": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ],
    "pagination": {
      "currentPage": number,
      "totalPages": number,
      "totalItems": number,
      "itemsPerPage": number
    }
  }
}
```

### 6.2 Get Article Details
**GET** `/api/v1/encyclopedia/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "content": "string",
    "category": "string",
    "icon": "string",
    "iconBg": "string",
    "iconColor": "string",
    "relatedArticles": ["string"],
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

---

## 7. Feedback & Support APIs

### 7.1 Submit Feedback
**POST** `/api/v1/feedback`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": number (1-5),
  "message": "string",
  "category": "string",
  "deviceInfo": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully"
}
```

### 7.2 Get Notices
**GET** `/api/v1/notices`

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `type`: string (update|maintenance|feature|bug, optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "title": "string",
        "content": "string",
        "type": "string",
        "date": "string",
        "isRead": boolean
      }
    ],
    "pagination": {
      "currentPage": number,
      "totalPages": number,
      "totalItems": number,
      "itemsPerPage": number
    }
  }
}
```

---

## 8. File Upload APIs

### 8.1 Upload Image
**POST** `/api/v1/upload/image`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
image: File
purpose: string (diagnosis|profile)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "string",
    "filename": "string",
    "size": number,
    "mimeType": "string"
  }
}
```

---

## 9. Error Responses

All APIs return consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

### Common Error Codes:
- `UNAUTHORIZED` (401): Invalid or missing token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid input data
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error
- `SERVICE_UNAVAILABLE` (503): Service temporarily unavailable

---

## 10. Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Analysis endpoint**: 10 requests per hour per user
- **General endpoints**: 100 requests per minute per user
- **File upload**: 20 requests per hour per user

---

## 11. Security Considerations

1. **JWT Token**: Valid for 24 hours, refreshable
2. **CORS**: Configured for specific domains
3. **File Upload**: Max size 10MB, image formats only
4. **Input Validation**: All inputs validated and sanitized
5. **HTTPS**: Required for all API calls
6. **Rate Limiting**: Applied to prevent abuse

---

## 12. Database Schema (Recommended)

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean
}
```

### Diagnoses Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  imageUrl: String,
  thumbnailUrl: String,
  gender: String,
  age: Number,
  overallScore: Number,
  status: String,
  summary: String,
  details: {
    moisture: Number,
    uv: Number,
    barrier: Number,
    sebum: Number
  },
  recommendations: [String],
  createdAt: Date
}
```

### Hospitals Collection
```javascript
{
  _id: ObjectId,
  name: String,
  address: String,
  phone: String,
  hours: String,
  rating: Number,
  coordinates: {
    lat: Number,
    lng: Number
  },
  services: [String],
  description: String,
  website: String,
  isActive: Boolean
}
```

### Encyclopedia Collection
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  category: String,
  icon: String,
  iconBg: String,
  iconColor: String,
  relatedArticles: [ObjectId],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 13. Implementation Notes

### AI Analysis Integration
- Integration with ML model service for skin analysis
- Async processing with job queue for heavy computations
- Result caching for repeated analyses
- Image preprocessing and optimization

### File Storage
- Use cloud storage (AWS S3, Google Cloud Storage)
- Implement CDN for fast image delivery
- Automatic image optimization and resizing
- Backup and disaster recovery procedures

### Performance Optimization
- Database indexing for frequently queried fields
- Redis caching for session management and hot data
- API response compression
- Pagination for all list endpoints

### Monitoring & Logging
- Structured logging for all API calls
- Performance monitoring and alerting
- Error tracking and reporting
- User analytics and usage metrics

---

## 14. Testing

### Required Test Coverage
- Unit tests for all business logic
- Integration tests for API endpoints
- Load testing for high-traffic endpoints
- Security testing for authentication and authorization

### Test Data
- Mock user accounts for testing
- Sample images for analysis testing
- Test hospital data for location services
- Sample encyclopedia content

---

## 15. Deployment

### Environment Variables
```
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secret-key
DATABASE_URL=your-database-url
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=your-s3-bucket
ML_SERVICE_URL=your-ml-service-url
```

### Docker Configuration
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

This API specification covers all functionality required for the SkinAI mobile web service. The backend implementation should follow RESTful principles and ensure scalability, security, and performance.
