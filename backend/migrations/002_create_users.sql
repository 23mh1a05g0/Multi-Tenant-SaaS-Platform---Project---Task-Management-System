-- UP
CREATE TYPE user_role_enum AS ENUM ('super_admin', 'tenant_admin', 'user');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tenant_email UNIQUE (tenant_id, email)
);

-- DOWN
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS user_role_enum;
