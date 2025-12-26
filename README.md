📌 Multi-Tenant SaaS Platform
Project & Task Management System
A full-stack multi-tenant SaaS application built with Node.js, Express, PostgreSQL, React, and Docker, supporting tenant isolation, role-based access control, and project/task management.
🚀 Features
🔐 Authentication & Authorization
JWT-based authentication
Role-based access control:
Super Admin
Tenant Admin
User
Secure password hashing using bcrypt
Token expiry handling
🏢 Multi-Tenant Architecture
Each tenant has isolated data
Tenant-specific users, projects, and tasks
Subdomain-based tenant login
📁 Project Management
Create, list, update, delete projects
Project limits enforced per tenant plan
Task counts & completion tracking
✅ Task Management
Create tasks under projects
Assign tasks to users
Update task status (todo / in_progress / completed)
Delete tasks
Priority & due-date support
👥 User Management
Tenant Admin can add/edit/delete users
Role assignment (user / tenant_admin)
Active/inactive user status
📊 Dashboard
Total projects count
Total tasks count
Completed & pending tasks
Recent projects
My assigned tasks
🛠 Tech Stack
Frontend
React (Vite)
JavaScript
CSS (custom dark UI)
Backend
Node.js
Express.js
PostgreSQL
JWT
bcrypt
DevOps
Docker
Docker Compose
Database migrations & seed scripts
🐳 Running the Application (Docker)
Prerequisites
Docker
Docker Compose
Build & Start Services
Copy code
Bash
docker-compose up -d --build
🌐 Access URLs
Service
URL
Frontend
http://localhost:3000
Backend API
http://localhost:5000
Health Check
http://localhost:5000/api/health
PostgreSQL
localhost:5432
🗄 Database
PostgreSQL runs inside Docker
Tables are created automatically using migration scripts
Seed data is inserted on startup
No local PostgreSQL installation required
Verify Tables
Copy code
Bash
docker exec -it database psql -U postgres
\c multi_tenant_saas
\dt
🌱 Seed Data (Default Logins)
🔑 Super Admin
(Does NOT require tenant subdomain)
Email: superadmin@system.com
Password: Admin@123
Role: super_admin
🏢 Demo Tenant
Tenant Name: Demo Company
Subdomain: demo
Plan: Pro
Tenant Admin
Email: admin@demo.com
Password: Demo@123
Role: tenant_admin
Subdomain: demo
Regular Users
Email
Password
user1@demo.com
User@123
user2@demo.com
User@123
👉 Tenant Admin & Users MUST login with subdomain
👉 Super Admin login does NOT use subdomain
📘 API Documentation
All backend APIs are documented in:
Copy code

API.md
Includes:
Authentication APIs
Tenant APIs
User APIs
Project APIs
Task APIs
Request & response formats
Authorization rules
🔒 Security
Passwords hashed using bcrypt
JWT tokens with expiration
Tenant-level data isolation
Role-based authorization middleware
Input validation on all endpoints
🧪 Testing
Backend APIs tested using Postman
Frontend tested via browser
Docker health checks verified
Seed logins verified
🚀 Deployment Ready
Fully Dockerized
Environment-based configuration
Can be deployed to:
AWS
Azure
GCP
Docker Swarm
Kubernetes
📦 Submission Notes
✅ Meets all assignment requirements
✅ Proper multi-tenant architecture
✅ Docker-based database (no local dependency)
✅ Secure & scalable design
✅ Real-world SaaS patterns implemented
👨‍💻 Author
Developer: Your Name
Project Type: Full-Stack SaaS Application
Purpose: Skill demonstration & real-world system design