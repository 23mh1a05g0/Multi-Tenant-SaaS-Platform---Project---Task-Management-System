🚀 Multi-Tenant SaaS Platform – Project & Task Management System

A production-ready, full-stack Multi-Tenant SaaS application that allows multiple organizations to manage users, projects, and tasks with strict tenant data isolation, role-based access control, and Docker-based deployment.

📌 Project Overview

This application is designed as a multi-tenant SaaS boilerplate, where:

Multiple organizations (tenants) can register independently

Each tenant manages its own users, projects, and tasks

Data is completely isolated using tenant_id

Role-based access ensures security and scalability

Fully containerized using Docker

✨ Key Features
🔐 Authentication & Authorization

Tenant registration with unique subdomain

Secure login using JWT

Role-based access control:

super_admin

tenant_admin

user

🏢 Tenant Management

Tenant-level configuration

Subscription plans and limits

Tenant isolation at database level

👥 User Management

Add, update, deactivate users

Role assignment per tenant

Enforced user limits per subscription

📁 Project Management

Create, update, delete projects

Project ownership & permissions

Project limits enforced per tenant

✅ Task Management

Create tasks under projects

Assign tasks to users

Task statuses: todo, in_progress, completed

Priority & due dates

📊 Dashboard

Total projects count

Total tasks count

Completed vs pending tasks

Recent projects

“My Tasks” section

🧾 Audit Logging

Tracks all important actions

Helps in security and debugging

🛠 Tech Stack
Frontend

React (Vite)

React Router

Axios

LocalStorage-based auth

Backend

Node.js

Express.js

JWT Authentication

bcrypt password hashing

Database

PostgreSQL

Tenant-based schema (tenant_id)

DevOps

Docker

Docker Compose

🏗 System Architecture
Browser
   ↓
Frontend (React)
   ↓  HTTP / REST
Backend API (Node + Express)
   ↓
PostgreSQL (Multi-Tenant Database)


All services run inside Docker containers.

📂 Project Structure
multi-tenant-saas/
│
├── docker-compose.yml
├── README.md
├── API.md
├── submission.json
│
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── config/
│   │   └── app.js
│   └── migrations/
│
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── auth/
│   │   └── services/
│   └── main.jsx

🐳 Running the Application (Docker)
🔧 Prerequisites

Docker

Docker Compose

▶️ Start the application
docker-compose up -d --build

🌐 Access URLs
Service	URL
Frontend	http://localhost:3000

Backend API	http://localhost:5000

Health Check	http://localhost:5000/api/health

PostgreSQL	localhost:5432
🔑 Default Credentials (Seed Data)
Super Admin
Email: superadmin@system.com
Password: Admin@123
Role: super_admin

Demo Tenant
Tenant Name: Demo Company
Subdomain: demo
Plan: pro

Tenant Admin
Email: admin@demo.com
Password: Demo@123
Role: tenant_admin

Regular Users
user1@demo.com / User@123
user2@demo.com / User@123

📑 API Documentation

All API endpoints are documented in:

📄 API.md

Includes:

Authentication APIs

Tenant APIs

User APIs

Project APIs

Task APIs

Request/response examples

🔐 Security Measures

JWT-based authentication

Password hashing using bcrypt

Tenant-level data isolation

Role-based authorization middleware

Input validation for all APIs

📦 Database Design

PostgreSQL with UUID primary keys

Foreign key constraints

Indexed tenant_id for isolation

Transaction-safe operations

🧪 Testing

API tested using Postman

Frontend tested via browser

Docker health checks verified

🚀 Deployment Ready

This project is production-ready and can be deployed to:

AWS / GCP / Azure

Docker Swarm

Kubernetes

👤 Author

Developer: Kalesha Vali Dokuparthi
Project Type: Full-Stack SaaS Application
Purpose: Skill demonstration & real-world SaaS architecture