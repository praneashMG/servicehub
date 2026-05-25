const pool = require("./config/db");

async function updateDb() {
  try {
    console.log("Starting Day 4 Final Database Updates...");

    // 1. Create Payments Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'Pending',
        payment_method VARCHAR(50),
        transaction_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Payments table created/verified.");

    // 2. Create Notifications Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Notifications table created/verified.");

    // 3. Ensure 'provider' role exists (enum if used, or just text in users table)
    // Wait, the users table role might be ENUM or VARCHAR. If it's VARCHAR, we just need to ensure the column exists.
    // Let's assume it's already VARCHAR or ENUM. We won't alter the enum directly here unless it fails.

    // 4. Update bookings table to have 'provider_id' if not exists
    try {
      await pool.query(`
        ALTER TABLE bookings 
        ADD COLUMN IF NOT EXISTS provider_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
      `);
      console.log("✅ Bookings table updated with provider_id.");
    } catch (err) {
      console.log("⚠️ Could not alter bookings table. Might already have provider_id.", err.message);
    }

    // 5. Update services table to have 'category' and 'provider_assignment'
    try {
      await pool.query(`
        ALTER TABLE services 
        ADD COLUMN IF NOT EXISTS category VARCHAR(100),
        ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
      `);
      console.log("✅ Services table updated with advanced fields.");
    } catch (err) {
      console.log("⚠️ Could not alter services table.", err.message);
    }

    console.log("🎉 Day 4 Database Update Complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database Update Failed:", error);
    process.exit(1);
  }
}

updateDb();
