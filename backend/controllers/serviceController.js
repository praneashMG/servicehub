const pool = require("../config/db");

const getServices = async (req, res) => {
  const { category, search, minPrice, maxPrice, minRating } = req.query;
  try {
    let query = `
      SELECT s.*, 
             COALESCE(AVG(r.rating), 0) as avg_rating,
             COUNT(r.id) as review_count
      FROM services s
      LEFT JOIN reviews r ON s.id = r.service_id
    `;
    let conditions = [];
    let values = [];
    let count = 1;

    if (category && category !== 'All') {
      conditions.push(`s.category = $${count}`);
      values.push(category);
      count++;
    }

    if (search) {
      conditions.push(`s.title ILIKE $${count}`);
      values.push(`%${search}%`);
      count++;
    }
    
    if (minPrice) {
      conditions.push(`s.price >= $${count}`);
      values.push(minPrice);
      count++;
    }

    if (maxPrice) {
      conditions.push(`s.price <= $${count}`);
      values.push(maxPrice);
      count++;
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    
    query += " GROUP BY s.id";

    if (minRating) {
      query += ` HAVING COALESCE(AVG(r.rating), 0) >= $${count}`;
      values.push(minRating);
      count++;
    }
    
    query += " ORDER BY s.created_at DESC";
    
    const services = await pool.query(query, values);
    res.json(services.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await pool.query("SELECT * FROM services WHERE id = $1", [id]);
    if (service.rows.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createService = async (req, res) => {
  const { title, description, price, category, image, is_featured, is_active } = req.body;
  try {
    const newService = await pool.query(
      "INSERT INTO services (title, description, price, category, image, is_featured, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, description, price, category, image, is_featured || false, is_active !== false]
    );
    res.status(201).json(newService.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateService = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category, image, is_featured, is_active } = req.body;
  try {
    const updatedService = await pool.query(
      "UPDATE services SET title = $1, description = $2, price = $3, category = $4, image = $5, is_featured = $6, is_active = $7 WHERE id = $8 RETURNING *",
      [title, description, price, category, image, is_featured, is_active, id]
    );
    if (updatedService.rows.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(updatedService.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedService = await pool.query("DELETE FROM services WHERE id = $1 RETURNING *", [id]);
    if (deletedService.rows.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ message: "Service removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
