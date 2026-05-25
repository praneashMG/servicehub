const pool = require("../config/db");

// --- USERS ---
const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query("SELECT id, name, email, role, wallet_balance, created_at FROM users ORDER BY created_at DESC");
    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const updatedUser = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role",
      [role, id]
    );
    res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user role" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

const updateWallet = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
    const updatedUser = await pool.query(
      "UPDATE users SET wallet_balance = $1 WHERE id = $2 RETURNING id, wallet_balance",
      [amount, id]
    );
    res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update wallet" });
  }
};

// --- BOOKINGS ---
const getAllBookings = async (req, res) => {
  try {
    const query = `
      SELECT b.*, s.title as service_title, s.price as service_price, u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `;
    const bookings = await pool.query(query);
    res.json(bookings.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedBooking = await pool.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING id, status",
      [status, id]
    );
    res.json(updatedBooking.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};

const deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM bookings WHERE id = $1", [id]);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete booking" });
  }
};

// --- TRANSACTIONS & PAYMENTS ---
const getAllTransactions = async (req, res) => {
  try {
    const query = `
      SELECT t.*, u.name as user_name, u.email as user_email
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `;
    const tx = await pool.query(query);
    res.json(tx.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

const getPendingPayments = async (req, res) => {
  try {
    const query = `
      SELECT p.*, u.name as user_name, u.email as user_email, b.service_id, s.title as service_title
      FROM payments p
      JOIN users u ON p.user_id = u.id
      JOIN bookings b ON p.booking_id = b.id
      JOIN services s ON b.service_id = s.id
      WHERE p.payment_status = 'Under Review'
      ORDER BY p.created_at DESC
    `;
    const payments = await pool.query(query);
    res.json(payments.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch pending payments" });
  }
};

const verifyPayment = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'Accept' or 'Decline'

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const status = action === 'Accept' ? 'Paid' : 'Declined';
    
    // Update payment
    const updatedPayment = await client.query(
      "UPDATE payments SET payment_status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (updatedPayment.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(404).json({ message: "Payment not found" });
    }

    const payment = updatedPayment.rows[0];

    if (action === 'Accept') {
      // Update booking to Paid
      await client.query("UPDATE bookings SET status = 'Paid' WHERE id = $1", [payment.booking_id]);
      
      // Notify User
      await client.query(
        "INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)",
        [payment.user_id, "Payment Accepted", `Your payment for booking #${payment.booking_id} has been verified successfully.`]
      );
      
      // Send Email
      try {
        const sendEmail = require("../utils/email");
        const userRes = await client.query("SELECT email, name FROM users WHERE id = $1", [payment.user_id]);
        if (userRes.rows.length > 0) {
          await sendEmail({
            email: userRes.rows[0].email,
            subject: "Payment Verified - ServiceHub",
            html: `<h1>Payment Verified</h1><p>Hi ${userRes.rows[0].name},</p><p>Great news! Your manual payment for Booking #${payment.booking_id} has been verified by the admin.</p><p>Your booking is now fully confirmed and Paid.</p>`
          });
        }
      } catch (e) {
        console.error("Failed to send payment accept email", e);
      }
    } else {
      // Notify User
      await client.query(
        "INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)",
        [payment.user_id, "Payment Declined", `Your payment for booking #${payment.booking_id} was declined. Please verify your details and try again.`]
      );
    }

    await client.query('COMMIT');
    client.release();
    res.json(payment);
  } catch (error) {
    await client.query('ROLLBACK');
    client.release();
    console.error(error);
    res.status(500).json({ message: "Failed to verify payment" });
  }
};

// --- SERVICES ---
const getAllServices = async (req, res) => {
  try {
    const services = await pool.query("SELECT * FROM services ORDER BY created_at DESC");
    res.json(services.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

const createService = async (req, res) => {
  const { title, description, category, price, image, whatsapp_number } = req.body;
  try {
    const newService = await pool.query(
      "INSERT INTO services (title, description, category, price, image, whatsapp_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, description || "New service", category, price, image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80", whatsapp_number || '919876543210']
    );
    res.status(201).json(newService.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create service" });
  }
};

const updateService = async (req, res) => {
  const { id } = req.params;
  const { title, price, category, image, whatsapp_number } = req.body;
  try {
    const updatedService = await pool.query(
      "UPDATE services SET title = $1, price = $2, category = $3, image = $4, whatsapp_number = $5 WHERE id = $6 RETURNING *",
      [title, price, category, image, whatsapp_number, id]
    );
    res.json(updatedService.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update service" });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM services WHERE id = $1", [id]);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete service" });
  }
};

module.exports = {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  updateWallet,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getAllTransactions,
  getPendingPayments,
  verifyPayment,
  getAllServices,
  createService,
  updateService,
  deleteService
};
