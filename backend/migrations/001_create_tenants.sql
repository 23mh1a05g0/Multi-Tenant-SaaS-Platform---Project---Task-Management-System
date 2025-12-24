-- UP
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  subdomain VARCHAR UNIQUE NOT NULL,
  status VARCHAR CHECK (status IN ('active','suspended','trial')),
  subscription_plan VARCHAR CHECK (subscription_plan IN ('free','pro','enterprise')),
  max_users INTEGER,
  max_projects INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- -- DOWN
-- DROP TABLE IF EXISTS tenants CASCADE;
