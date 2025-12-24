/**
 * Runs seed data automatically after migrations
 */

const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

async function runSeeds() {
  try {
    const seedFile = path.join(__dirname, '../seeds/seed_data.sql');
    const sql = fs.readFileSync(seedFile, 'utf8');

    console.log('🌱 Running seed data...');
    await pool.query(sql);

    console.log('✅ Seed data inserted successfully');
  } catch (error) {
    console.error('❌ Seed data failed:', error);
    process.exit(1);
  }
}

runSeeds();
