const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  const providerId = req.user.id;
  try {
    const activeJobsQuery = await pool.query("SELECT COUNT(*) FROM bookings WHERE provider_id = $1 AND status IN ('Accepted', 'In Progress')", [providerId]);
    const completedJobsQuery = await pool.query("SELECT COUNT(*) FROM bookings WHERE provider_id = $1 AND status = 'Completed'", [providerId]);
    
    // Earnings calculation (mock: summing payments for completed jobs. In reality depends on business logic)
    const earningsQuery = await pool.query(`
      SELECT SUM(p.amount) as total
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      WHERE b.provider_id = $1 AND p.payment_status = 'Paid' AND b.status = 'Completed'
    `, [providerId]);

    const stats = {
      activeJobs: parseInt(activeJobsQuery.rows[0].count),
      completedJobs: parseInt(completedJobsQuery.rows[0].count),
      totalEarnings: parseFloat(earningsQuery.rows[0].total || 0),
      rating: 4.8 // Mock rating
    };

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching provider stats" });
  }
};

const getAssignedBookings = async (req, res) => {
  const providerId = req.user.id;
  try {
    const query = `
      SELECT b.*, s.title as service_title, s.price as service_price, u.name as customer_name
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u ON b.user_id = u.id
      WHERE b.provider_id = $1
      ORDER BY b.created_at DESC
    `;
    const bookings = await pool.query(query, [providerId]);
    res.json(bookings.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching assigned bookings" });
  }
};

const updateBookingStatus = async (req, res) => {
  const providerId = req.user.id;
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Validate that the booking belongs to this provider
    const checkQuery = await pool.query("SELECT * FROM bookings WHERE id = $1 AND provider_id = $2", [id, providerId]);
    if (checkQuery.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found or not assigned to you" });
    }

    const updatedBooking = await pool.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    // Create Notification for the user
    await pool.query(
      "INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)",
      [updatedBooking.rows[0].user_id, "Booking Update", `Your booking status is now: ${status}`]
    );

    res.json(updatedBooking.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating booking status" });
  }
};

module.exports = {
  getDashboardStats,
  getAssignedBookings,
  updateBookingStatus
};
