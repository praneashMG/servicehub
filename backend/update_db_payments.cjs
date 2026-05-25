const pool = require("./config/db");
const fs = require("fs");
const path = require("path");

const updateSchema = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("Creating payments table...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50),
        payment_screenshot VARCHAR(255),
        payment_status VARCHAR(50) DEFAULT 'Pending',
        verified_by_provider BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating uploads directory...");
    const uploadsDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    console.log("Successfully updated schema and created uploads folder!");
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error);
  } finally {
    client.release();
    process.exit();
  }
};

updateSchema();
