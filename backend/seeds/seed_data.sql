-- =========================
-- PASSWORD HASHES
-- =========================
-- Passwords are pre-hashed using bcrypt
-- Admin@123  -> $2b$10$wH8QJzKxKXq8kZPZ8QXHMej2x1YgnPZXoqBYwygJyI072QtdgQXlW
-- Demo@123   -> $2b$10$Z1Yz1sZzJ0MZpM8b2P9n9u6ZcK0p7FpC18JNpDutLCRa14Q6gttxy
-- User@123   -> $2b$10$Q9F7uHj8vLZ0q0nPzY1J8ONb4RrP0P3jK5XxZJr1C2A0mJp6k8U8e

-- =========================
-- SUPER ADMIN (NO TENANT)
-- =========================

INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active
) VALUES (
    uuid_generate_v4(),
    NULL,
    'superadmin@system.com',
    '$2b$10$wH8QJzKxKXq8kZPZ8QXHMej2x1YgnPZXoqBYwygJyI072QtdgQXlW',
    'System Super Admin',
    'super_admin',
    true
);

-- =========================
-- TENANT: DEMO COMPANY
-- =========================

INSERT INTO tenants (
    id,
    name,
    subdomain,
    status,
    subscription_plan,
    max_users,
    max_projects
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Demo Company',
    'demo',
    'active',
    'pro',
    25,
    15
);

-- =========================
-- TENANT ADMIN
-- =========================

INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'admin@demo.com',
    '$2b$10$Z1Yz1sZzJ0MZpM8b2P9n9u6ZcK0p7FpC18JNpDutLCRa14Q6gttxy',
    'Demo Tenant Admin',
    'tenant_admin',
    true
);

-- =========================
-- REGULAR USERS
-- =========================

INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active
) VALUES
(
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'user1@demo.com',
    '$2b$10$Q9F7uHj8vLZ0q0nPzY1J8ONb4RrP0P3jK5XxZJr1C2A0mJp6k8U8e',
    'Demo User One',
    'user',
    true
),
(
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'user2@demo.com',
    '$2b$10$Q9F7uHj8vLZ0q0nPzY1J8ONb4RrP0P3jK5XxZJr1C2A0mJp6k8U8e',
    'Demo User Two',
    'user',
    true
);

-- =========================
-- PROJECTS
-- =========================

INSERT INTO projects (
    id,
    tenant_id,
    name,
    description,
    status,
    created_by
) VALUES
(
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Demo Project Alpha',
    'First demo project',
    'active',
    '22222222-2222-2222-2222-222222222222'
),
(
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Demo Project Beta',
    'Second demo project',
    'active',
    '22222222-2222-2222-2222-222222222222'
);

-- =========================
-- TASKS
-- =========================

INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    description,
    status,
    priority,
    assigned_to
) VALUES
(
    uuid_generate_v4(),
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Setup project repository',
    'Initialize repository and setup structure',
    'completed',
    'high',
    '33333333-3333-3333-3333-333333333333'
),
(
    uuid_generate_v4(),
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Design database schema',
    'Create ERD and migrations',
    'in_progress',
    'high',
    '44444444-4444-4444-4444-444444444444'
),
(
    uuid_generate_v4(),
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Implement authentication',
    'JWT based authentication',
    'todo',
    'medium',
    '33333333-3333-3333-3333-333333333333'
),
(
    uuid_generate_v4(),
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Create project APIs',
    'CRUD APIs for projects',
    'todo',
    'medium',
    '44444444-4444-4444-4444-444444444444'
),
(
    uuid_generate_v4(),
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Task assignment logic',
    'Assign tasks to users',
    'todo',
    'low',
    NULL
);

-- =========================
-- AUDIT LOG SAMPLE
-- =========================

INSERT INTO audit_logs (
    id,
    tenant_id,
    user_id,
    action,
    entity_type,
    entity_id,
    ip_address
) VALUES (
    uuid_generate_v4(),
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'SEED_DATA_INITIALIZED',
    'system',
    NULL,
    '127.0.0.1'
);
