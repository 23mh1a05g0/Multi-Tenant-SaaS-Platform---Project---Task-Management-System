-- UP
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  user_id UUID,
  action VARCHAR NOT NULL,
  entity_type VARCHAR,
  entity_id UUID,
  ip_address VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- -- DOWN
-- DROP TABLE IF EXISTS audit_logs CASCADE;
