const { Pool } = require('pg');
const pool = new Pool({ user: 'postgres', host: 'localhost', database: 'servicehub', password: 'pranika1234', port: 5432 });

const runMigration = async () => {
  try {
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT");
    console.log("Successfully added profile_image column to users table.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    pool.end();
  }
};

runMigration();
