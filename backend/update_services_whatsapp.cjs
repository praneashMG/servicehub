const pool = require("./config/db");

const updateSchema = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("Adding whatsapp_number column to services table...");

    await client.query(`
      ALTER TABLE services
      ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20);
    `);
    
    // Set a default whatsapp number for existing services
    await client.query(`
      UPDATE services
      SET whatsapp_number = '919876543210'
      WHERE whatsapp_number IS NULL;
    `);

    console.log("Successfully updated services schema!");
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
