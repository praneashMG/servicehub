const pool = require("../config/db");

const createBooking = async (req, res) => {
  const { serviceId, bookingDate, address, phone_number, notes, preferred_time, payment_timing } = req.body;
  const userId = req.user.id;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Fetch service
    const serviceRes = await client.query("SELECT title, price FROM services WHERE id = $1", [serviceId]);
    if (serviceRes.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(404).json({ message: "Service not found" });
    }
    const service = serviceRes.rows[0];

    // Create booking
    const newBooking = await client.query(
      `INSERT INTO bookings (user_id, service_id, booking_date, address, phone_number, notes, preferred_time, status, payment_timing, provider_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [userId, serviceId, bookingDate, address, phone_number, notes, preferred_time, 'Pending', payment_timing || 'Before Service', null]
    );

    // Create transaction and deduct wallet
    await client.query(
      "INSERT INTO transactions (user_id, booking_id, service_name, amount, type, status) VALUES ($1, $2, $3, $4, $5, $6)",
      [userId, newBooking.rows[0].id, service.title, service.price, 'debit', 'Completed']
    );
    await client.query(
      "UPDATE users SET wallet_balance = wallet_balance - $1 WHERE id = $2",
      [service.price, userId]
    );

    await client.query('COMMIT');
    client.release();
    
    const responseData = newBooking.rows[0];
    if (service.whatsapp_number) {
      responseData.provider_whatsapp = service.whatsapp_number;
    }
    
    res.status(201).json(responseData);
  } catch (error) {
    await client.query('ROLLBACK');
    client.release();
    console.error(error);
    res.status(500).json({ message: "Server error creating booking" });
  }
};

const getMyBookings = async (req, res) => {
  const userId = req.user.id;
  try {
    const query = `
      SELECT b.*, s.title as service_title, s.image as service_image, s.price as service_price
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `;
    const bookings = await pool.query(query, [userId]);
    res.json(bookings.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching bookings" });
  }
};

const cancelBooking = async (req, res) => {
  const userId = req.user.id;
  const bookingId = req.params.id;

  const client = await pool.connect();
  try {
    const bookingRes = await client.query("SELECT * FROM bookings WHERE id = $1 AND user_id = $2", [bookingId, userId]);
    if (bookingRes.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = bookingRes.rows[0];
    
    if (booking.status === 'Cancelled' || booking.status === 'Completed') {
      client.release();
      return res.status(400).json({ message: `Booking is already ${booking.status}` });
    }

    // Check time condition: Cannot cancel if booking is within 2 hours
    const bookingDate = new Date(booking.booking_date);
    const now = new Date();
    const hoursDifference = (bookingDate - now) / (1000 * 60 * 60);

    if (hoursDifference < 2 && hoursDifference >= 0) {
      client.release();
      return res.status(400).json({ message: "Cannot cancel booking less than 2 hours before the scheduled time." });
    } else if (hoursDifference < 0) {
      client.release();
      return res.status(400).json({ message: "Cannot cancel a booking that is already in the past." });
    }

    await client.query("UPDATE bookings SET status = 'Cancelled' WHERE id = $1", [bookingId]);
    
    client.release();
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    client.release();
    console.error(error);
    res.status(500).json({ message: "Server error cancelling booking" });
  }
};
const getBookingById = async (req, res) => {
  const bookingId = req.params.id;
  try {
    const query = `
      SELECT b.*, u.name as customer_name, s.title as service_title, s.price as service_price, s.whatsapp_number as provider_whatsapp
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      WHERE b.id = $1
    `;
    const bookingRes = await pool.query(query, [bookingId]);
    if (bookingRes.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(bookingRes.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching booking details" });
  }
};

const confirmBooking = async (req, res) => {
  const bookingId = req.params.id;
  const { arrival_time } = req.body;
  
  try {
    const updateRes = await pool.query(
      "UPDATE bookings SET status = 'Confirmed', arrival_time = $1 WHERE id = $2 RETURNING *",
      [arrival_time, bookingId]
    );
    if (updateRes.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(updateRes.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error confirming booking" });
  }
};

const declineBooking = async (req, res) => {
  const bookingId = req.params.id;
  try {
    const updateRes = await pool.query(
      "UPDATE bookings SET status = 'Cancelled' WHERE id = $1 RETURNING *",
      [bookingId]
    );
    if (updateRes.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(updateRes.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error declining booking" });
  }
};

const updateBookingStatusByUser = async (req, res) => {
  const { id } = req.params;
  const { status, payment_method } = req.body;
  const client = await pool.connect();
  try {
    const queryParts = ["status = $1"];
    const values = [status, id];
    let queryCounter = 2;

    if (payment_method) {
      queryParts.push(`payment_timing = $${queryCounter + 1}`);
      values.splice(1, 0, payment_method); // Insert payment_method at index 1
      // values array becomes: [status, payment_method, id]
    }

    const setClause = payment_method 
      ? `status = $1, payment_timing = $2`
      : `status = $1`;
    
    const queryValues = payment_method ? [status, payment_method, id] : [status, id];

    const result = await client.query(
      `UPDATE bookings SET ${setClause} WHERE id = $${payment_method ? 3 : 2} RETURNING *`,
      queryValues
    );

    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: "Booking not found" });
    }

    client.release();
    res.json(result.rows[0]);
  } catch (error) {
    client.release();
    console.error(error);
    res.status(500).json({ message: "Server error updating status" });
  }
};

const updateBookingStatusByProvider = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: "Booking not found" });
    }

    client.release();
    res.json(result.rows[0]);
  } catch (error) {
    client.release();
    console.error(error);
    res.status(500).json({ message: "Server error updating status by provider" });
  }
};

const updateProviderLocation = async (req, res) => {
  const { id } = req.params;
  const { lat, lng } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE bookings SET provider_lat = $1, provider_lng = $2 WHERE id = $3 RETURNING id, provider_lat, provider_lng`,
      [lat, lng, id]
    );

    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: "Booking not found" });
    }

    client.release();
    res.json(result.rows[0]);
  } catch (error) {
    client.release();
    console.error(error);
    res.status(500).json({ message: "Server error updating provider location" });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookingById,
  confirmBooking,
  declineBooking,
  updateBookingStatusByUser,
  updateBookingStatusByProvider,
  updateProviderLocation
};
