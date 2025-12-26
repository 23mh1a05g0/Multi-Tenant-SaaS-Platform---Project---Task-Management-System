# Multi-Tenant SaaS Platform – Project & Task Management System

A full-stack **Multi-Tenant SaaS Application** that enables organizations (tenants) to manage projects, tasks, and users with strict tenant isolation, role-based access control, and a modern dashboard UI.

This project is fully **Dockerized** and uses **PostgreSQL inside Docker**, so **no local database installation is required**.

---

## 🚀 Features

### 🏢 Multi-Tenant Architecture
- Each tenant has isolated data (projects, tasks, users)
- Tenant identification using **subdomain**
- Secure tenant-level access control

### 👥 Role-Based Access Control
- **Super Admin**
- **Tenant Admin**
- **User**

### 📊 Dashboard
- Total projects count
- Total tasks count
- Completed & pending tasks
- Recent projects
- Tasks assigned to current user

### 📁 Project Management
- Create, update, delete projects
- Project status: `active`, `archived`, `completed`
- Project-level task tracking

### ✅ Task Management
- Create, update, delete tasks
- Task status: `todo`, `in_progress`, `completed`
- Assign tasks to users
- Priority levels: `low`, `medium`, `high`

### 👤 User Management
- Add, edit, delete users (Tenant Admin only)
- Assign roles (`tenant_admin`, `user`)
- Activate / deactivate users

### 🔐 Security
- Password hashing using **bcrypt**
- JWT-based authentication
- Token expiry handling
- Role-based authorization middleware
- Input validation on all APIs
- Audit logging for important actions

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Axios
- React Router
- Custom CSS (Dark UI theme)

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt

### Infrastructure
- Docker
- Docker Compose
- PostgreSQL (Dockerized)
- Database migrations & seed data

---

### 🌐 Access URLs

| Service        | URL                                   |
|---------------|---------------------------------------|
| Frontend      | http://localhost:3000                 |
| Backend API   | http://localhost:5000                 |
| Health Check  | http://localhost:5000/api/health      |
| PostgreSQL    | localhost:5432                        |



Seed Data (Test Credentials)
## 🌱 Seed Data (Default Test Credentials)

### 🔑 Super Admin
| Field    | Value |
|--------|-------|
| Email  | superadmin@system.com |
| Password | Admin@123 |
| Role | super_admin |
| Subdomain | Not Required |

---

### 🏢 Demo Tenant
| Field | Value |
|-----|-------|
| Tenant Name | Demo Company |
| Subdomain | demo |
| Plan | pro |

---

### 👤 Tenant Admin
| Field | Value |
|-----|-------|
| Email | admin@demo.com |
| Password | Demo@123 |
| Role | tenant_admin |
| Subdomain | demo |

---

### 👥 Regular Users
| Email | Password | Role | Subdomain |
|------|----------|------|-----------|
| user1@demo.com | User@123 | user | demo |
| user2@demo.com | User@123 | user | demo |


## API Documentation

All backend APIs are documented in:
API.md
Includes:
Authentication APIs
Tenant APIs
User APIs
Project APIs
Task APIs
Request and response formats

### Security

Passwords are hashed using bcrypt

JWT tokens with expiry

Tenant-level data isolation

Role-based authorization middleware

Input validation for all endpoints

###Testing

Backend APIs tested using Postman
Frontend tested via browser
Docker health checks verified

### Submission Notes

Meets all assignment requirements
Multi-tenant architecture implemented correctly
Docker-based database (no local dependency)
Secure, scalable, and modular design

### Author

Developer: ## Kalesha Vali Dokuparthi
Project Type: Full-Stack SaaS Application
Purpose: Skill demonstration and real-world SaaS system design


## 🐳 Running the Application (Docker)

### Prerequisites
- Docker
- Docker Compose

### Build and Start Services
```bash
docker-compose up -d --build




## Project Structure

```text
multi-tenant-saas/
│
├── docker-compose.yml
├── README.md
├── API.md
├── submission.json
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── migrations/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       ├── services/
│       ├── validators/
│       ├── config/
│       └── app.js
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── auth/
│       └── services/




## System Architecture

Client (Browser)
        |
        v
Frontend (React)
        |
        v
Backend API (Node.js + Express)
        |
        v
PostgreSQL Database (Multi-Tenant)

All services communicate via REST APIs and run inside Docker containers.

