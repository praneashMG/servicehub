const pool = require('./config/db');

async function updateDB() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log("Starting Day 5 Database Update...");

    // Create reviews table
    console.log("Creating reviews table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
        review TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create favorites table
    console.log("Creating favorites table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, service_id)
      )
    `);

    // Add phone and address to users if not exists
    console.log("Checking for address and phone in users table...");
    try {
      await client.query(`ALTER TABLE users ADD COLUMN address TEXT;`);
      console.log("Added address column to users.");
    } catch (e) {
      console.log("Address column already exists.");
    }

    try {
      await client.query(`ALTER TABLE users ADD COLUMN phone VARCHAR(20);`);
      console.log("Added phone column to users.");
    } catch (e) {
      console.log("Phone column already exists.");
    }

    await client.query('COMMIT');
    console.log("✅ Day 5 Database Update Completed Successfully!");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("❌ Error updating database:", error);
  } finally {
    client.release();
    process.exit();
  }
}

updateDB();
