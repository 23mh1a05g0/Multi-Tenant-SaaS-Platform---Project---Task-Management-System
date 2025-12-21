# Research Document – Multi-Tenant SaaS Platform

## 1. Multi-Tenancy Architecture Analysis

Multi-tenancy is a core architectural concept in Software as a Service (SaaS) applications where a single application instance serves multiple organizations (tenants) while ensuring proper data isolation, security, and performance. Choosing the correct multi-tenancy strategy is critical because it directly impacts scalability, cost, maintenance, security, and development complexity.

This project evaluates three commonly used multi-tenancy approaches and justifies the selected architecture based on real-world SaaS requirements.

### 1.1 Multi-Tenancy Approaches

#### Approach 1: Shared Database + Shared Schema (Tenant ID Based)

In this approach, all tenants share the same database and the same set of tables. Each table includes a `tenant_id` column, which is used to logically separate tenant data. Every query must include a tenant filter to ensure data isolation.

**Key Characteristics:**
- Single database
- Single schema
- Logical data isolation using `tenant_id`
- Application-level enforcement of isolation

---

#### Approach 2: Shared Database + Separate Schema (Per Tenant)

In this model, a single database is used, but each tenant has its own database schema. Tables are duplicated across schemas, providing better logical separation while still sharing infrastructure.

**Key Characteristics:**
- Single database
- Multiple schemas (one per tenant)
- Better isolation than shared schema
- Increased schema management complexity

---

#### Approach 3: Separate Database Per Tenant

This approach assigns a completely separate database to each tenant. It provides the highest level of isolation but significantly increases operational overhead and cost.

**Key Characteristics:**
- One database per tenant
- Strong isolation
- High infrastructure and maintenance cost
- Complex scaling and monitoring

---

### 1.2 Comparison of Multi-Tenancy Approaches

| Architecture | Pros | Cons | Scalability | Cost | Isolation Level |
|-------------|------|------|-------------|------|----------------|
| Shared DB + Shared Schema | Cost-effective, easy to scale, simple Docker setup | Requires strict query enforcement | High | Low | Medium |
| Shared DB + Separate Schema | Better isolation, reduced query risk | Schema management complexity | Medium | Medium | High |
| Separate Database Per Tenant | Strongest isolation, security | High cost, complex DevOps | Low–Medium | High | Very High |

---

### 1.3 Chosen Approach and Justification

For this project, the **Shared Database + Shared Schema with tenant_id-based isolation** approach has been selected.

**Reasons for choosing this approach:**

1. **Industry Standard for SaaS MVPs:**  
   Many successful SaaS platforms begin with shared-schema multi-tenancy due to its balance between scalability and cost.

2. **Cost Efficiency:**  
   Managing a single database significantly reduces infrastructure and operational expenses.

3. **Scalability:**  
   This approach scales efficiently as new tenants are added without provisioning additional databases or schemas.

4. **Simplified Dockerization:**  
   Docker Compose setup is simpler with one database container, which aligns well with the task’s strict Docker requirements.

5. **Controlled Isolation via Backend Logic:**  
   With proper middleware enforcing tenant_id checks, data isolation can be reliably guaranteed.

6. **Faster Development:**  
   Enables rapid development and iteration, which is critical for this assignment.

This approach is best suited for a production-ready SaaS application where security is enforced at the application layer and supported by database constraints and indexing.

---

## 2. Technology Stack Justification

Choosing the right technology stack is essential to ensure maintainability, performance, and scalability. Each component of the stack was selected after evaluating multiple alternatives.

### 2.1 Backend Framework

**Chosen Technology:** Node.js with Express.js  

**Justification:**
- Asynchronous and non-blocking I/O, ideal for API-heavy applications
- Lightweight and flexible REST API development
- Large ecosystem and community support
- Easy integration with JWT authentication and middleware
- Well-suited for Docker environments

**Alternatives Considered:**
- Django (Python): Strong framework but heavier for REST-only APIs
- Spring Boot (Java): Enterprise-grade but more complex and verbose
- FastAPI (Python): High performance but smaller ecosystem

---

### 2.2 Frontend Framework

**Chosen Technology:** React.js  

**Justification:**
- Component-based architecture
- Efficient state management
- Strong ecosystem and tooling
- Ideal for building role-based dashboards
- Large community and industry adoption

**Alternatives Considered:**
- Angular: Powerful but steep learning curve
- Vue.js: Simpler but smaller enterprise adoption

---

### 2.3 Database

**Chosen Technology:** PostgreSQL  

**Justification:**
- ACID-compliant relational database
- Excellent support for complex relationships
- Strong indexing capabilities
- Ideal for tenant-based filtering
- Widely used in production SaaS systems

**Alternatives Considered:**
- MySQL: Similar but slightly weaker advanced indexing
- MongoDB: NoSQL flexibility but less suitable for relational data

---

### 2.4 Authentication Method

**Chosen Technology:** JWT (JSON Web Tokens)  

**Justification:**
- Stateless authentication
- Scales well in distributed systems
- No server-side session storage required
- Ideal for REST APIs and Dockerized environments
- Supports role-based access control

**Alternatives Considered:**
- Session-based authentication
- OAuth-only authentication

---

### 2.5 Deployment Platform

**Chosen Technology:** Docker & Docker Compose  

**Justification:**
- Environment consistency
- One-command deployment
- Easy service orchestration
- Ideal for evaluation and CI/CD
- Eliminates environment-related issues

---

## 3. Security Considerations in Multi-Tenant Systems

Security is a critical aspect of any multi-tenant SaaS application. Improper implementation can lead to data leakage, unauthorized access, and system compromise.

### 3.1 Data Isolation Strategy

- Every table includes a `tenant_id` column
- All queries enforce tenant-level filtering
- Middleware validates tenant ownership for each request
- Super admin users are handled as a special case with `tenant_id = NULL`

---

### 3.2 Authentication & Authorization

- JWT-based authentication with 24-hour expiration
- Role-Based Access Control (RBAC) for API endpoints
- Roles include Super Admin, Tenant Admin, and User
- Authorization enforced at API level, not frontend

---

### 3.3 Password Hashing Strategy

- Passwords are hashed using bcrypt
- Salting is applied automatically
- Plain-text passwords are never stored
- Secure comparison during authentication

---

### 3.4 API Security Measures

- Input validation on all request payloads
- Use of parameterized queries to prevent SQL injection
- Proper HTTP status codes for error handling
- No sensitive data exposed in API responses

---

### 3.5 Audit Logging

- All critical actions are logged
- Includes user ID, tenant ID, action type, and timestamp
- Enables traceability and accountability
- Useful for security audits and debugging

---

## Conclusion

This research document establishes a strong architectural foundation for the multi-tenant SaaS platform. By carefully analyzing multi-tenancy models, selecting an appropriate technology stack, and defining robust security strategies, the system is designed to be scalable, secure, maintainable, and production-ready. These decisions guide all subsequent implementation steps and ensure the application meets real-world SaaS standards.
