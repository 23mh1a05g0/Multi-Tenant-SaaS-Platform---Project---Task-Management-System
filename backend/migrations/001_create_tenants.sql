-- UP
CREATE TYPE tenant_status_enum AS ENUM ('active', 'suspended', 'trial');
CREATE TYPE subscription_plan_enum AS ENUM ('free', 'pro', 'enterprise');

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(255) UNIQUE NOT NULL,
    status tenant_status_enum DEFAULT 'trial',
    subscription_plan subscription_plan_enum DEFAULT 'free',
    max_users INTEGER DEFAULT 5,
    max_projects INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DOWN
DROP TABLE IF EXISTS tenants;
DROP TYPE IF EXISTS subscription_plan_enum;
DROP TYPE IF EXISTS tenant_status_enum;
