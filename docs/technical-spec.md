# Technical Specification
## Multi-Tenant SaaS Platform – Project & Task Management System

---

## 1. Overview

This Technical Specification document describes the technical structure, development setup, and execution process of the Multi-Tenant SaaS Platform. It provides a clear understanding of how the backend, frontend, database, and Docker-based deployment are organized and how developers can set up and run the application locally or using Docker.

This document is intended for developers, evaluators, and maintainers of the system.

---

## 2. Project Structure

The project follows a clear separation of concerns with independent backend, frontend, documentation, and infrastructure configuration.

### 2.1 Root Directory Structure

project-root/
│
├── backend/
├── frontend/
├── docs/
├── docker-compose.yml
├── .env
├── README.md
├── submission.json


---

## 3. Backend Project Structure

### 3.1 Backend Folder Structure

backend/
├── src/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── services/
│ ├── middleware/
│ ├── utils/
│ ├── config/
│ └── app.js
│
├── migrations/
├── seeders/
├── tests/
├── Dockerfile
├── package.json
└── package-lock.json



---

### 3.2 Backend Folder Explanation

- **controllers/**  
  Contains request-handling logic for each API endpoint. Controllers receive requests, validate inputs, and delegate business logic to services.

- **routes/**  
  Defines API routes and maps them to corresponding controllers. Routes are organized by modules such as auth, users, tenants, projects, and tasks.

- **models/**  
  Defines database models and schema representations. Each model corresponds to a database table.

- **services/**  
  Contains business logic and transactional operations, such as tenant registration, subscription checks, and user creation.

- **middleware/**  
  Includes middleware for authentication (JWT validation), role-based access control (RBAC), tenant isolation enforcement, and error handling.

- **utils/**  
  Utility functions such as password hashing, token generation, and response formatting.

- **config/**  
  Configuration files for database connections, environment variables, and application settings.

- **migrations/**  
  Database migration files used to create and update database schema automatically on startup.

- **seeders/**  
  Seed scripts that insert initial data such as super admin users, tenants, users, projects, and tasks.

- **tests/**  
  Contains unit and integration tests for APIs and business logic.

---

## 4. Frontend Project Structure

### 4.1 Frontend Folder Structure

frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── routes/
│ ├── context/
│ ├── utils/
│ ├── App.js
│ └── index.js
│
├── public/
├── Dockerfile
├── package.json
└── package-lock.json


---

### 4.2 Frontend Folder Explanation

- **components/**  
  Reusable UI components such as buttons, forms, modals, and layout components.

- **pages/**  
  Page-level components such as Login, Registration, Dashboard, Projects, Project Details, and Users.

- **services/**  
  API service files that handle communication with the backend using HTTP requests.

- **routes/**  
  Defines frontend routes and protected route logic.

- **context/**  
  Global state management for authentication, user roles, and tenant context.

- **utils/**  
  Helper functions such as token storage, API error handling, and formatting utilities.

---

## 5. Development Setup Guide

### 5.1 Prerequisites

The following tools must be installed before running the application:

- Node.js (v18 or later)
- npm (comes with Node.js)
- Docker (v20 or later)
- Docker Compose (v2 or later)
- Git

---

### 5.2 Environment Variables

All environment variables are stored in a `.env` file or defined in `docker-compose.yml`.

Typical environment variables include:

PORT=5000
DB_HOST=database
DB_PORT=5432
DB_NAME=saas_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=dev_jwt_secret
JWT_EXPIRY=24h


⚠️ Only test/development values are used. No production secrets are included.

---

### 5.3 Installation Steps (Local Setup)

1. Clone the repository:
git clone <repository-url>


2. Install backend dependencies:


cd backend
npm install


3. Install frontend dependencies:


cd ../frontend
npm install


---

### 5.4 Running the Application Locally (Without Docker)

1. Start the backend server:


cd backend
npm run dev


2. Start the frontend application:


cd frontend
npm start


3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

### 5.5 Running the Application with Docker (Recommended)

1. From the project root, run:

docker-compose up -d


2. Services started:
- Database: http://localhost:5432
- Backend API: http://localhost:5000
- Frontend: http://localhost:3000

3. Database migrations and seed data run automatically on startup.

---

### 5.6 Running Tests

1. To run backend tests:

cd backend
npm test


---

## 6. Conclusion

This technical specification defines a clear and maintainable project structure along with detailed setup instructions. It ensures that the Multi-Tenant SaaS Platform can be easily developed, tested, and deployed using Docker, providing a consistent and reproducible development environment.
