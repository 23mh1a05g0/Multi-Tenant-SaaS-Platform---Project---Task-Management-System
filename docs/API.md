# 📘 API Documentation  
## Multi-Tenant SaaS – Project & Task Management System

---

## 🔐 Authentication Overview

- Authentication is handled using **JWT (JSON Web Tokens)**
- Protected APIs require the token in request headers

### Authorization Header
Authorization: Bearer <JWT_TOKEN>

---

## 🌐 Base URLs

| Service | URL |
|------|-----|
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |

---

## 1️⃣ Authentication APIs

---

### API 1: Register Tenant
**POST** `/api/auth/register-tenant`  
**Access:** Public

#### Request Body
```json
{
  "tenantName": "Demo Company",
  "subdomain": "demo",
  "adminEmail": "admin@demo.com",
  "adminPassword": "Demo@123",
  "adminFullName": "Demo Admin"
}

## Success Response (201)

{
  "success": true,
  "message": "Tenant registered successfully",
  "data": {
    "tenantId": "uuid",
    "subdomain": "demo",
    "adminUser": {
      "id": "uuid",
      "email": "admin@demo.com",
      "fullName": "Demo Admin",
      "role": "tenant_admin"
    }
  }
}

Errors
400 Validation error
409 Subdomain or email already exists

## API 2: Login

## POST /api/auth/login
Access: Public
Request Body

{
  "email": "admin@demo.com",
  "password": "Demo@123",
  "tenantSubdomain": "demo"
}

## Success Respond(200)

{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@demo.com",
      "fullName": "Demo Admin",
      "role": "tenant_admin",
      "tenantId": "uuid"
    },
    "token": "jwt-token",
    "expiresIn": 86400
  }
}

## API 3: Get Current User

## GET /api/auth/me
Access: Protected

Success Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "admin@demo.com",
    "fullName": "Demo Admin",
    "role": "tenant_admin",
    "isActive": true,
    "tenant": {
      "id": "uuid",
      "name": "Demo Company",
      "subdomain": "demo",
      "subscriptionPlan": "free",
      "maxUsers": 5,
      "maxProjects": 3
    }
  }
}

## API 4: Logout

## POST /api/auth/logout
Access: Protected

{
  "success": true,
  "message": "Logged out successfully"
}

2️⃣ Tenant Management
## API 5: Get Tenant Details

## GET /api/tenants/:tenantId
Access: Tenant user or super_admin

## API 6: Update Tenant

## PUT /api/tenants/:tenantId
Access: tenant_admin / super_admin

## API 7: List All Tenants

## GET /api/tenants
Access: super_admin only

3️⃣ User Management
## API 8: Add User

## POST /api/tenants/:tenantId/users
Access: tenant_admin

{
  "email": "user@demo.com",
  "password": "User@123",
  "fullName": "Demo User",
  "role": "user"
}

## API 9: List Users

## GET /api/tenants/:tenantId/users
Access: Tenant users

## API 10: Update User

## PUT /api/users/:userId
Access: tenant_admin or self

## API 11: Delete User

## DELETE /api/users/:userId
Access: tenant_admin

## 4️⃣ Project Management
## API 12: Create Project

## POST /api/projects
Access: Authenticated users

{
  "name": "Website Redesign",
  "description": "UI/UX update",
  "status": "active"
}

## API 13: List Projects

## GET /api/projects

Query Params:

status

search

page

limit

## API 14: Update Project

## PUT /api/projects/:projectId
Access: tenant_admin or creator

## API 15: Delete Project

## DELETE /api/projects/:projectId
Access: tenant_admin or creator

## 5️⃣ Task Management
## API 16: Create Task

## POST /api/projects/:projectId/tasks

{
  "title": "Design homepage",
  "description": "Create UI mockups",
  "priority": "high",
  "assignedTo": "user-uuid",
  "dueDate": "2024-08-01"
}

## API 17: List Tasks

## GET /api/projects/:projectId/tasks

Filters:

status

priority

assignedTo

search

## API 18: Update Task Status

## PATCH /api/tasks/:taskId/status

{
  "status": "completed"
}

## API 19: Update Task

## PUT /api/tasks/:taskId

## API 20: Delete Task

## DELETE /api/tasks/:taskId

## 🧪 Health Check
## API 21: Health

## GET /api/health

{
  "success": true,
  "message": "Backend API is healthy"
}


