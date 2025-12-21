# System Architecture Document
## Multi-Tenant SaaS Platform – Project & Task Management System

---

## 1. Overview

This document describes the overall system architecture of the Multi-Tenant SaaS Platform. It explains how different components interact, how data is isolated per tenant, how authentication and authorization are enforced, and how APIs are structured.

The architecture follows a standard three-tier design:
- Frontend (Client Layer)
- Backend API (Application Layer)
- Database (Data Layer)

This separation ensures scalability, maintainability, and security.

---

## 2. High-Level System Architecture

### 2.1 Architecture Description

The system consists of the following components:

- **Client (Browser):**  
  Users access the application via a web browser.

- **Frontend Application:**  
  A React-based single-page application responsible for UI rendering, routing, and user interaction.

- **Backend API Server:**  
  A Node.js + Express server that handles authentication, authorization, business logic, and data access.

- **Database:**  
  PostgreSQL database storing tenants, users, projects, tasks, and audit logs with tenant-based isolation.

- **Authentication Flow:**  
  JWT-based authentication is used to secure API requests and enforce role-based access control.

---

### 2.2 Architecture Diagram

The high-level system architecture diagram illustrates:
- Client → Frontend communication
- Frontend → Backend API calls
- Backend → Database interactions
- JWT-based authentication flow

📌 **Diagram Location:**  
`docs/images/system-architecture.png`

---

## 3. Authentication & Authorization Flow

1. User logs in via the frontend.
2. Backend validates credentials and issues a JWT token.
3. JWT token is stored on the client.
4. All subsequent API requests include the JWT token.
5. Backend middleware:
   - Validates token
   - Extracts user role and tenant_id
   - Enforces RBAC and tenant isolation

This ensures secure, stateless authentication across services.

---

## 4. Database Schema Design

### 4.1 Database Overview

The database is designed using a **shared database, shared schema, tenant_id-based isolation model**.

All tenant-specific tables include a `tenant_id` column to ensure logical data separation.

---

### 4.2 Core Tables

- tenants
- users
- projects
- tasks
- audit_logs

Key design principles:
- Foreign key relationships with cascade deletes
- Indexes on tenant_id for performance
- Email uniqueness enforced per tenant
- Super Admin users have tenant_id set to NULL

---

### 4.3 Entity Relationship Diagram (ERD)

The ERD illustrates:
- Table relationships
- Primary and foreign keys
- Tenant-based isolation
- Indexed columns

📌 **Diagram Location:**  
`docs/images/database-erd.png`

---

## 5. API Architecture

The API layer follows RESTful design principles and is organized by functional modules. All responses follow a consistent format and enforce authentication and authorization where required.

---

### 5.1 Authentication APIs

| Endpoint | Method | Auth Required | Role |
|--------|--------|--------------|------|
| /api/auth/login | POST | No | Public |
| /api/auth/register | POST | No | Public |
| /api/auth/me | GET | Yes | All Roles |

---

### 5.2 Tenant Management APIs

| Endpoint | Method | Auth Required | Role |
|--------|--------|--------------|------|
| /api/tenants | POST | No | Public |
| /api/tenants | GET | Yes | Super Admin |
| /api/tenants/:id | GET | Yes | Super Admin |
| /api/tenants/:id | PUT | Yes | Super Admin |

---

### 5.3 User Management APIs

| Endpoint | Method | Auth Required | Role |
|--------|--------|--------------|------|
| /api/users | POST | Yes | Tenant Admin |
| /api/users | GET | Yes | Tenant Admin |
| /api/users/:id | GET | Yes | Tenant Admin |
| /api/users/:id | PUT | Yes | Tenant Admin |
| /api/users/:id | DELETE | Yes | Tenant Admin |

---

### 5.4 Project Management APIs

| Endpoint | Method | Auth Required | Role |
|--------|--------|--------------|------|
| /api/projects | POST | Yes | Tenant Admin |
| /api/projects | GET | Yes | All Roles |
| /api/projects/:id | GET | Yes | All Roles |
| /api/projects/:id | PUT | Yes | Tenant Admin |
| /api/projects/:id | DELETE | Yes | Tenant Admin |

---

### 5.5 Task Management APIs

| Endpoint | Method | Auth Required | Role |
|--------|--------|--------------|------|
| /api/tasks | POST | Yes | All Roles |
| /api/tasks | GET | Yes | All Roles |
| /api/tasks/:id | GET | Yes | All Roles |
| /api/tasks/:id | PUT | Yes | All Roles |
| /api/tasks/:id | DELETE | Yes | Tenant Admin |

---

## 6. Multi-Tenancy Enforcement Strategy

- tenant_id is extracted from JWT token
- All database queries include tenant_id filters
- Cross-tenant access is blocked at API level
- Super Admin access bypasses tenant filtering where appropriate

---

## 7. Conclusion

This architecture design ensures that the Multi-Tenant SaaS Platform is scalable, secure, and maintainable. The clear separation of frontend, backend, and database layers, combined with strict tenant isolation and role-based access control, provides a strong foundation for a production-ready SaaS application.
