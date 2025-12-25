# Multi-Tenant SaaS Platform – Project & Task Management System

## Overview

This project is a full-stack **Multi-Tenant SaaS application** that allows multiple organizations (tenants) to manage users, projects, and tasks in a secure and isolated environment.  
Each tenant has its own data, users, and limits enforced by subscription plans.

The application is fully containerized using **Docker**, so no local database installation is required.

---

## Features

### Authentication & Authorization
- Tenant registration with unique subdomain
- JWT-based authentication
- Role-based access control:
  - Super Admin
  - Tenant Admin
  - User

### Tenant Management
- Multi-tenant data isolation using `tenant_id`
- Subscription plans with limits
- Tenant status management (active, suspended)

### User Management
- Add, update, deactivate users
- Role assignment per tenant
- Enforced maximum user limits

### Project Management
- Create, update, delete projects
- Project ownership and permissions
- Project limits per tenant

### Task Management
- Create tasks under projects
- Assign tasks to users
- Task status tracking (`todo`, `in_progress`, `completed`)
- Priority and due dates

### Dashboard
- Total projects count
- Total tasks count
- Completed vs pending tasks
- Recent projects
- Tasks assigned to current user

### Audit Logs
- Logs important system actions for traceability

---

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- LocalStorage-based authentication

### Backend
- Node.js
- Express.js
- JWT authentication
- bcrypt password hashing

### Database
- PostgreSQL
- Multi-tenant schema using `tenant_id`

### DevOps
- Docker
- Docker Compose

---

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

## Running the Application (Docker)
Prerequisites

Docker

Docker Compose

## Build and start all services
docker-compose up -d --build

Access URLs
Service	URL
## Frontend	http://localhost:3000

## Backend API	http://localhost:5000

## Health Check	http://localhost:5000/api/health

## PostgreSQL	localhost:5432
Database

## PostgreSQL runs inside Docker

Tables are created using migration scripts on container startup

No local PostgreSQL installation is required

## To verify tables:

## docker exec -it database psql -U postgres
\c multi_tenant_saas
\dt

Seed Data (Test Credentials)
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

Security

Passwords are hashed using bcrypt

JWT tokens with expiry

Tenant-level data isolation

Role-based authorization middleware

Input validation for all endpoints

Testing

Backend APIs tested using Postman

Frontend tested via browser

Docker health checks verified

Deployment Readiness

Fully Dockerized

Environment-based configuration

Can be deployed to:

AWS

Azure

GCP

Docker Swarm

Kubernetes

Submission Notes

Meets all assignment requirements

Multi-tenant architecture implemented correctly

Docker-based database (no local dependency)

Secure, scalable, and modular design

### Author

Developer: ## Kalesha Vali Dokuparthi
Project Type: Full-Stack SaaS Application
Purpose: Skill demonstration and real-world SaaS system design