const { Pool } = require("pg");
const pool = new Pool({ user: 'postgres', host: 'localhost', database: 'servicehub', password: 'pranika1234', port: 5432 });

const runMigration = async () => {
  try {
    // 1. Payments Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'Pending',
        payment_method VARCHAR(50) DEFAULT 'MockPay',
        transaction_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Payments table created/updated");

    // 2. Notifications Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(150) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Notifications table created/updated");

    // 3. Update Services Table (add is_active, featured)
    await pool.query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;`);
    await pool.query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;`);
    
    // 4. Update Bookings Table (add provider_id)
    await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS provider_id INTEGER REFERENCES users(id) ON DELETE SET NULL;`);
    
    console.log("Database schema updated for Day 4 successfully!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    pool.end();
  }
};

runMigration();
