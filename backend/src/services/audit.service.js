const db = require('../config/db');

const logAudit = async ({
  tenant_id,
  user_id,
  action,
  entity_type,
  entity_id,
  ip_address
}) => {
  await db.query(
    `INSERT INTO audit_logs
     (tenant_id, user_id, action, entity_type, entity_id, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [tenant_id, user_id, action, entity_type, entity_id, ip_address]
  );
};

module.exports = { logAudit };
