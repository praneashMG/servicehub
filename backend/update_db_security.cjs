const pool = require("./config/db");

const updateDatabase = async () => {
  try {
    console.log("Starting Security database migrations...");

    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS otp_code VARCHAR(10),
      ADD COLUMN IF NOT EXISTS otp_expires TIMESTAMP;
    `);
    console.log("Added 'otp_code' and 'otp_expires' to users table.");

    console.log("Security migrations completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error migrating database:", error);
    process.exit(1);
  }
};

updateDatabase();
