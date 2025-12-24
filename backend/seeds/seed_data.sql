-- SUPER ADMIN (no tenant)
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
VALUES (
  gen_random_uuid(),
  NULL,
  'superadmin@system.com',
  '$2b$10$Z2dG5y628P9K37Yq1qgQre13zs7k86K0uknqdrHdZaWJe1.wfFlc6', -- Admin@123
  'System Admin',
  'super_admin'
)
ON CONFLICT DO NOTHING;

-- DEMO TENANT
INSERT INTO tenants (id, name, subdomain, status, subscription_plan, max_users, max_projects)
VALUES (
  gen_random_uuid(),
  'Demo Company',
  'demo',
  'active',
  'pro',
  25,
  15
)
ON CONFLICT (subdomain) DO NOTHING;

-- TENANT ADMIN
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
SELECT
  gen_random_uuid(),
  t.id,
  'admin@demo.com',
  '$2b$10$7gUjOSrjnCqMsf.gslOt1.qXudTBmZ/jbJtxbFOafBmcHxuygCLLa', -- Demo@123
  'Demo Admin',
  'tenant_admin'
FROM tenants t
WHERE t.subdomain = 'demo'
ON CONFLICT DO NOTHING;

-- REGULAR USERS
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
SELECT gen_random_uuid(), t.id, 'user1@demo.com',
'$2b$10$Y.XwdYVA0Pf7/uMdWCsMieVSg/sPY6D4BZuIqtlQRXpZCfzv9xRXi',
'Demo User One', 'user'
FROM tenants t WHERE t.subdomain='demo'
ON CONFLICT DO NOTHING;

INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
SELECT gen_random_uuid(), t.id, 'user2@demo.com',
'$2b$10$Y.XwdYVA0Pf7/uMdWCsMieVSg/sPY6D4BZuIqtlQRXpZCfzv9xRXi',
'Demo User Two', 'user'
FROM tenants t WHERE t.subdomain='demo'
ON CONFLICT DO NOTHING;
