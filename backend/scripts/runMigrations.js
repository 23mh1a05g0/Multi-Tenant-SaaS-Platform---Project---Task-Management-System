/**
 * Runs database migrations automatically on startup
 * Reads SQL files from /migrations folder in order
 */

const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

async function runMigrations() {
  try {
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    console.log('📦 Running database migrations...');

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      // Only execute UP section
      const upSql = sql.split('-- DOWN')[0];

      console.log(`➡️  Applying migration: ${file}`);
      await pool.query(upSql);
    }

    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

runMigrations();
