const pool = require("./config/db");

async function updateDb() {
  try {
    console.log("Starting WhatsApp Feature DB Updates...");

    // 1. Update users table
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);`);
      console.log("✅ Users table updated with phone_number.");
    } catch (err) {
      console.log("⚠️ Could not update users table:", err.message);
    }

    // 2. Create providers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS providers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        whatsapp_number VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Providers table created/verified.");
    
    // Insert a mock provider for testing
    const providerCheck = await pool.query("SELECT COUNT(*) FROM providers");
    if (parseInt(providerCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO providers (name, whatsapp_number) VALUES
        ('Mock Provider', '919876543210')
      `);
      console.log("✅ Mock provider inserted.");
    }

    // 3. Update bookings table
    try {
      // Create columns if not exists
      await pool.query(`
        ALTER TABLE bookings
        ADD COLUMN IF NOT EXISTS provider_id INTEGER REFERENCES providers(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS address TEXT,
        ADD COLUMN IF NOT EXISTS notes TEXT,
        ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
        ADD COLUMN IF NOT EXISTS preferred_time VARCHAR(50),
        ADD COLUMN IF NOT EXISTS arrival_time VARCHAR(50);
      `);
      console.log("✅ Bookings table updated with provider_id, address, notes, phone, preferred_time, arrival_time.");
    } catch (err) {
      console.log("⚠️ Could not update bookings table:", err.message);
    }

    console.log("🎉 WhatsApp Feature DB Update Complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database Update Failed:", error);
    process.exit(1);
  }
}

updateDb();
