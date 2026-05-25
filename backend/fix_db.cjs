const pool = require("./config/db");

async function check() {
    try {
        await pool.query("DROP TABLE IF EXISTS providers CASCADE;");
        await pool.query(`
          CREATE TABLE providers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            whatsapp_number VARCHAR(20) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log("Recreated providers table");
        
        await pool.query(`
        INSERT INTO providers (name, whatsapp_number) VALUES
        ('Mock Provider', '919876543210')
        `);
        
        // Ensure bookings columns
        await pool.query(`
        ALTER TABLE bookings
        ADD COLUMN IF NOT EXISTS provider_id INTEGER REFERENCES providers(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS address TEXT,
        ADD COLUMN IF NOT EXISTS notes TEXT,
        ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
        ADD COLUMN IF NOT EXISTS preferred_time VARCHAR(50),
        ADD COLUMN IF NOT EXISTS arrival_time VARCHAR(50);
        `);
        console.log("Bookings updated");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
