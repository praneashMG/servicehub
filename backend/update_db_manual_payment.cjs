const pool = require("./config/db");

async function updateDb() {
  try {
    console.log("Starting Manual Payment Database Updates...");

    // 1. Add payment_timing to bookings
    try {
      await pool.query(`
        ALTER TABLE bookings 
        ADD COLUMN IF NOT EXISTS payment_timing VARCHAR(50) DEFAULT 'Before Service';
      `);
      console.log("✅ Bookings table updated with payment_timing.");
    } catch (err) {
      console.log("⚠️ Could not alter bookings table.", err.message);
    }

    // 2. Add screenshot_url to payments
    try {
      await pool.query(`
        ALTER TABLE payments 
        ADD COLUMN IF NOT EXISTS screenshot_url TEXT;
      `);
      console.log("✅ Payments table updated with screenshot_url.");
    } catch (err) {
      console.log("⚠️ Could not alter payments table.", err.message);
    }

    console.log("🎉 Manual Payment Database Update Complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database Update Failed:", error);
    process.exit(1);
  }
}

updateDb();
