const pool = require("../config/db");

const addFavorite = async (req, res) => {
  const { service_id } = req.body;
  const user_id = req.user.id;

  try {
    const existing = await pool.query(
      "SELECT id FROM favorites WHERE user_id = $1 AND service_id = $2",
      [user_id, service_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Already in favorites" });
    }

    const newFav = await pool.query(
      "INSERT INTO favorites (user_id, service_id) VALUES ($1, $2) RETURNING *",
      [user_id, service_id]
    );

    res.status(201).json(newFav.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error adding favorite" });
  }
};

const getFavorites = async (req, res) => {
  const user_id = req.user.id;

  try {
    const favorites = await pool.query(
      `SELECT f.id as favorite_id, s.* 
       FROM favorites f 
       JOIN services s ON f.service_id = s.id 
       WHERE f.user_id = $1 
       ORDER BY f.created_at DESC`,
      [user_id]
    );

    res.json(favorites.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching favorites" });
  }
};

const removeFavorite = async (req, res) => {
  const { serviceId } = req.params;
  const user_id = req.user.id;

  try {
    await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND service_id = $2",
      [user_id, serviceId]
    );
    res.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error removing favorite" });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite
};
