const pool = require("../config/db");

const addReview = async (req, res) => {
  const { service_id, rating, review } = req.body;
  const user_id = req.user.id;

  try {
    // Check if user has completed a booking for this service to allow reviewing (Optional but good practice)
    const bookingRes = await pool.query(
      "SELECT id FROM bookings WHERE user_id = $1 AND service_id = $2 AND status = 'Completed' LIMIT 1",
      [user_id, service_id]
    );

    if (bookingRes.rows.length === 0) {
      return res.status(403).json({ message: "You can only review services you have completed." });
    }

    // Check if user already reviewed
    const existingReview = await pool.query(
      "SELECT id FROM reviews WHERE user_id = $1 AND service_id = $2",
      [user_id, service_id]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({ message: "You have already reviewed this service." });
    }

    const newReview = await pool.query(
      "INSERT INTO reviews (user_id, service_id, rating, review) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, service_id, rating, review]
    );

    // Fetch user details to return with review
    const userRes = await pool.query("SELECT name, profile_image FROM users WHERE id = $1", [user_id]);
    
    res.status(201).json({
      ...newReview.rows[0],
      user_name: userRes.rows[0].name,
      user_image: userRes.rows[0].profile_image
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error adding review" });
  }
};

const getServiceReviews = async (req, res) => {
  const { serviceId } = req.params;
  try {
    const reviews = await pool.query(
      `SELECT r.*, u.name as user_name, u.profile_image as user_image 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.service_id = $1 
       ORDER BY r.created_at DESC`,
      [serviceId]
    );

    const stats = await pool.query(
      "SELECT ROUND(AVG(rating), 1) as avg_rating, COUNT(id) as total_reviews FROM reviews WHERE service_id = $1",
      [serviceId]
    );

    res.json({
      reviews: reviews.rows,
      stats: stats.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching reviews" });
  }
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  const role = req.user.role;

  try {
    let query;
    let params;
    if (role === 'admin') {
      query = "DELETE FROM reviews WHERE id = $1 RETURNING *";
      params = [id];
    } else {
      query = "DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *";
      params = [id, user_id];
    }

    const deleted = await pool.query(query, params);
    
    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: "Review not found or unauthorized" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error deleting review" });
  }
};

module.exports = {
  addReview,
  getServiceReviews,
  deleteReview
};
