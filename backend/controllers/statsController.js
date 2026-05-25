const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalBookingsResult = await pool.query("SELECT COUNT(*) FROM bookings WHERE user_id = $1", [userId]);
    const totalBookings = parseInt(totalBookingsResult.rows[0].count);

    const activeServicesResult = await pool.query("SELECT COUNT(*) FROM services");
    const activeServices = parseInt(activeServicesResult.rows[0].count);

    const pendingRequestsResult = await pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'Pending' AND user_id = $1", [userId]);
    const pendingRequests = parseInt(pendingRequestsResult.rows[0].count);

    const completedOrdersResult = await pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'Completed' AND user_id = $1", [userId]);
    const completedOrders = parseInt(completedOrdersResult.rows[0].count);

    res.json({
      totalBookings,
      activeServices,
      pendingRequests,
      completedOrders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getDashboardStats
};
