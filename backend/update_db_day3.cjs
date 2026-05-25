const pool = require("./config/db");

const updateDatabase = async () => {
  try {
    console.log("Starting Day 3 database migrations...");

    // 1. Add role to users
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
    `);
    console.log("Added 'role' to users table.");

    // 2. Add address, phone, notes to bookings
    await pool.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS notes TEXT;
    `);
    console.log("Added 'address', 'phone', 'notes' to bookings table.");

    // 3. Create providers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS providers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        company_name VARCHAR(150),
        earnings DECIMAL(10, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Created 'providers' table.");

    console.log("Database migrations completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error migrating database:", error);
    process.exit(1);
  }
};

updateDatabase();
