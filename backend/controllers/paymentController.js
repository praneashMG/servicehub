const pool = require("../config/db");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'demo_secret'
});

const createOrder = async (req, res) => {
  const { amount, booking_id } = req.body;
  const user_id = req.user.id;

  try {
    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${booking_id || Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        booking_id
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create payment order" });
  }
};

const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id, amount, payment_method } = req.body;
  const user_id = req.user.id;

  try {
    let isValid = true;
    
    // If not using demo keys, verify signature
    if (process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET !== 'demo_secret') {
      const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
      shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = shasum.digest("hex");
      
      if (digest !== razorpay_signature) {
        isValid = false;
      }
    }

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Transaction not legit!" });
    }

    const transaction_id = razorpay_payment_id || ("txn_" + Math.random().toString(36).substr(2, 9));

    const paymentResult = await pool.query(
      "INSERT INTO payments (user_id, booking_id, amount, payment_status, payment_method, transaction_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [user_id, booking_id, amount, 'Paid', payment_method || 'Razorpay', transaction_id]
    );

    // Update booking status
    if (booking_id) {
      await pool.query("UPDATE bookings SET status = 'Paid' WHERE id = $1", [booking_id]);
    }

    // Create Notification
    await pool.query(
      "INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)",
      [user_id, "Payment Successful", `Your payment of INR ${amount} was successful.`]
    );

    res.json({
      success: true,
      message: "Payment verified successfully",
      payment: paymentResult.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to verify payment" });
  }
};

const getHistory = async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await pool.query("SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC", [user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payment history" });
  }
};

const manualPayment = async (req, res) => {
  const { booking_id, amount, transaction_id, screenshot_url } = req.body;
  const user_id = req.user.id;

  try {
    const paymentResult = await pool.query(
      "INSERT INTO payments (user_id, booking_id, amount, payment_status, payment_method, transaction_id, screenshot_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [user_id, booking_id, amount, 'Under Review', 'Manual', transaction_id, screenshot_url]
    );

    // Create Notification
    await pool.query(
      "INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)",
      [user_id, "Payment Under Review", `Your manual payment of $${amount} is being verified by an admin.`]
    );

    res.json({
      success: true,
      message: "Payment submitted successfully",
      payment: paymentResult.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit manual payment" });
  }
};

const getPaymentByBookingId = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM payments WHERE booking_id = $1 ORDER BY created_at DESC LIMIT 1", [bookingId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No payment found for this booking" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payment details" });
  }
};

const verifyManualPayment = async (req, res) => {
  const { id } = req.params;
  const { status, booking_id } = req.body;
  try {
    const paymentResult = await pool.query(
      "UPDATE payments SET payment_status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (booking_id && status === 'Verified') {
      await pool.query("UPDATE bookings SET status = 'Payment Verified' WHERE id = $1", [booking_id]);
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      payment: paymentResult.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to verify manual payment" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getHistory,
  manualPayment,
  getPaymentByBookingId,
  verifyManualPayment
};
