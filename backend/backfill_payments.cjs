const pool = require("./config/db");

const backfillTransactions = async () => {
  try {
    console.log("Starting to backfill transactions for existing bookings...");
    
    // Get all bookings that do not have a transaction yet
    const result = await pool.query(`
      SELECT b.id as booking_id, b.user_id, s.title, s.price 
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      LEFT JOIN transactions t ON b.id = t.booking_id
      WHERE t.id IS NULL
    `);

    const bookings = result.rows;
    console.log(`Found ${bookings.length} existing bookings without transactions.`);

    for (const b of bookings) {
      // 1. Insert transaction
      await pool.query(
        "INSERT INTO transactions (user_id, booking_id, service_name, amount, type, status) VALUES ($1, $2, $3, $4, $5, $6)",
        [b.user_id, b.booking_id, b.title, b.price, 'debit', 'Completed']
      );
      
      // 2. Deduct from wallet
      await pool.query(
        "UPDATE users SET wallet_balance = wallet_balance - $1 WHERE id = $2",
        [b.price, b.user_id]
      );
      
      console.log(`Generated bill for booking ${b.booking_id} (User: ${b.user_id}) for $${b.price}`);
    }

    console.log("Backfill completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error backfilling:", error);
    process.exit(1);
  }
};

backfillTransactions();
